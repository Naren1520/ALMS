import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('delivery')
@UseGuards(JwtAuthGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get(':artisanId/estimate')
  estimateDelivery(
    @Param('artisanId') artisanId: string,
    @Query('pincode') pincode: string,
  ) {
    return this.deliveryService.estimateRetailDelivery(artisanId, pincode);
  }
}
