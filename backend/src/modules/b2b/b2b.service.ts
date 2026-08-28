import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RfqEntity } from './entities/rfq.entity';
import { QuoteEntity } from './entities/quote.entity';
import { RfqStatus, QuoteStatus, OrderType, OrderStatus, NotificationCategory } from '../../common/enums';
import { NotificationsService } from '../notifications/notifications.service';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class B2BService {
  private readonly logger = new Logger(B2BService.name);

  constructor(
    @InjectRepository(RfqEntity)
    private readonly rfqRepo: Repository<RfqEntity>,
    @InjectRepository(QuoteEntity)
    private readonly quoteRepo: Repository<QuoteEntity>,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    private readonly inventoryService: InventoryService,
    @InjectQueue('RFQ_MATCHING')
    private readonly matchingQueue: Queue,
  ) {}

  /** Create an RFQ (Req 13.1, 13.2) */
  async createRfq(
    buyerId: string,
    data: {
      category?: string;
      productId?: string;
      requiredQty: number;
      deliveryDate: string;
      deliveryCity: string;
      deliveryState: string;
      specNotes?: string;
      expiryDate: string;
    },
  ): Promise<RfqEntity> {
    if (!data.category && !data.productId) {
      throw new BadRequestException('Either category or productId is required');
    }
    if (data.requiredQty < 1) throw new BadRequestException('required_qty must be ≥1');
    if (data.specNotes && data.specNotes.length > 2000) {
      throw new BadRequestException('spec_notes must be ≤2000 characters');
    }

    const deliveryDate = new Date(data.deliveryDate);
    const expiryDate = new Date(data.expiryDate);
    const now = new Date();
    const minDelivery = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (deliveryDate < minDelivery) {
      throw new UnprocessableEntityException('Delivery date must be at least 7 days from now');
    }

    const daysDiff = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 1 || daysDiff > 90) {
      throw new UnprocessableEntityException('Expiry date must be 1–90 days from now');
    }

    const rfq = await this.rfqRepo.save({
      buyerId,
      category: data.category ?? null,
      productId: data.productId ?? null,
      requiredQty: data.requiredQty,
      deliveryDate,
      deliveryCity: data.deliveryCity,
      deliveryState: data.deliveryState,
      specNotes: data.specNotes ?? null,
      expiryDate,
      status: RfqStatus.OPEN,
    });

    // Enqueue matching job
    await this.matchingQueue.add({ rfqId: rfq.id }, { attempts: 3, delay: 0 });

    return rfq;
  }

  /** Submit a quote for an RFQ */
  async submitQuote(
    artisanId: string,
    rfqId: string,
    data: {
      unitPrice: number;
      moq: number;
      totalQty: number;
      estDeliveryDate: string;
      productionNotes?: string;
    },
  ): Promise<QuoteEntity> {
    const rfq = await this.rfqRepo.findOne({ where: { id: rfqId, status: RfqStatus.OPEN } });
    if (!rfq) throw new NotFoundException('RFQ not found or no longer accepting quotes');

    if (data.unitPrice <= 0) throw new UnprocessableEntityException('unit_price must be > 0');

    const quote = await this.quoteRepo.save({
      rfqId,
      artisanId,
      unitPrice: data.unitPrice,
      moq: data.moq,
      totalQty: data.totalQty,
      estDeliveryDate: new Date(data.estDeliveryDate),
      productionNotes: data.productionNotes ?? null,
      status: QuoteStatus.PENDING,
    });

    // Update RFQ status to QUOTED
    await this.rfqRepo.update(rfqId, { status: RfqStatus.QUOTED });

    // Notify buyer
    await this.notificationsService.sendToUser(rfq.buyerId, {
      category: NotificationCategory.QUOTE_RECEIVED,
      title: 'New quote received',
      body: `Artisan submitted a quote for your RFQ`,
    });

    return quote;
  }

  /** Accept a quote → create order atomically (Req 14.3) */
  async acceptQuote(buyerId: string, quoteId: string): Promise<{ orderId: string }> {
    return await this.dataSource.transaction(async (manager) => {
      const quote = await manager.findOne(QuoteEntity, {
        where: { id: quoteId, status: QuoteStatus.PENDING },
        relations: ['rfq'],
      });
      if (!quote) throw new NotFoundException('Quote not found or already processed');

      // Create order
      const order = await manager.query(
        `INSERT INTO orders (buyer_id, artisan_id, product_id, qty, unit_price, order_type, status, rfq_id, quote_id, est_delivery_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          buyerId,
          quote.artisanId,
          null,
          quote.totalQty,
          quote.unitPrice,
          OrderType.WHOLESALE,
          OrderStatus.CONFIRMED,
          quote.rfqId,
          quoteId,
          quote.estDeliveryDate,
        ],
      );
      const orderId = order[0].id;

      // Update quote and RFQ status
      await manager.update(QuoteEntity, quoteId, { status: QuoteStatus.ACCEPTED });
      await manager.update(RfqEntity, quote.rfqId, { status: RfqStatus.ACCEPTED });

      // Notify artisan
      await this.notificationsService.sendToUser(quote.artisanId, {
        category: NotificationCategory.ORDER_PLACED,
        title: 'Quote accepted',
        body: `Your quote has been accepted. Order ${orderId} created.`,
      });

      return { orderId };
    });
  }

  async rejectQuote(buyerId: string, quoteId: string): Promise<void> {
    const quote = await this.quoteRepo.findOne({ where: { id: quoteId } });
    if (!quote) throw new NotFoundException('Quote not found');
    await this.quoteRepo.update(quoteId, { status: QuoteStatus.REJECTED });

    await this.notificationsService.sendToUser(quote.artisanId, {
      category: NotificationCategory.QUOTE_RECEIVED,
      title: 'Quote rejected',
      body: 'Your quote was rejected. You may submit a revised quote if the RFQ is still open.',
    });
  }

  async getRfqMatches(rfqId: string) {
    return this.dataSource.query(
      `SELECT rm.*, ap.state, ap.district, ap.primary_craft
       FROM rfq_matches rm
       JOIN artisan_profiles ap ON ap.id = rm.artisan_id
       WHERE rm.rfq_id = $1
       ORDER BY rm.match_score DESC`,
      [rfqId],
    );
  }
}
