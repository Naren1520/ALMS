import { Global, Module } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { R2StorageService } from './services/r2-storage.service';
import { AiServiceClient } from './services/ai-service.client';

@Global()
@Module({
  providers: [EncryptionService, R2StorageService, AiServiceClient],
  exports: [EncryptionService, R2StorageService, AiServiceClient],
})
export class CommonModule {}
