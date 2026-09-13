import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseStorageService } from './supabase-storage.service';

/**
 * R2StorageService — now backed by Supabase Storage.
 * Kept as a named alias so existing injection across ProductService,
 * ProductProcessor, etc. continues to work without refactoring.
 */
@Injectable()
export class R2StorageService {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly delegate: SupabaseStorageService;

  constructor(private readonly configService: ConfigService) {
    this.delegate = new SupabaseStorageService(configService);
  }

  /** Upload buffer to Supabase Storage. Returns the storage key. */
  async upload(key: string, body: Buffer, contentType: string): Promise<void> {
    if (!this.delegate.isConfigured()) {
      this.logger.warn(`Storage not configured — skipping upload for key: ${key}`);
      return;
    }
    await this.delegate.upload(key, body, contentType);
  }

  /** Get a time-limited signed URL (or public URL) for the asset. */
  async getSignedUrl(key: string, expiresInSeconds: number): Promise<string> {
    if (!this.delegate.isConfigured()) {
      // Return key as-is — for imageUrl strings stored directly in the DB
      return key.startsWith('http') ? key : '';
    }
    return this.delegate.getSignedUrl(key, expiresInSeconds);
  }

  /** Get the public URL directly. */
  getPublicUrl(key: string): string {
    if (!this.delegate.isConfigured()) {
      return key.startsWith('http') ? key : '';
    }
    return this.delegate.getPublicUrl(key);
  }

  /** Delete an asset. */
  async delete(key: string): Promise<void> {
    if (!this.delegate.isConfigured()) {
      this.logger.warn(`Storage not configured — skipping delete for key: ${key}`);
      return;
    }
    await this.delegate.delete(key);
  }
}
