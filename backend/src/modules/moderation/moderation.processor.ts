import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ModerationService, ModerationVerdict } from './moderation.service';

interface ModerationJob {
  type: 'REVIEW' | 'PRODUCT' | 'MESSAGE';
  reviewId?: string;
  productId?: string;
  artisanId?: string;
  content?: string;
}

@Processor('MODERATION')
export class ModerationProcessor {
  private readonly logger = new Logger(ModerationProcessor.name);

  constructor(private readonly moderationService: ModerationService) {}

  @Process()
  async handleModeration(job: Job<ModerationJob>): Promise<void> {
    const { type, reviewId, productId, artisanId, content } = job.data;
    this.logger.debug(`Processing moderation job: ${type}`);

    // Simplified AI moderation — in production calls Gemini AI API
    const verdict = this.runContentCheck(content ?? '');

    if (type === 'REVIEW' && reviewId) {
      await this.moderationService.applyReviewModeration(reviewId, verdict);
    } else if (type === 'PRODUCT' && productId && artisanId) {
      await this.moderationService.applyListingModeration(productId, verdict, artisanId);
    }
  }

  /** Simple heuristic — replace with Gemini API call in production */
  private runContentCheck(content: string): ModerationVerdict {
    const prohibited = ['spam', 'scam', 'fake', 'inappropriate'];
    const lower = content.toLowerCase();
    if (prohibited.some((w) => lower.includes(w))) return ModerationVerdict.VIOLATES_POLICY;
    return ModerationVerdict.SAFE;
  }
}
