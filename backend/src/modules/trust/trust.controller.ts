import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TrustService } from './trust.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('trust-scores')
@UseGuards(JwtAuthGuard)
export class TrustController {
  constructor(private readonly trustService: TrustService) {}

  @Get(':userId')
  getScore(@Param('userId') userId: string) {
    return this.trustService.getScore(userId);
  }

  @Get(':userId/breakdown')
  getBreakdown(@Param('userId') userId: string) {
    return this.trustService.getBreakdown(userId);
  }
}
