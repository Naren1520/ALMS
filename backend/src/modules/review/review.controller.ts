import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';
import { JwtPayload } from '../../common/interfaces';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  submit(
    @CurrentUser() user: JwtPayload,
    @Body() body: { orderId: string; rating: number; textReview?: string },
  ) {
    return this.reviewService.submitReview(user.sub, body);
  }

  @Post(':id/reply')
  reply(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('reply') reply: string,
  ) {
    return this.reviewService.addArtisanReply(user.sub, id, reply);
  }
}
