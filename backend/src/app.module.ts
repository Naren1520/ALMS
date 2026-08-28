import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@nestjs-modules/ioredis';
import {
  appConfig,
  databaseConfig,
  redisConfig,
  jwtConfig,
  RedisConfig,
} from './config';
import { envValidationSchema } from './config/env.validation';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { ProductModule } from './modules/product/product.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { B2BModule } from './modules/b2b/b2b.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { TrustModule } from './modules/trust/trust.module';
import { ReviewModule } from './modules/review/review.module';
import { DisputeModule } from './modules/dispute/dispute.module';
import { AtlasModule } from './modules/atlas/atlas.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { SearchModule } from './modules/search/search.module';
import { ExcessInventoryModule } from './modules/excess-inventory/excess-inventory.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { MarketDiscoveryModule } from './modules/market-discovery/market-discovery.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // ── Configuration ────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, jwtConfig],
      validationSchema: envValidationSchema,
    }),

    // ── Redis (global, used by BullMQ + RateLimitGuard) ─────────────
    RedisModule.forRootAsync({
      useFactory: (cs: ConfigService) => {
        const r = cs.get<RedisConfig>('redis')!;
        return {
          type: 'single' as const,
          options: {
            host: r.host,
            port: r.port,
            ...(r.password ? { password: r.password } : {}),
          },
        };
      },
      inject: [ConfigService],
    }),

    // ── Database ─────────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => cs.get('database')!,
    }),

    // ── BullMQ ───────────────────────────────────────────────────────
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => {
        const r = cs.get<RedisConfig>('redis')!;
        return {
          redis: {
            host: r.host,
            port: r.port,
            ...(r.password ? { password: r.password } : {}),
          },
          defaultJobOptions: { removeOnComplete: 100, removeOnFail: 500 },
        };
      },
    }),

    // ── Scheduling & Throttling ──────────────────────────────────────
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({ throttlers: [{ ttl: 60000, limit: 100 }] }),
    }),

    // ── Shared services ──────────────────────────────────────────────
    CommonModule,

    // ── Feature modules ──────────────────────────────────────────────
    AuthModule,
    OnboardingModule,
    ProductModule,
    InventoryModule,
    B2BModule,
    MessagingModule,
    TrustModule,
    ReviewModule,
    DisputeModule,
    AtlasModule,
    NotificationsModule,
    AdminModule,
    SearchModule,
    ExcessInventoryModule,
    ModerationModule,
    DeliveryModule,
    MarketDiscoveryModule,
  ],
})
export class AppModule {}
