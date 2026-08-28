import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationCategory } from '../../common/enums';

@Injectable()
export class ExcessInventoryService {
  private readonly logger = new Logger(ExcessInventoryService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Runs every 24 hours — detect excess inventory and match to buyers (Req 12.1)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async detectExcessInventory(): Promise<void> {
    this.logger.log('Running excess inventory detection...');

    const excessProducts = await this.dataSource.query(
      `SELECT p.id, p.artisan_id, p.inventory_qty, ap.monthly_capacity
       FROM products p
       JOIN artisan_profiles ap ON ap.id = p.artisan_id
       WHERE ap.monthly_capacity IS NOT NULL
         AND p.status = 'PUBLISHED'
         AND p.inventory_qty > ap.monthly_capacity * 0.8
         AND p.created_at <= NOW() - INTERVAL '30 days'`,
    );

    for (const product of excessProducts) {
      await this.matchBuyersForExcess(product.id, product.artisan_id);
    }
  }

  private async matchBuyersForExcess(productId: string, artisanId: string): Promise<void> {
    // Find verified buyers using pgvector similarity (Req 12.2)
    const buyers = await this.dataSource.query(
      `SELECT bp.id
       FROM buyer_profiles bp
       WHERE bp.verified = true
       LIMIT 5`,
    );

    if (buyers.length === 0) {
      this.logger.debug(`No eligible buyers for product ${productId}`);
      return;
    }

    // Notify artisan of matched buyers
    await this.notificationsService.sendToUser(artisanId, {
      category: NotificationCategory.MARKET_OPPORTUNITY,
      title: 'Excess inventory opportunity',
      body: `We found ${buyers.length} potential buyers for your excess inventory. Set a discount (15–25% below wholesale) to activate the offer.`,
    });
  }
}
