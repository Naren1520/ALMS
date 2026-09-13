import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Storage service — replaces Cloudflare R2.
 * Handles upload, public URL generation, and deletion.
 */
@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private readonly client: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const url = configService.get<string>('SUPABASE_URL') ?? '';
    const serviceKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    this.bucket = configService.get<string>('SUPABASE_STORAGE_BUCKET') ?? 'alms-assets';

    if (url && serviceKey) {
      this.client = createClient(url, serviceKey, {
        auth: { persistSession: false },
      });
    } else {
      // Create a no-op placeholder — all operations will be skipped gracefully
      this.client = null as any;
    }
  }

  /**
   * Upload a file buffer to Supabase Storage.
   * Returns the storage path (key) used.
   */
  async upload(key: string, body: Buffer, contentType: string): Promise<string> {
    if (!this.client) throw new Error('Supabase Storage not configured');
    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(key, body, { contentType, upsert: true });

    if (error) {
      this.logger.error(`Supabase Storage upload failed for key "${key}": ${error.message}`);
      throw new Error(`Storage upload failed: ${error.message}`);
    }
    return key;
  }

  /**
   * Get a public URL for a stored asset.
   * If the bucket is private, this generates a signed URL valid for expiresInSeconds.
   */
  async getSignedUrl(key: string, expiresInSeconds: number): Promise<string> {
    if (!this.client) return key.startsWith('http') ? key : '';
    // Try public URL first (works for public buckets)
    const { data: publicData } = this.client.storage
      .from(this.bucket)
      .getPublicUrl(key);

    if (publicData?.publicUrl) {
      return publicData.publicUrl;
    }

    // Fallback to signed URL for private buckets
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(key, expiresInSeconds);

    if (error || !data?.signedUrl) {
      this.logger.error(`Failed to get signed URL for key "${key}": ${error?.message}`);
      throw new Error(`Failed to get URL for asset: ${error?.message}`);
    }
    return data.signedUrl;
  }

  /**
   * Get the public URL for an asset (assumes public bucket).
   */
  getPublicUrl(key: string): string {
    if (!this.client) return key.startsWith('http') ? key : '';
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(key);
    return data.publicUrl;
  }

  /**
   * Delete a file from Supabase Storage.
   */
  async delete(key: string): Promise<void> {
    if (!this.client) return;
    const { error } = await this.client.storage.from(this.bucket).remove([key]);
    if (error) {
      this.logger.warn(`Supabase Storage delete failed for key "${key}": ${error.message}`);
    }
  }

  /**
   * Check if Supabase Storage is configured (URL + service key present).
   */
  isConfigured(): boolean {
    const url = this.configService.get<string>('SUPABASE_URL') ?? '';
    const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    return url.length > 0 && key.length > 0 && this.client !== null;
  }
}
