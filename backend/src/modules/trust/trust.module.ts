import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { TrustService } from './trust.service';
import { TrustController } from './trust.controller';
import { TrustScoreEntity } from './entities/trust-score.entity';
import { TrustEventEntity } from './entities/trust-event.entity';
import { TrustEventWeightEntity } from './entities/trust-event-weight.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrustScoreEntity, TrustEventEntity, TrustEventWeightEntity]),
    BullModule.registerQueue({ name: 'TRUST_CONSEQUENCES' }),
    AuthModule,
  ],
  controllers: [TrustController],
  providers: [TrustService],
  exports: [TrustService],
})
export class TrustModule {}
