import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserEntity } from '../auth/entities/user.entity';
import { AuditLogEntity } from '../auth/entities/audit-log.entity';
import { AuthModule } from '../auth/auth.module';
import { TrustModule } from '../trust/trust.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AuditLogEntity]),
    AuthModule,
    TrustModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
