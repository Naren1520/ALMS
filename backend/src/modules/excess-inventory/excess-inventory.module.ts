import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ExcessInventoryService } from './excess-inventory.service';
import { ExcessInventoryController } from './excess-inventory.controller';
import { ProductEntity } from '../product/entities/product.entity';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    BullModule.registerQueue({ name: 'EXCESS_INVENTORY' }),
    AuthModule,
    NotificationsModule,
  ],
  controllers: [ExcessInventoryController],
  providers: [ExcessInventoryService],
  exports: [ExcessInventoryService],
})
export class ExcessInventoryModule {}
