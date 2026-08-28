import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ModerationService } from './moderation.service';
import { ModerationProcessor } from './moderation.processor';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TrustModule } from '../trust/trust.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'MODERATION' }),
    AuthModule,
    NotificationsModule,
    TrustModule,
  ],
  providers: [ModerationService, ModerationProcessor],
  exports: [ModerationService],
})
export class ModerationModule {}
