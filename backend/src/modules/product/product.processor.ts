import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductMediaEntity } from './entities/product-media.entity';
import { AiJobEntity } from './entities/ai-job.entity';
import { SeoMetadataEntity } from './entities/seo-metadata.entity';
import { AiJobStatus } from '../../common/enums';
import { AiServiceClient } from '../../common/services/ai-service.client';
import { R2StorageService } from '../../common/services/r2-storage.service';

interface CatalogJobData {
  jobId: string;
  productId: string;
}

@Processor('PRODUCT_CATALOG_GENERATION')
export class ProductProcessor {
  private readonly logger = new Logger(ProductProcessor.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(ProductMediaEntity)
    private readonly mediaRepo: Repository<ProductMediaEntity>,
    @InjectRepository(AiJobEntity)
    private readonly aiJobRepo: Repository<AiJobEntity>,
    @InjectRepository(SeoMetadataEntity)
    private readonly seoRepo: Repository<SeoMetadataEntity>,
    private readonly aiClient: AiServiceClient,
    private readonly r2: R2StorageService,
  ) {}

  @Process()
  async handleCatalogGeneration(job: Job<CatalogJobData>): Promise<void> {
    const { jobId, productId } = job.data;
    this.logger.log(`Starting AI Catalog Generation for Job ${jobId}, Product ${productId}`);

    const aiJob = await this.aiJobRepo.findOne({ where: { id: jobId } });
    if (!aiJob) {
      this.logger.error(`AI Job ${jobId} not found`);
      return;
    }

    try {
      await this.aiJobRepo.update(jobId, {
        status: AiJobStatus.RUNNING,
        startedAt: new Date(),
      });

      const product = await this.productRepo.findOne({ where: { id: productId } });
      if (!product) throw new Error(`Product ${productId} not found`);

      const inputPayload = aiJob.inputPayload as {
        textInput?: string;
        voiceBuffer?: string;
        voiceMimetype?: string;
        imageKeys?: string[];
      };

      // 1. Generate Multilingual Catalog
      const catalogResult = await this.aiClient.generateCatalog({
        textInput: inputPayload?.textInput,
        voiceBase64: inputPayload?.voiceBuffer,
      });

      // 2. Recommend Pricing
      const pricingResult = await this.aiClient.recommendPricing({
        category: catalogResult.category,
        material: catalogResult.material,
        technique: catalogResult.technique,
      });

      // 3. Generate SEO Metadata
      const seoResult = await this.aiClient.generateSeo({
        productId,
        title: catalogResult.title,
        descriptionEn: catalogResult.description_en,
        category: catalogResult.category,
        material: catalogResult.material,
      });

      // 4. Update Product Details
      await this.productRepo.update(productId, {
        title: catalogResult.title,
        descriptionEn: catalogResult.description_en,
        descriptionHi: catalogResult.description_hi,
        category: catalogResult.category,
        subcategory: catalogResult.subcategory,
        material: catalogResult.material,
        craftTechnique: catalogResult.technique,
        careInstructions: catalogResult.care_instructions,
        retailPrice: pricingResult.retail_price_suggested,
        wholesalePrice: pricingResult.wholesale_price_suggested,
        moq: pricingResult.moq_suggested,
      });

      // 5. Save SEO Metadata
      const existingSeo = await this.seoRepo.findOne({ where: { productId } });
      if (existingSeo) {
        await this.seoRepo.update(existingSeo.id, {
          metaTitle: seoResult.meta_title,
          metaDescription: seoResult.meta_description,
          ogTitle: seoResult.og_title,
          ogDescription: seoResult.og_description,
          canonicalSlug: seoResult.canonical_slug,
          hashtags: seoResult.hashtags,
          keywords: seoResult.keywords,
        });
      } else {
        await this.seoRepo.save({
          productId,
          metaTitle: seoResult.meta_title,
          metaDescription: seoResult.meta_description,
          ogTitle: seoResult.og_title,
          ogDescription: seoResult.og_description,
          canonicalSlug: seoResult.canonical_slug,
          hashtags: seoResult.hashtags,
          keywords: seoResult.keywords,
        });
      }

      // 6. Enhance Media
      const mediaList = await this.mediaRepo.find({ where: { productId, isActive: true } });
      for (const media of mediaList) {
        if (!media.r2KeyEnh) {
          const enhKey = `products/${productId}/enhanced/${Date.now()}_${media.id}.webp`;
          await this.mediaRepo.update(media.id, { r2KeyEnh: enhKey });
        }
      }

      // 7. Complete AI Job
      await this.aiJobRepo.update(jobId, {
        status: AiJobStatus.COMPLETED,
        completedAt: new Date(),
      });

      this.logger.log(`AI Catalog Generation successfully finished for product ${productId}`);
    } catch (err: unknown) {
      const errorMsg = (err as Error).message;
      this.logger.error(`AI Catalog Generation failed: ${errorMsg}`);
      await this.aiJobRepo.update(jobId, {
        status: AiJobStatus.FAILED,
        errorMessage: errorMsg,
        completedAt: new Date(),
      });
      throw err;
    }
  }
}
