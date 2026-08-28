import { Global, Module } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { R2StorageService } from './services/r2-storage.service';

@Global()
@Module({
  providers: [EncryptionService, R2StorageService],
  exports: [EncryptionService, R2StorageService],
})
export class CommonModule {}
