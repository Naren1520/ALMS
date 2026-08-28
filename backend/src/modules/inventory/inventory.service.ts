import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InventoryBatchEntity } from './entities/inventory-batch.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { ProductStatus, NotificationCategory } from '../../common/enums';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(InventoryBatchEntity)
    private readonly batchRepo: Repository<InventoryBatchEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    @InjectQueue('NOTIFICATIONS')
    private readonly notifQueue: Queue,
  ) {}

  /**
   * Atomic inventory decrement on confirmed order (Req 11.1)
   */
  async decrementForOrder(
    productId: string,
    qty: number,
    actorId: string,
    orderId?: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const product = await manager
        .createQueryBuilder(ProductEntity, 'p')
        .setLock('pessimistic_write')
        .where('p.id = :id', { id: productId })
        .getOne();

      if (!product) throw new NotFoundException('Product not found');

      if (product.inventoryQty - qty < 0) {
        throw new ConflictException(
          `Insufficient inventory. Available: ${product.inventoryQty}, requested: ${qty}`,
        );
      }

      const prevQty = product.inventoryQty;
      const newQty = prevQty - qty;

      await manager.update(ProductEntity, productId, {
        inventoryQty: newQty,
        status: newQty === 0 ? ProductStatus.OUT_OF_STOCK : product.status,
      });

      await manager.save(InventoryBatchEntity, {
        productId,
        prevQty,
        newQty,
        changeReason: orderId ? `Order ${orderId}` : 'Manual decrement',
        actorId,
      });

      // Low-inventory alert: < 20% of monthly capacity (Req 11.8)
      if (product.inventoryQty !== null) {
        const artisanProfile = await manager.query(
          'SELECT monthly_capacity FROM artisan_profiles WHERE id = (SELECT artisan_id FROM products WHERE id = $1)',
          [productId],
        );
        const cap = artisanProfile?.[0]?.monthly_capacity;
        if (cap && newQty < 0.2 * cap) {
          await this.notifQueue.add(
            { type: 'INVENTORY_LOW', productId, artisanId: product.artisanId, qty: newQty },
            { delay: 0 },
          );
        }
      }
    });
  }

  /**
   * Atomic inventory increment on cancellation/return (Req 11.2)
   */
  async incrementForReturn(
    productId: string,
    qty: number,
    actorId: string,
    reason: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const product = await manager
        .createQueryBuilder(ProductEntity, 'p')
        .setLock('pessimistic_write')
        .where('p.id = :id', { id: productId })
        .getOne();

      if (!product) throw new NotFoundException('Product not found');

      const prevQty = product.inventoryQty;
      const newQty = prevQty + qty;

      // Restore to PUBLISHED if was OUT_OF_STOCK (Req 11.6)
      const newStatus =
        product.status === ProductStatus.OUT_OF_STOCK && newQty > 0
          ? ProductStatus.PUBLISHED
          : product.status;

      await manager.update(ProductEntity, productId, { inventoryQty: newQty, status: newStatus });

      await manager.save(InventoryBatchEntity, {
        productId,
        prevQty,
        newQty,
        changeReason: reason,
        actorId,
      });
    });
  }

  /**
   * Manual inventory update (Req 11.3, 11.4, 11.5)
   */
  async manualUpdate(
    productId: string,
    newQty: number,
    actorId: string,
    reason?: string,
  ): Promise<void> {
    if (newQty < 0 || newQty > 999_999) {
      throw new UnprocessableEntityException({
        statusCode: 422,
        message: 'Validation failed',
        details: { inventoryQty: ['Must be between 0 and 999,999'] },
      });
    }

    await this.dataSource.transaction(async (manager) => {
      const product = await manager
        .createQueryBuilder(ProductEntity, 'p')
        .setLock('pessimistic_write')
        .where('p.id = :id', { id: productId })
        .getOne();

      if (!product) throw new NotFoundException('Product not found');

      const prevQty = product.inventoryQty;

      let newStatus = product.status;
      if (newQty === 0) newStatus = ProductStatus.OUT_OF_STOCK;
      else if (product.status === ProductStatus.OUT_OF_STOCK && newQty > 0) {
        newStatus = ProductStatus.PUBLISHED;
      }

      await manager.update(ProductEntity, productId, { inventoryQty: newQty, status: newStatus });

      await manager.save(InventoryBatchEntity, {
        productId,
        prevQty,
        newQty,
        changeReason: reason ?? 'Manual update',
        actorId,
      });
    });
  }

  async getHistory(productId: string) {
    return this.batchRepo.find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
  }
}
