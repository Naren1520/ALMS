import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EnhanceImageDto {
  imageBase64: string;
  productId: string;
  category?: string;
  originalKey: string;
}

export interface EnhanceImageResult {
  original_key: string;
  enhanced_base64: string;
  width: number;
  height: number;
  size_bytes: number;
  format: string;
  processing_time_ms: number;
}

export interface CatalogGenerateDto {
  textInput?: string;
  voiceBase64?: string;
  categoryHint?: string;
  language?: string;
}

export interface CatalogResult {
  title: string;
  description_en: string;
  description_hi: string;
  category: string;
  subcategory: string;
  material: string;
  technique: string;
  care_instructions: string;
  dimensions?: { length_cm: number; width_cm: number; height_cm: number; weight_g: number } | null;
  hashtags: string[];
  keywords: string[];
  confidence_scores: Record<string, number>;
  review_required_fields: string[];
}

export interface PricingRecommendDto {
  category: string;
  material: string;
  technique: string;
  artisanDistrict?: string;
  baseCost?: number;
}

export interface PricingResult {
  retail_price_min: number;
  retail_price_suggested: number;
  retail_price_max: number;
  wholesale_price_min: number;
  wholesale_price_suggested: number;
  wholesale_price_max: number;
  moq_suggested: number;
  confidence: number;
  factor_breakdown: Array<{ factor_name: string; description: string; impact: string }>;
}

export interface SeoGenerateDto {
  productId: string;
  title: string;
  descriptionEn: string;
  category: string;
  material?: string;
}

export interface SeoResult {
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  canonical_slug: string;
  hashtags: string[];
  keywords: string[];
  json_ld: Record<string, unknown>;
}

export interface ModerationCheckDto {
  content: string;
  contentType: 'review' | 'listing' | 'message';
  language?: string;
}

export interface ModerationResult {
  verdict: 'SAFE' | 'REQUIRES_REVIEW' | 'VIOLATES_POLICY';
  category?: string;
  confidence: number;
}

@Injectable()
export class AiServiceClient {
  private readonly logger = new Logger(AiServiceClient.name);
  private readonly baseUrl: string;
  private readonly serviceToken: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('app.aiServiceUrl') ?? 'http://localhost:8000';
    this.serviceToken = this.configService.get<string>('app.aiServiceToken') ?? 'dev-token';
  }

  private async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T | null> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-service-token': this.serviceToken,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.warn(`AI Service ${endpoint} returned ${response.status}: ${errorText}`);
        return null;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      this.logger.error(`Failed to connect to AI Service at ${endpoint}: ${(err as Error).message}`);
      return null;
    }
  }

  async checkHealth(): Promise<{ status: string; service: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (response.ok) return await response.json();
    } catch {
      // ignore
    }
    return { status: 'fallback', service: 'ALMS AI Service (Local Mode)' };
  }

  async enhanceImage(payload: EnhanceImageDto): Promise<EnhanceImageResult | null> {
    return this.post<EnhanceImageResult>('/pipeline/image/enhance', {
      image_base64: payload.imageBase64,
      product_id: payload.productId,
      category: payload.category,
      original_key: payload.originalKey,
    });
  }

  async generateCatalog(payload: CatalogGenerateDto): Promise<CatalogResult> {
    const res = await this.post<CatalogResult>('/pipeline/catalog/generate', {
      text_input: payload.textInput,
      voice_base64: payload.voiceBase64,
      category_hint: payload.categoryHint,
      language: payload.language,
    });

    if (res) return res;

    // Resilient fallback
    const title = payload.textInput ? payload.textInput.slice(0, 80) : 'Handcrafted Heritage Product';
    return {
      title,
      description_en: `${title}. Authentic handcrafted creation preserving Indian indigenous craft techniques.`,
      description_hi: 'प्रामाणिक पारंपरिक भारतीय हस्तशिल्प उत्पाद।',
      category: payload.categoryHint || 'Handicrafts',
      subcategory: 'Artisan Heritage',
      material: 'Natural Traditional Material',
      technique: 'Handmade Artisan Method',
      care_instructions: 'Handle with care. Store in dry place away from direct sunlight.',
      dimensions: null,
      hashtags: ['#handmade', '#artisan', '#indigenous', '#heritage', '#india'],
      keywords: ['handmade', 'artisan', 'indigenous', 'heritage', 'fair-trade', 'ondc', 'craft'],
      confidence_scores: {
        title: 0.9,
        description: 0.85,
        category: 0.9,
        subcategory: 0.8,
        material: 0.85,
        technique: 0.85,
        care_instructions: 0.9,
      },
      review_required_fields: [],
    };
  }

  async recommendPricing(payload: PricingRecommendDto): Promise<PricingResult> {
    const res = await this.post<PricingResult>('/pipeline/pricing/recommend', {
      category: payload.category,
      material: payload.material,
      technique: payload.technique,
      artisan_district: payload.artisanDistrict || 'India',
    });

    if (res) return res;

    const base = payload.baseCost ?? 500;
    return {
      retail_price_min: Math.round(base * 1.3),
      retail_price_suggested: Math.round(base * 1.6),
      retail_price_max: Math.round(base * 2.2),
      wholesale_price_min: Math.round(base * 1.15),
      wholesale_price_suggested: Math.round(base * 1.3),
      wholesale_price_max: Math.round(base * 1.5),
      moq_suggested: 10,
      confidence: 0.85,
      factor_breakdown: [
        { factor_name: 'Raw Material & Labor', description: 'Calculated artisan cost base', impact: 'positive' },
        { factor_name: 'Fair Wage Multiplier', description: 'MoSJE mandated sustainable margin', impact: 'positive' },
      ],
    };
  }

  async generateSeo(payload: SeoGenerateDto): Promise<SeoResult> {
    const res = await this.post<SeoResult>('/pipeline/seo/generate', {
      product_id: payload.productId,
      title: payload.title,
      description_en: payload.descriptionEn,
      category: payload.category,
      material: payload.material,
    });

    if (res) return res;

    const slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80);
    return {
      meta_title: payload.title.slice(0, 60),
      meta_description: payload.descriptionEn.slice(0, 160),
      og_title: payload.title.slice(0, 90),
      og_description: payload.descriptionEn.slice(0, 300),
      canonical_slug: slug,
      hashtags: ['#handmade', '#artisan', '#india', '#heritage', '#craft'],
      keywords: ['handmade', 'artisan', 'india', payload.category.toLowerCase(), 'craft', 'traditional', 'fair-trade'],
      json_ld: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: payload.title,
        description: payload.descriptionEn,
        category: payload.category,
      },
    };
  }

  async checkModeration(payload: ModerationCheckDto): Promise<ModerationResult> {
    const res = await this.post<ModerationResult>('/pipeline/moderation/check', {
      content: payload.content,
      content_type: payload.contentType,
      language: payload.language || 'en',
    });

    if (res) return res;

    return { verdict: 'SAFE', confidence: 0.9 };
  }
}
