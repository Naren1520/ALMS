import {
  BadRequestException,
  Body, Controller, Delete, Get, Param, Patch, Post, Put,
  UploadedFiles, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { AiServiceClient } from '../../common/services/ai-service.client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole, ProductStatus } from '../../common/enums';
import { JwtPayload } from '../../common/interfaces';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly aiClient: AiServiceClient,
  ) {}

  /** POST /products/enhance-image — dedicated studio photography enhancement endpoint */
  @Post('enhance-image')
  async enhanceImage(
    @Body() body: { imageBase64?: string; category?: string; craftTitle?: string },
  ) {
    if (!body.imageBase64) {
      throw new BadRequestException('imageBase64 is required');
    }
    const result = await this.aiClient.enhanceImage({
      imageBase64: body.imageBase64,
      productId: 'studio-preview',
      category: body.category,
      originalKey: body.craftTitle ? body.craftTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'studio_craft',
    });
    return result;
  }

  /** POST /products/preview-ai — instant live AI studio generation */
  @Post('preview-ai')
  async previewAi(
    @Body() body: {
      textInput?: string;
      voiceBase64?: string;
      categoryHint?: string;
      category?: string;
      craftTitle?: string;
      material?: string;
      region?: string;
      artisanName?: string;
      imageBase64?: string;
      imageUrl?: string;
      dialect?: string;
      language?: string;
      materialCost?: number;
      labourHours?: number;
      hourlyWage?: number;
      overhead?: number;
    },
  ) {
    const category = body.category || body.categoryHint || 'Dokra & Brass';
    const region = body.region || 'Bastar, Chhattisgarh';
    const material = body.material || 'Natural Indigenous Bell Metal & Brass';
    const craftTitle = body.craftTitle || 'Handcrafted Heritage Art';

    const catalog = await this.aiClient.generateCatalog({
      craftTitle,
      category,
      categoryHint: category,
      material,
      region,
      artisanName: body.artisanName,
      textInput: body.textInput,
      voiceBase64: body.voiceBase64,
      imageBase64: body.imageBase64,
      imageUrl: body.imageUrl,
      language: body.language || body.dialect,
      materialCost: body.materialCost,
      labourHours: body.labourHours,
      hourlyWage: body.hourlyWage,
      overhead: body.overhead,
    });

    const baseCost = (body.materialCost ?? 350) + (body.labourHours ?? 14) * (body.hourlyWage ?? 55) + (body.overhead ?? 80);

    const pricing = await this.aiClient.recommendPricing({
      category: catalog.category,
      material: catalog.material,
      technique: catalog.technique,
      artisanDistrict: region,
      baseCost,
    });

    const seo = await this.aiClient.generateSeo({
      productId: 'preview-id',
      title: catalog.title,
      descriptionEn: catalog.description_en,
      category: catalog.category,
      material: catalog.material,
    });

    const district = region.split(',')[0].trim();
    const calculatedRetail = pricing.retail_price_suggested || Math.round(baseCost * 1.55);
    const calculatedWholesale = pricing.wholesale_price_suggested || Math.round(baseCost * 1.25);
    const tier50 = Math.round(baseCost * 1.18);
    const tier100 = Math.round(baseCost * 1.12);

    const marketIntelligence = await this.aiClient.analyzeMarket({
      craftTitle,
      category,
      categoryHint: category,
      material,
      region,
      artisanName: body.artisanName,
      textInput: body.textInput,
      voiceBase64: body.voiceBase64,
      imageBase64: body.imageBase64,
      imageUrl: body.imageUrl,
      language: body.language || body.dialect,
      materialCost: body.materialCost,
      labourHours: body.labourHours,
      hourlyWage: body.hourlyWage,
      overhead: body.overhead,
    });

    return {
      catalog,
      pricing,
      seo,
      marketIntelligence,
    };
  }

  /** POST /products/publish-direct — publish directly into Supabase database */
  @Post('publish-direct')
  publishDirect(
    @Body() body: {
      artisanId?: string;
      title: string;
      descriptionEn?: string;
      descriptionHi?: string;
      category?: string;
      material?: string;
      craftTechnique?: string;
      retailPrice: number;
      wholesalePrice: number;
      moq?: number;
      inventoryQty?: number;
      leadTimeDays?: number;
      giEligible?: boolean;
      imageUrl?: string;
      state?: string;
      district?: string;
    },
  ) {
    return this.productService.publishDirectProduct(body);
  }

  /** POST /products — create product and enqueue AI pipeline */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTISAN)
  @UseInterceptors(FilesInterceptor('images', 10))
  createProduct(
    @CurrentUser() user: JwtPayload,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('textInput') textInput?: string,
  ) {
    return this.productService.createProduct(
      user.sub,
      (files || []).map((f) => ({
        buffer: f.buffer,
        mimetype: f.mimetype,
        originalname: f.originalname,
        size: f.size,
      })),
      undefined,
      textInput,
    );
  }

  /** GET /products — list all published products with artisan info & media */
  @Get()
  getAllProducts() {
    return this.productService.findAllPublished();
  }

  /** GET /products/:id */
  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  /** PUT /products/:id */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTISAN)
  updateProduct(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.productService.updateProduct(user.sub, id, body);
  }

  /** PATCH /products/:id/status */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTISAN)
  changeStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('status') status: ProductStatus,
  ) {
    return this.productService.changeStatus(user.sub, id, status);
  }

  /** DELETE /products/:id */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTISAN)
  deleteProduct(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.productService.deleteProduct(user.sub, id);
  }

  /** POST /products/bulk */
  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTISAN)
  bulkUpdateStatus(
    @CurrentUser() user: JwtPayload,
    @Body() body: { productIds: string[]; targetStatus: ProductStatus },
  ) {
    return this.productService.bulkUpdateStatus(user.sub, body.productIds, body.targetStatus);
  }

  /** GET /products/:id/images/compare */
  @Get(':id/images/compare')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTISAN)
  getImageComparison(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.productService.getImageComparison(user.sub, id);
  }

  /** POST /products/:id/images/revert */
  @Post(':id/images/revert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ARTISAN)
  revertImage(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('mediaId') mediaId: string,
  ) {
    return this.productService.revertToOriginal(user.sub, id, mediaId);
  }
}
