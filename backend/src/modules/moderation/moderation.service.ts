import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationCategory, TrustEventType } from '../../common/enums';
import { TrustService } from '../trust/trust.service';

export enum ModerationVerdict {
  SAFE = 'SAFE',
  REQUIRES_REVIEW = 'REQUIRES_REVIEW',
  VIOLATES_POLICY = 'VIOLATES_POLICY',
}

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    private readonly trustService: TrustService,
  ) {}

  /** Called by AI pipeline with moderation result for a review */
  async applyReviewModeration(
    reviewId: string,
    verdict: ModerationVerdict,
  ): Promise<void> {
    if (verdict === ModerationVerdict.SAFE) {
      await this.dataSource.query(
        `UPDATE reviews SET moderation_status = 'PUBLISHED' WHERE id = $1`,
        [reviewId],
      );
    } else if (verdict === ModerationVerdict.VIOLATES_POLICY) {
      const review = await this.dataSource.query(
        'SELECT reviewer_id FROM reviews WHERE id = $1',
        [reviewId],
      );
      await this.dataSource.query(
        `UPDATE reviews SET moderation_status = 'REJECTED' WHERE id = $1`,
        [reviewId],
      );
      if (review[0]) {
        await this.notificationsService.sendToUser(review[0].reviewer_id, {
          category: NotificationCategory.TRUST_SCORE_CHANGE,
          title: 'Review removed',
          body: 'Your review was removed for violating our content policy.',
        });
      }
    }
  }

  /** Called by AI pipeline with moderation result for a listing */
  async applyListingModeration(
    productId: string,
    verdict: ModerationVerdict,
    artisanId: string,
  ): Promise<void> {
    if (verdict === ModerationVerdict.SAFE) {
      await this.dataSource.query(
        `UPDATE products SET status = 'PUBLISHED' WHERE id = $1 AND status = 'DRAFT'`,
        [productId],
      );
    } else if (verdict === ModerationVerdict.VIOLATES_POLICY) {
      await this.dataSource.query(
        `UPDATE products SET status = 'ARCHIVED' WHERE id = $1`,
        [productId],
      );
      await this.trustService.recordEvent({
        userId: artisanId,
        eventType: TrustEventType.LISTING_REJECTED,
        referenceId: productId,
      });
      await this.notificationsService.sendToUser(artisanId, {
        category: NotificationCategory.TRUST_SCORE_CHANGE,
        title: 'Listing removed',
        body: 'Your product listing was removed for violating content policy.',
      });
    }
  }
}
