import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MarketDiscoveryService } from './market-discovery.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'MARKET_DISCOVERY' }),
    AuthModule,
    NotificationsModule,
  ],
  providers: [MarketDiscoveryService],
  exports: [MarketDiscoveryService],
})
export class MarketDiscoveryModule {}
