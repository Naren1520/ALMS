import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TrustScoreEntity } from './entities/trust-score.entity';
import { TrustEventEntity } from './entities/trust-event.entity';
import { TrustEventWeightEntity } from './entities/trust-event-weight.entity';
import { TrustEventType } from '../../common/enums';

interface RecordEventInput {
  userId: string;
  eventType: TrustEventType;
  referenceId?: string;
  refOrderId?: string;
  refReviewId?: string;
  refDisputeId?: string;
}

@Injectable()
export class TrustService {
  private readonly logger = new Logger(TrustService.name);

  constructor(
    @InjectRepository(TrustScoreEntity)
    private readonly scoreRepo: Repository<TrustScoreEntity>,
    @InjectRepository(TrustEventEntity)
    private readonly eventRepo: Repository<TrustEventEntity>,
    @InjectRepository(TrustEventWeightEntity)
    private readonly weightRepo: Repository<TrustEventWeightEntity>,
    private readonly dataSource: DataSource,
    @InjectQueue('TRUST_CONSEQUENCES')
    private readonly consequencesQueue: Queue,
  ) {}

  /**
   * Record a Trust_Event and update trust_scores atomically (Req 17.1, 17.2, 17.3)
   */
  async recordEvent(input: RecordEventInput): Promise<TrustScoreEntity> {
    const weight = await this.weightRepo.findOne({ where: { eventType: input.eventType } });
    const baseWeight = weight?.baseWeight ?? 0;
    const multiplier = weight?.multiplier ?? 1.0;
    const appliedWeight = baseWeight * multiplier;

    return await this.dataSource.transaction(async (manager) => {
      await manager.save(TrustEventEntity, {
        userId: input.userId,
        eventType: input.eventType,
        baseWeight,
        appliedWeight,
        refOrderId: input.refOrderId ?? null,
        refReviewId: input.refReviewId ?? null,
        refDisputeId: input.refDisputeId ?? null,
      });

      // Recompute score: CLAMP(SUM(applied_weight), 0, 100)
      const result = await manager.query<[{ sum: number }]>(
        `SELECT GREATEST(0, LEAST(100, COALESCE(SUM(applied_weight), 0))) AS sum
         FROM trust_events WHERE user_id = $1`,
        [input.userId],
      );
      const newScore = result[0]?.sum ?? 0;

      await manager.upsert(
        TrustScoreEntity,
        { userId: input.userId, score: newScore, updatedAt: new Date() },
        { conflictPaths: ['userId'] },
      );

      const score = await manager.findOne(TrustScoreEntity, { where: { userId: input.userId } });

      // Enqueue consequence job within 60s (Req 17.6, 17.7)
      await this.consequencesQueue.add(
        { userId: input.userId, newScore },
        { delay: 0, attempts: 3 },
      );

      return score!;
    });
  }

  async getScore(userId: string): Promise<number> {
    const score = await this.scoreRepo.findOne({ where: { userId } });
    return score?.score ?? 0;
  }

  async getBreakdown(userId: string) {
    const events = await this.dataSource.query(
      `SELECT event_type, created_at, applied_weight
       FROM trust_events WHERE user_id = $1
       ORDER BY ABS(applied_weight) DESC LIMIT 5`,
      [userId],
    );
    return events;
  }
}
