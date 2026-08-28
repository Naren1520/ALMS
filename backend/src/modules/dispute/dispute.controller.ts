import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DisputeService } from './dispute.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { JwtPayload } from '../../common/interfaces';
import { DisputeCategory, DisputeResolution } from '../../common/enums';

@Controller('disputes')
@UseGuards(JwtAuthGuard)
export class DisputeController {
  constructor(private readonly disputeService: DisputeService) {}

  @Post()
  openDispute(
    @CurrentUser() user: JwtPayload,
    @Body() body: { orderId: string; category: DisputeCategory; description: string },
  ) {
    return this.disputeService.openDispute(user.sub, body);
  }

  @Patch(':id/resolve')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  resolve(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: { resolution: DisputeResolution; rationale: string },
  ) {
    return this.disputeService.resolveDispute(user.sub, id, body.resolution, body.rationale);
  }
}
