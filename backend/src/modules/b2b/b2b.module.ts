import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { B2BService } from './b2b.service';
import { B2BController } from './b2b.controller';
import { RfqEntity } from './entities/rfq.entity';
import { QuoteEntity } from './entities/quote.entity';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RfqEntity, QuoteEntity]),
    BullModule.registerQueue({ name: 'RFQ_MATCHING' }),
    AuthModule,
    NotificationsModule,
    InventoryModule,
  ],
  controllers: [B2BController],
  providers: [B2BService],
  exports: [B2BService],
})
export class B2BModule {}
