import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DataSource, In, Not, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductMediaEntity } from './entities/product-media.entity';
import { ProductAttributeSnapshotEntity } from './entities/product-attribute-snapshot.entity';
import { AiJobEntity } from './entities/ai-job.entity';
import { AiJobType, AiJobStatus, ProductStatus } from '../../common/enums';
import { R2StorageService } from '../../common/services/r2-storage.service';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_IMAGES_PER_PRODUCT = 10;

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(ProductMediaEntity)
    private readonly mediaRepo: Repository<ProductMediaEntity>,
    @InjectRepository(ProductAttributeSnapshotEntity)
    private readonly snapshotRepo: Repository<ProductAttributeSnapshotEntity>,
    @InjectRepository(AiJobEntity)
    private readonly aiJobRepo: Repository<AiJobEntity>,
    @InjectQueue('PRODUCT_CATALOG_GENERATION')
    private readonly catalogQueue: Queue,
    private readonly r2: R2StorageService,
    private readonly dataSource: DataSource,
  ) {}

  // ─── Product Creation ─────────────────────────────────────────────────────

  async createProduct(
    artisanId: string,
    files: { buffer: Buffer; mimetype: string; originalname: string; size: number }[],
    voice?: { buffer: Buffer; mimetype: string; size: number },
    textInput?: string,
  ): Promise<{ jobId: string; productId: string }> {
    // Validate images
    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        throw new BadRequestException(
          `Image format ${file.mimetype} not supported. Use JPEG, PNG, or WebP.`,
        );
      }
      if (file.size > MAX_IMAGE_SIZE) {
        throw new BadRequestException(
          `Image ${file.originalname} exceeds 20 MB limit.`,
        );
      }
    }
    if (files.length > MAX_IMAGES_PER_PRODUCT) {
      throw new BadRequestException(`Maximum ${MAX_IMAGES_PER_PRODUCT} images per product.`);
    }

    return await this.dataSource.transaction(async (manager) => {
      // 1. Create product in DRAFT
      const product = manager.create(ProductEntity, {
        artisanId,
        title: 'Untitled Product',
        status: ProductStatus.DRAFT,
      });
      const savedProduct = await manager.save(ProductEntity, product);

      // 2. Upload images to R2
      const mediaRecords: Partial<ProductMediaEntity>[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const key = `products/${savedProduct.id}/original/${Date.now()}_${i}`;
        await this.r2.upload(key, file.buffer, file.mimetype);
        mediaRecords.push({
          productId: savedProduct.id,
          r2KeyOrig: key,
          sortOrder: i,
        });
      }
      await manager.save(ProductMediaEntity, mediaRecords);

      // 3. Create AI job
      const aiJob = manager.create(AiJobEntity, {
        jobType: AiJobType.PRODUCT_CATALOG_GENERATION,
        productId: savedProduct.id,
        userId: artisanId,
        status: AiJobStatus.PENDING,
        inputPayload: {
          productId: savedProduct.id,
          imageKeys: mediaRecords.map((m) => m.r2KeyOrig),
          voiceBuffer: voice ? voice.buffer.toString('base64') : null,
          voiceMimetype: voice?.mimetype ?? null,
          textInput: textInput ?? null,
        },
      });
      const savedJob = await manager.save(AiJobEntity, aiJob);

      // 4. Enqueue BullMQ job
      await this.catalogQueue.add(
        { jobId: savedJob.id, productId: savedProduct.id },
        { jobId: savedJob.id, attempts: 3, backoff: { type: 'exponential', delay: 30000 } },
      );

      return { jobId: savedJob.id, productId: savedProduct.id };
    });
  }

  // ─── Product Update (with snapshot) ─────────────────────────────────────────

  async updateProduct(
    artisanId: string,
    productId: string,
    updates: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({
      where: { id: productId, artisanId },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Write versioned snapshot before update (Req 10.3)
    await this.snapshotRepo.save({
      productId,
      snapshot: { ...product } as Record<string, unknown>,
      snapshotBy: artisanId,
    });

    await this.productRepo.update(productId, updates);
    return this.productRepo.findOne({ where: { id: productId } }) as Promise<ProductEntity>;
  }

  // ─── Status Transition ────────────────────────────────────────────────────

  async changeStatus(
    artisanId: string,
    productId: string,
    newStatus: ProductStatus,
  ): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({
      where: { id: productId, artisanId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const allowedTransitions: Record<ProductStatus, ProductStatus[]> = {
      [ProductStatus.DRAFT]: [ProductStatus.PUBLISHED, ProductStatus.ARCHIVED],
      [ProductStatus.PUBLISHED]: [ProductStatus.PAUSED, ProductStatus.ARCHIVED],
      [ProductStatus.PAUSED]: [ProductStatus.PUBLISHED, ProductStatus.DRAFT, ProductStatus.ARCHIVED],
      [ProductStatus.ARCHIVED]: [ProductStatus.DRAFT],
      [ProductStatus.OUT_OF_STOCK]: [ProductStatus.PUBLISHED, ProductStatus.PAUSED, ProductStatus.ARCHIVED],
    };

    if (!allowedTransitions[product.status]?.includes(newStatus)) {
      throw new UnprocessableEntityException(
        `Cannot transition from ${product.status} to ${newStatus}`,
      );
    }

    // Validate publish requirements (Req 10.2)
    if (newStatus === ProductStatus.PUBLISHED) {
      const errors: string[] = [];
      const media = await this.mediaRepo.findOne({
        where: { productId, isActive: true },
      });
      if (!media?.r2KeyEnh) errors.push('At least one enhanced image is required');
      if (!product.title || product.title.length > 200) errors.push('title must be ≤200 chars');
      if (!product.descriptionEn) errors.push('description is required');
      if (!product.retailPrice || product.retailPrice <= 0) errors.push('price must be > 0');
      if (!product.category) errors.push('category is required');
      if (product.inventoryQty === null || product.inventoryQty === undefined) {
        errors.push('inventory quantity is required');
      }

      if (errors.length > 0) {
        throw new UnprocessableEntityException({
          statusCode: 422,
          error: 'UNPROCESSABLE_ENTITY',
          message: 'Product cannot be published',
          details: { fields: errors },
        });
      }
    }

    await this.productRepo.update(productId, { status: newStatus });
    return this.productRepo.findOne({ where: { id: productId } }) as Promise<ProductEntity>;
  }

  // ─── Delete (soft archive) ────────────────────────────────────────────────

  async deleteProduct(artisanId: string, productId: string): Promise<void> {
    const product = await this.productRepo.findOne({
      where: { id: productId, artisanId },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Check active orders (Req 10.1)
    const activeOrders = await this.dataSource.query(
      `SELECT id FROM orders WHERE product_id = $1 AND status IN ('PENDING','CONFIRMED','IN_PRODUCTION')`,
      [productId],
    );
    if (activeOrders.length > 0) {
      throw new ConflictException(
        'Cannot delete product with active orders. The product has been archived instead.',
      );
    }

    await this.productRepo.update(productId, { status: ProductStatus.ARCHIVED });
  }

  // ─── Bulk operations ─────────────────────────────────────────────────────

  async bulkUpdateStatus(
    artisanId: string,
    productIds: string[],
    targetStatus: ProductStatus,
  ): Promise<{ successCount: number; failures: { productId: string; reason: string }[] }> {
    if (productIds.length > 50) {
      throw new BadRequestException('Bulk operation supports at most 50 products');
    }

    const results: { productId: string; reason: string }[] = [];
    let successCount = 0;

    for (const productId of productIds) {
      try {
        await this.changeStatus(artisanId, productId, targetStatus);
        successCount++;
      } catch (err: unknown) {
        results.push({
          productId,
          reason: err instanceof HttpException ? err.message : 'Unknown error',
        });
      }
    }

    return { successCount, failures: results };
  }

  // ─── Image compare / revert ───────────────────────────────────────────────

  async getImageComparison(artisanId: string, productId: string) {
    const product = await this.productRepo.findOne({ where: { id: productId, artisanId } });
    if (!product) throw new NotFoundException('Product not found');

    const media = await this.mediaRepo.find({ where: { productId, isActive: true } });
    const comparisons = await Promise.all(
      media.map(async (m) => ({
        id: m.id,
        originalUrl: await this.r2.getSignedUrl(m.r2KeyOrig, 86400),
        enhancedUrl: m.r2KeyEnh ? await this.r2.getSignedUrl(m.r2KeyEnh, 86400) : null,
      })),
    );
    return comparisons;
  }

  async revertToOriginal(artisanId: string, productId: string, mediaId: string): Promise<void> {
    const media = await this.mediaRepo.findOne({
      where: { id: mediaId, productId },
    });
    if (!media) throw new NotFoundException('Media not found');

    await this.mediaRepo.update(mediaId, { r2KeyEnh: null });
  }

  async findById(productId: string): Promise<ProductEntity | null> {
    return this.productRepo.findOne({ where: { id: productId } });
  }

  async findByArtisan(artisanId: string) {
    return this.productRepo.find({ where: { artisanId } });
  }

  async findAllPublished() {
    const products = await this.dataSource.query(`
      SELECT 
        p.id,
        p.title,
        p.description_en,
        p.description_hi,
        p.category,
        p.subcategory,
        p.material,
        p.craft_technique,
        p.care_instructions,
        p.dimensions,
        p.retail_price,
        p.wholesale_price,
        p.moq,
        p.status,
        p.inventory_qty,
        p.lead_time_days,
        p.gi_eligible,
        p.created_at,
        ap.state,
        ap.district,
        ap.primary_craft,
        ap.verified AS artisan_verified,
        COALESCE(ts.score, 95) AS trust_score,
        COALESCE(
          (SELECT json_agg(json_build_object('orig', pm.r2_key_orig, 'enh', pm.r2_key_enh))
           FROM product_media pm
           WHERE pm.product_id = p.id AND pm.is_active = true),
          '[]'::json
        ) AS media
      FROM products p
      LEFT JOIN artisan_profiles ap ON ap.id = p.artisan_id
      LEFT JOIN trust_scores ts ON ts.user_id = p.artisan_id
      WHERE p.status = 'PUBLISHED'
      ORDER BY p.created_at DESC
    `);
    return products;
  }
}
