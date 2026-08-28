import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { ArtisanVerificationEntity } from './entities/artisan-verification.entity';
import { ArtisanProfileEntity } from './entities/artisan-profile.entity';
import { BuyerVerificationEntity } from './entities/buyer-verification.entity';
import { BuyerProfileEntity } from './entities/buyer-profile.entity';
import { AuthModule } from '../auth/auth.module';
import { TrustModule } from '../trust/trust.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArtisanVerificationEntity,
      ArtisanProfileEntity,
      BuyerVerificationEntity,
      BuyerProfileEntity,
    ]),
    AuthModule,
    TrustModule,
    NotificationsModule,
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
