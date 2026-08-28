import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationCategory } from '../../common/enums';

@Injectable()
export class MarketDiscoveryService {
  private readonly logger = new Logger(MarketDiscoveryService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    @InjectQueue('MARKET_DISCOVERY')
    private readonly marketDiscoveryQueue: Queue,
  ) {}

  async enqueueForProduct(productId: string): Promise<void> {
    await this.marketDiscoveryQueue.add({ productId }, { attempts: 3 });
  }

  /** Check for demand surge every hour (Req 22.4) */
  @Cron('0 * * * *')
  async checkDemandSurge(): Promise<void> {
    const surging = await this.dataSource.query(
      `SELECT ms.category,
              ((ms.current_index - ms.prev_index) / NULLIF(ms.prev_index, 0) * 100) AS surge_pct
       FROM market_signals ms
       WHERE ((ms.current_index - ms.prev_index) / NULLIF(ms.prev_index, 0) * 100) > 30`,
    ).catch(() => []);

    for (const signal of surging) {
      // Notify all artisans with products in that category
      const artisans = await this.dataSource.query(
        `SELECT DISTINCT p.artisan_id FROM products p
         WHERE p.category = $1 AND p.status = 'PUBLISHED'`,
        [signal.category],
      ).catch(() => []);

      for (const a of artisans) {
        await this.notificationsService.sendToUser(a.artisan_id, {
          category: NotificationCategory.MARKET_OPPORTUNITY,
          title: 'Demand surge detected',
          body: `Demand for ${signal.category} has increased by ${Math.round(signal.surge_pct)}% in the last 30 days. AI Estimate.`,
        });
      }
    }
  }

  async getProductOpportunities(productId: string) {
    return this.dataSource.query(
      'SELECT * FROM market_opportunities WHERE product_id = $1 ORDER BY last_updated DESC',
      [productId],
    );
  }
}
