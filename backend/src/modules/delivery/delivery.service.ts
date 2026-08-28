import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { NotificationsService } from '../notifications/notifications.service';
import { TrustService } from '../trust/trust.service';
import { NotificationCategory, TrustEventType } from '../../common/enums';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    private readonly trustService: TrustService,
  ) {}

  /**
   * Compute retail delivery estimate (Req 20.1)
   * estimate = ceil(backlog / daily_capacity) + lead_time_days + transit_days
   */
  async estimateRetailDelivery(artisanId: string, destPincode: string) {
    const [profile, transit, backlog] = await Promise.all([
      this.dataSource.query(
        'SELECT monthly_capacity, lead_time_days FROM artisan_profiles WHERE id = $1',
        [artisanId],
      ),
      this.dataSource.query(
        'SELECT transit_days FROM transit_matrix WHERE dest_pincode = $1 LIMIT 1',
        [destPincode],
      ),
      this.dataSource.query(
        `SELECT COALESCE(SUM(qty), 0) AS backlog
         FROM orders WHERE artisan_id = $1 AND status IN ('CONFIRMED','IN_PRODUCTION')`,
        [artisanId],
      ),
    ]);

    const dailyCapacity = profile[0]?.monthly_capacity
      ? Math.ceil(profile[0].monthly_capacity / 30)
      : 1;
    const leadTimeDays = profile[0]?.lead_time_days ?? 0;
    const transitDays = transit[0]?.transit_days ?? 7;
    const currentBacklog = parseInt(backlog[0]?.backlog ?? '0', 10);

    const productionDays = Math.ceil(currentBacklog / dailyCapacity);
    const totalDays = productionDays + leadTimeDays + transitDays;

    return {
      productionDays,
      leadTimeDays,
      transitDays,
      totalDays,
      estimatedDeliveryDate: new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000),
    };
  }

  /**
   * Monitor orders approaching delivery deadline (Req 20.5)
   */
  @Cron('0 9 * * *') // Daily at 9 AM
  async monitorDeliveryDeadlines(): Promise<void> {
    // Orders due within 24h and not SHIPPED
    const urgentOrders = await this.dataSource.query(
      `SELECT o.id, o.buyer_id, o.artisan_id, o.est_delivery_date
       FROM orders o
       WHERE o.est_delivery_date BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
         AND o.status NOT IN ('SHIPPED','DELIVERED','CANCELLED','RETURNED')`,
    );

    for (const order of urgentOrders) {
      await this.notificationsService.sendToUser(order.buyer_id, {
        category: NotificationCategory.ORDER_STATUS_UPDATE,
        title: 'Order delivery approaching',
        body: `Your order is expected to arrive within 24 hours.`,
      });
    }

    // Late orders > 3 business days past committed date
    const lateOrders = await this.dataSource.query(
      `SELECT o.id, o.artisan_id, o.est_delivery_date
       FROM orders o
       WHERE o.est_delivery_date < NOW() - INTERVAL '3 days'
         AND o.status NOT IN ('DELIVERED','CANCELLED','RETURNED')`,
    );

    for (const order of lateOrders) {
      await this.trustService.recordEvent({
        userId: order.artisan_id,
        eventType: TrustEventType.ORDER_FULFILLED_LATE,
        refOrderId: order.id,
      });
    }
  }
}
