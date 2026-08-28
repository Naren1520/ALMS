import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Cloudflare R2 storage service using S3-compatible SDK.
 * Handles upload, signed URL generation, and deletion (Req 2.8, 5.3, 26.3).
 */
@Injectable()
export class R2StorageService {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = configService.get<string>('R2_ACCOUNT_ID') ?? '';
    const accessKeyId = configService.get<string>('R2_ACCESS_KEY_ID') ?? '';
    const secretAccessKey = configService.get<string>('R2_SECRET_ACCESS_KEY') ?? '';
    const endpoint = configService.get<string>('R2_ENDPOINT')
      ?? `https://${accountId}.r2.cloudflarestorage.com`;

    this.bucket = configService.get<string>('R2_BUCKET_NAME') ?? 'alms-assets';

    this.client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async upload(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  /** Generate a time-limited signed URL (Req 26.3) */
  async getSignedUrl(key: string, expiresInSeconds: number): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
