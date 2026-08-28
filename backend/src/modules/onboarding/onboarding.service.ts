import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ArtisanVerificationEntity } from './entities/artisan-verification.entity';
import { ArtisanProfileEntity } from './entities/artisan-profile.entity';
import { BuyerVerificationEntity } from './entities/buyer-verification.entity';
import { BuyerProfileEntity } from './entities/buyer-profile.entity';
import { EncryptionService } from '../../common/services/encryption.service';
import { NotificationsService } from '../notifications/notifications.service';
import { VerificationStatus, UserRole, NotificationCategory, TrustEventType } from '../../common/enums';
import { TrustService } from '../trust/trust.service';

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    @InjectRepository(ArtisanVerificationEntity)
    private readonly artisanVerRepo: Repository<ArtisanVerificationEntity>,
    @InjectRepository(ArtisanProfileEntity)
    private readonly artisanProfileRepo: Repository<ArtisanProfileEntity>,
    @InjectRepository(BuyerVerificationEntity)
    private readonly buyerVerRepo: Repository<BuyerVerificationEntity>,
    @InjectRepository(BuyerProfileEntity)
    private readonly buyerProfileRepo: Repository<BuyerProfileEntity>,
    private readonly dataSource: DataSource,
    private readonly encryptionService: EncryptionService,
    private readonly notificationsService: NotificationsService,
    private readonly trustService: TrustService,
  ) {}

  // ─── Artisan Onboarding ────────────────────────────────────────────────────

  async submitArtisanVerification(
    artisanId: string,
    data: {
      fullName: string;
      state: string;
      district: string;
      primaryCraft: string;
      documentKey?: string;
    },
  ): Promise<ArtisanVerificationEntity> {
    // Check for existing PENDING submission (Req 2.4)
    const existing = await this.artisanVerRepo.findOne({
      where: { artisanId, status: VerificationStatus.PENDING },
    });
    if (existing) {
      throw new ConflictException(
        'A verification review is already in progress. Please wait for the current review to be completed.',
      );
    }

    // Upsert artisan profile
    const fullNameEnc = this.encryptionService.encrypt(data.fullName);
    await this.artisanProfileRepo.upsert(
      {
        id: artisanId,
        fullNameEnc,
        state: data.state,
        district: data.district,
        primaryCraft: data.primaryCraft,
      },
      { conflictPaths: ['id'] },
    );

    const verification = await this.artisanVerRepo.save({
      artisanId,
      status: VerificationStatus.PENDING,
      documentKey: data.documentKey ?? null,
    });

    // Notify all moderators within 60s (Req 2.3) — via BullMQ
    await this.notificationsService.notifyModerators({
      category: NotificationCategory.VERIFICATION_STATUS,
      title: 'New Artisan Verification Request',
      body: `Artisan ${artisanId} has submitted a verification request.`,
      referenceId: verification.id,
    });

    return verification;
  }

  async approveArtisanVerification(moderatorId: string, verificationId: string): Promise<void> {
    const ver = await this.artisanVerRepo.findOne({ where: { id: verificationId } });
    if (!ver) throw new NotFoundException('Verification not found');

    await this.artisanVerRepo.update(verificationId, {
      status: VerificationStatus.APPROVED,
      reviewedBy: moderatorId,
      reviewedAt: new Date(),
    });
    await this.artisanProfileRepo.update(ver.artisanId, { verified: true });

    // Record Trust_Event (Req 2.5)
    await this.trustService.recordEvent({
      userId: ver.artisanId,
      eventType: TrustEventType.IDENTITY_VERIFIED,
      referenceId: verificationId,
    });

    // Notify artisan (Req 2.5)
    await this.notificationsService.sendToUser(ver.artisanId, {
      category: NotificationCategory.VERIFICATION_STATUS,
      title: 'Verification Approved',
      body: 'Your artisan identity has been verified. You can now publish products.',
    });

    await this.dataSource
      .query(
        `INSERT INTO audit_logs (event_type, actor_id, target_id) VALUES ($1,$2,$3)`,
        ['ARTISAN_VERIFICATION_APPROVED', moderatorId, ver.artisanId],
      )
      .catch(() => {});
  }

  async rejectArtisanVerification(
    moderatorId: string,
    verificationId: string,
    reason: string,
  ): Promise<void> {
    if (reason.length < 10) {
      throw new BadRequestException('Rejection reason must be at least 10 characters');
    }

    const ver = await this.artisanVerRepo.findOne({ where: { id: verificationId } });
    if (!ver) throw new NotFoundException('Verification not found');

    await this.artisanVerRepo.update(verificationId, {
      status: VerificationStatus.REJECTED,
      rejectionReason: reason,
      reviewedBy: moderatorId,
      reviewedAt: new Date(),
    });

    await this.notificationsService.sendToUser(ver.artisanId, {
      category: NotificationCategory.VERIFICATION_STATUS,
      title: 'Verification Rejected',
      body: `Your verification was rejected: ${reason}`,
    });
  }

  // ─── Buyer Onboarding ──────────────────────────────────────────────────────

  validateGstin(gstin: string): boolean {
    return GSTIN_REGEX.test(gstin);
  }

  async submitBuyerVerification(
    buyerId: string,
    data: {
      companyName: string;
      gstNumber: string;
      registeredAddress: string;
      businessCategory: string;
      annualVolumeInr?: number;
      documentKeys: string[];
    },
  ): Promise<BuyerVerificationEntity> {
    if (!this.validateGstin(data.gstNumber)) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'BAD_REQUEST',
        message: 'Validation failed',
        details: {
          gstNumber: [
            'Must be a valid 15-character GSTIN (2-digit state code + 10-char PAN + entity + check + Z + alphanumeric)',
          ],
        },
      });
    }

    if (!data.documentKeys || data.documentKeys.length === 0) {
      throw new BadRequestException('At least one verification document is required');
    }

    const existing = await this.buyerVerRepo.findOne({
      where: { buyerId, status: VerificationStatus.PENDING },
    });
    if (existing) {
      throw new ConflictException('A verification review is already in progress.');
    }

    const gstNumberEnc = this.encryptionService.encrypt(data.gstNumber);
    const registeredAddressEnc = this.encryptionService.encrypt(data.registeredAddress);

    await this.buyerProfileRepo.upsert(
      {
        id: buyerId,
        companyName: data.companyName,
        gstNumberEnc,
        registeredAddressEnc,
        businessCategory: data.businessCategory,
        annualVolumeInr: data.annualVolumeInr ?? null,
      },
      { conflictPaths: ['id'] },
    );

    const verification = await this.buyerVerRepo.save({
      buyerId,
      status: VerificationStatus.PENDING,
      documentKeys: data.documentKeys,
    });

    await this.notificationsService.notifyModerators({
      category: NotificationCategory.VERIFICATION_STATUS,
      title: 'New Buyer Verification Request',
      body: `Buyer ${buyerId} has submitted a verification request.`,
      referenceId: verification.id,
    });

    return verification;
  }

  async approveBuyerVerification(moderatorId: string, verificationId: string): Promise<void> {
    const ver = await this.buyerVerRepo.findOne({ where: { id: verificationId } });
    if (!ver) throw new NotFoundException('Verification not found');

    await this.buyerVerRepo.update(verificationId, {
      status: VerificationStatus.APPROVED,
      reviewedBy: moderatorId,
      reviewedAt: new Date(),
    });
    await this.buyerProfileRepo.update(ver.buyerId, { verified: true });

    await this.trustService.recordEvent({
      userId: ver.buyerId,
      eventType: TrustEventType.BUSINESS_VERIFIED,
      referenceId: verificationId,
    });

    await this.notificationsService.sendToUser(ver.buyerId, {
      category: NotificationCategory.VERIFICATION_STATUS,
      title: 'Business Verification Approved',
      body: 'Your business has been verified. You can now submit RFQs and access wholesale pricing.',
    });
  }

  async rejectBuyerVerification(moderatorId: string, verificationId: string, reason: string): Promise<void> {
    if (reason.length < 10) throw new BadRequestException('Rejection reason must be at least 10 characters');

    const ver = await this.buyerVerRepo.findOne({ where: { id: verificationId } });
    if (!ver) throw new NotFoundException('Verification not found');

    await this.buyerVerRepo.update(verificationId, {
      status: VerificationStatus.REJECTED,
      rejectionReason: reason,
      reviewedBy: moderatorId,
      reviewedAt: new Date(),
    });

    await this.notificationsService.sendToUser(ver.buyerId, {
      category: NotificationCategory.VERIFICATION_STATUS,
      title: 'Business Verification Rejected',
      body: `Your verification was rejected: ${reason}`,
    });
  }

  async isArtisanVerified(artisanId: string): Promise<boolean> {
    const profile = await this.artisanProfileRepo.findOne({ where: { id: artisanId } });
    return profile?.verified ?? false;
  }

  async isBuyerVerified(buyerId: string): Promise<boolean> {
    const profile = await this.buyerProfileRepo.findOne({ where: { id: buyerId } });
    return profile?.verified ?? false;
  }
}
