import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { JwtPayload } from '../../common/interfaces';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post()
  getOrCreate(
    @CurrentUser() user: JwtPayload,
    @Body('otherUserId') otherUserId: string,
    @Body('rfqId') rfqId?: string,
  ) {
    return this.messagingService.getOrCreateConversation(user.sub, otherUserId, rfqId);
  }

  @Get(':id/messages')
  getMessages(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.messagingService.getConversationMessages(id, user.sub);
  }

  @Post(':id/messages')
  sendMessage(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    return this.messagingService.sendMessage(id, user.sub, content);
  }

  @Patch(':id/flag')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  flagConversation(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.messagingService.flagConversation(id, user.sub);
  }
}
