import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { JwtPayload } from '../../common/interfaces';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Patch(':productId')
  @Roles(UserRole.ARTISAN)
  updateInventory(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
    @Body('qty') qty: number,
    @Body('reason') reason?: string,
  ) {
    return this.inventoryService.manualUpdate(productId, qty, user.sub, reason);
  }

  @Get(':productId/history')
  @Roles(UserRole.ARTISAN, UserRole.ADMIN)
  getHistory(@Param('productId') productId: string) {
    return this.inventoryService.getHistory(productId);
  }
}
