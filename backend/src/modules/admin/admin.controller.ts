import {
  Body, Controller, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole, AccountStatus } from '../../common/enums';
import { JwtPayload } from '../../common/interfaces';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get('users')
  searchUsers(
    @Query('q') q = '',
    @Query('role') role?: UserRole,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.searchUsers(q, role, +page, +limit);
  }

  @Patch('users/:id/role')
  changeRole(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('role') role: UserRole,
    @Body('reason') reason: string,
  ) {
    return this.adminService.changeUserRole(user.sub, id, role, reason);
  }

  @Patch('users/:id/status')
  setStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('status') status: AccountStatus,
  ) {
    return this.adminService.setUserStatus(user.sub, id, status);
  }

  @Post('trust-scores/:userId/recalculate')
  recalculateTrustScore(
    @CurrentUser() user: JwtPayload,
    @Param('userId') userId: string,
  ) {
    return this.adminService.recalculateTrustScore(user.sub, userId);
  }

  @Patch('config')
  updateConfig(
    @CurrentUser() user: JwtPayload,
    @Body('key') key: string,
    @Body('value') value: unknown,
  ) {
    return this.adminService.updatePlatformConfig(user.sub, key, value);
  }

  @Get('moderation-queue')
  getModerationQueue() {
    return this.adminService.getModerationQueue();
  }
}
