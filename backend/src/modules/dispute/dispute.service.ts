import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { DisputeEntity } from './entities/dispute.entity';
import { DisputeCategory, DisputeResolution, DisputeStatus, TrustEventType } from '../../common/enums';
import { TrustService } from '../trust/trust.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationCategory } from '../../common/enums';

@Injectable()
export class DisputeService {
  constructor(
    @InjectRepository(DisputeEntity)
    private readonly disputeRepo: Repository<DisputeEntity>,
    private readonly dataSource: DataSource,
    private readonly trustService: TrustService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /** Open a dispute (Req 19.1) */
  async openDispute(
    openedBy: string,
    data: {
      orderId: string;
      category: DisputeCategory;
      description: string;
    },
  ): Promise<DisputeEntity> {
    if (data.description.length < 10 || data.description.length > 1000) {
      throw new UnprocessableEntityException('Description must be 10–1000 characters');
    }

    // Validate eligibility window
    const order = await this.dataSource.query(
      `SELECT id, artisan_id, buyer_id, status, est_delivery_date, updated_at
       FROM orders WHERE id = $1`,
      [data.orderId],
    );
    if (!order.length) throw new NotFoundException('Order not found');

    const o = order[0];
    const now = new Date();

    if (o.status === 'DELIVERED') {
      const deliveredAt = new Date(o.updated_at);
      const daysSince = (now.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 30) {
        throw new UnprocessableEntityException('Dispute window expired: must be within 30 days of delivery');
      }
    } else {
      if (o.est_delivery_date) {
        const expected = new Date(o.est_delivery_date);
        const daysOverdue = (now.getTime() - expected.getTime()) / (1000 * 60 * 60 * 24);
        if (daysOverdue < 0 || daysOverdue > 7) {
          throw new UnprocessableEntityException(
            'Dispute window expired: must be within 7 days of expected delivery when order is not delivered',
          );
        }
      }
    }

    const dispute = await this.disputeRepo.save({
      orderId: data.orderId,
      openedBy,
      category: data.category,
      description: data.description,
      status: DisputeStatus.OPEN,
    });

    // Notify opposing party within 30 min
    const opposingPartyId = o.artisan_id === openedBy ? o.buyer_id : o.artisan_id;
    await this.notificationsService.sendToUser(opposingPartyId, {
      category: NotificationCategory.DISPUTE_OPENED,
      title: 'A dispute has been opened',
      body: `A dispute was opened for order ${data.orderId}`,
    });

    return dispute;
  }

  /** Resolve a dispute (Req 19.4) */
  async resolveDispute(
    moderatorId: string,
    disputeId: string,
    resolution: DisputeResolution,
    rationale: string,
  ): Promise<void> {
    if (rationale.length < 50) {
      throw new BadRequestException('Rationale must be at least 50 characters');
    }

    const dispute = await this.disputeRepo.findOne({ where: { id: disputeId } });
    if (!dispute) throw new NotFoundException('Dispute not found');

    await this.disputeRepo.update(disputeId, {
      status: DisputeStatus.RESOLVED,
      resolution,
      rationale,
      assignedTo: moderatorId,
      resolvedAt: new Date(),
    });

    const order = await this.dataSource.query(
      'SELECT artisan_id, buyer_id FROM orders WHERE id = $1',
      [dispute.orderId],
    );
    const o = order[0];
    const winnerId = resolution === DisputeResolution.IN_FAVOR_OF_BUYER ? o.buyer_id : o.artisan_id;
    const loserId = resolution === DisputeResolution.IN_FAVOR_OF_BUYER ? o.artisan_id : o.buyer_id;

    await Promise.all([
      this.trustService.recordEvent({
        userId: winnerId,
        eventType: TrustEventType.DISPUTE_RESOLVED_FOR,
        refDisputeId: disputeId,
      }),
      this.trustService.recordEvent({
        userId: loserId,
        eventType: TrustEventType.DISPUTE_RESOLVED_AGAINST,
        refDisputeId: disputeId,
      }),
    ]);
  }
}
