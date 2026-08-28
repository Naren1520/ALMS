import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryBatchEntity } from './entities/inventory-batch.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryBatchEntity, ProductEntity]),
    BullModule.registerQueue({ name: 'NOTIFICATIONS' }),
    AuthModule,
    NotificationsModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
