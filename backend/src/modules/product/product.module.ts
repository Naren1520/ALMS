import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductMediaEntity } from './entities/product-media.entity';
import { ProductAttributeSnapshotEntity } from './entities/product-attribute-snapshot.entity';
import { AiJobEntity } from './entities/ai-job.entity';
import { SeoMetadataEntity } from './entities/seo-metadata.entity';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductMediaEntity,
      ProductAttributeSnapshotEntity,
      AiJobEntity,
      SeoMetadataEntity,
    ]),
    BullModule.registerQueue({ name: 'PRODUCT_CATALOG_GENERATION' }),
    AuthModule,
    CommonModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
