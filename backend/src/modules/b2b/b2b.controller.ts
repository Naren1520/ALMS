import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { B2BService } from './b2b.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { JwtPayload } from '../../common/interfaces';

@Controller('b2b')
@UseGuards(JwtAuthGuard, RolesGuard)
export class B2BController {
  constructor(private readonly b2bService: B2BService) {}

  @Post('rfqs')
  @Roles(UserRole.BUYER)
  createRfq(@CurrentUser() user: JwtPayload, @Body() body: any) {
    return this.b2bService.createRfq(user.sub, body);
  }

  @Get('rfqs/:id/matches')
  @Roles(UserRole.BUYER)
  getRfqMatches(@Param('id') id: string) {
    return this.b2bService.getRfqMatches(id);
  }

  @Post('rfqs/:id/quotes')
  @Roles(UserRole.ARTISAN)
  submitQuote(
    @CurrentUser() user: JwtPayload,
    @Param('id') rfqId: string,
    @Body() body: any,
  ) {
    return this.b2bService.submitQuote(user.sub, rfqId, body);
  }

  @Patch('quotes/:id/accept')
  @Roles(UserRole.BUYER)
  acceptQuote(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.b2bService.acceptQuote(user.sub, id);
  }

  @Patch('quotes/:id/reject')
  @Roles(UserRole.BUYER)
  rejectQuote(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.b2bService.rejectQuote(user.sub, id);
  }
}
