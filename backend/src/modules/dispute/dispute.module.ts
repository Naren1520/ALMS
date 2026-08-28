import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisputeService } from './dispute.service';
import { DisputeController } from './dispute.controller';
import { DisputeEntity } from './entities/dispute.entity';
import { AuthModule } from '../auth/auth.module';
import { TrustModule } from '../trust/trust.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DisputeEntity]),
    AuthModule,
    TrustModule,
    NotificationsModule,
  ],
  controllers: [DisputeController],
  providers: [DisputeService],
  exports: [DisputeService],
})
export class DisputeModule {}
