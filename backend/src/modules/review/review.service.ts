import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ReviewEntity } from './entities/review.entity';
import { ReviewStatus, TrustEventType } from '../../common/enums';
import { TrustService } from '../trust/trust.service';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    private readonly dataSource: DataSource,
    private readonly trustService: TrustService,
    @InjectQueue('MODERATION')
    private readonly moderationQueue: Queue,
  ) {}

  /** Submit a review (Req 18.1) */
  async submitReview(
    reviewerId: string,
    data: { orderId: string; rating: number; textReview?: string },
  ): Promise<ReviewEntity> {
    // Validate rating
    if (data.rating < 1 || data.rating > 5 || !Number.isInteger(data.rating)) {
      throw new BadRequestException('Rating must be an integer between 1 and 5');
    }
    if (data.textReview && data.textReview.length > 1000) {
      throw new BadRequestException('Review text must not exceed 1000 characters');
    }

    // Check order exists and is DELIVERED
    const order = await this.dataSource.query(
      `SELECT id, artisan_id, status FROM orders WHERE id = $1`,
      [data.orderId],
    );
    if (!order.length) throw new NotFoundException('Order not found');
    if (order[0].status !== 'DELIVERED') {
      throw new ForbiddenException('Reviews can only be submitted for delivered orders');
    }

    // One review per order
    const existing = await this.reviewRepo.findOne({ where: { orderId: data.orderId } });
    if (existing) {
      throw new ConflictException('A review already exists for this order');
    }

    const review = await this.reviewRepo.save({
      orderId: data.orderId,
      reviewerId,
      reviewedId: order[0].artisan_id,
      rating: data.rating,
      textReview: data.textReview ?? null,
      moderationStatus: ReviewStatus.PENDING_MODERATION,
    });

    // Enqueue moderation (Req 18.1 — within 30s)
    await this.moderationQueue.add({ type: 'REVIEW', reviewId: review.id, content: data.textReview });

    return review;
  }

  /** Called by moderation pipeline when review is approved */
  async onModerationApproved(reviewId: string): Promise<void> {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    if (!review) return;

    await this.reviewRepo.update(reviewId, { moderationStatus: ReviewStatus.PUBLISHED });

    const eventType =
      review.rating >= 4 ? TrustEventType.POSITIVE_REVIEW : TrustEventType.NEGATIVE_REVIEW;

    await this.trustService.recordEvent({
      userId: review.reviewedId,
      eventType,
      refReviewId: reviewId,
    });
  }

  async addArtisanReply(artisanId: string, reviewId: string, reply: string): Promise<void> {
    if (reply.length > 500) throw new BadRequestException('Reply must not exceed 500 characters');

    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewedId !== artisanId) throw new ForbiddenException('Access denied');
    if (review.artisanReply) throw new ConflictException('A reply already exists for this review');

    await this.reviewRepo.update(reviewId, { artisanReply: reply });
  }
}
