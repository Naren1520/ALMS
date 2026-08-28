import {
  Body, Controller, Get, Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { JwtPayload } from '../../common/interfaces';

@Controller('onboarding')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /** POST /onboarding/artisan — Submit artisan verification */
  @Post('artisan')
  @Roles(UserRole.ARTISAN)
  submitArtisanVerification(
    @CurrentUser() user: JwtPayload,
    @Body() body: any,
  ) {
    return this.onboardingService.submitArtisanVerification(user.sub, body);
  }

  /** POST /onboarding/buyer — Submit buyer verification */
  @Post('buyer')
  @Roles(UserRole.BUYER)
  submitBuyerVerification(
    @CurrentUser() user: JwtPayload,
    @Body() body: any,
  ) {
    return this.onboardingService.submitBuyerVerification(user.sub, body);
  }

  /** PATCH /onboarding/artisan/:id/approve */
  @Patch('artisan/:id/approve')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  approveArtisan(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.onboardingService.approveArtisanVerification(user.sub, id);
  }

  /** PATCH /onboarding/artisan/:id/reject */
  @Patch('artisan/:id/reject')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  rejectArtisan(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.onboardingService.rejectArtisanVerification(user.sub, id, reason);
  }

  /** PATCH /onboarding/buyer/:id/approve */
  @Patch('buyer/:id/approve')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  approveBuyer(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.onboardingService.approveBuyerVerification(user.sub, id);
  }

  /** PATCH /onboarding/buyer/:id/reject */
  @Patch('buyer/:id/reject')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  rejectBuyer(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.onboardingService.rejectBuyerVerification(user.sub, id, reason);
  }
}
