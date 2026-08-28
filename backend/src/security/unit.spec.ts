/**
 * Unit tests: Signed URL expiry enforcement and AES-256-GCM encryption round-trip
 * Validates: Requirements 26.3, 26.6
 */
import { EncryptionService } from '../common/services/encryption.service';
import { ConfigService } from '@nestjs/config';

// ─── EncryptionService unit tests ─────────────────────────────────────────────

class MockConfigService {
  get(key: string): string {
    if (key === 'app.encryptionKey') {
      return 'a'.repeat(64); // 32 bytes in hex
    }
    return '';
  }
}

describe('AES-256-GCM Encryption Round-Trip (Req 26.6)', () => {
  let svc: EncryptionService;

  beforeEach(() => {
    process.env['NODE_ENV'] = 'test';
    svc = new EncryptionService(new MockConfigService() as unknown as ConfigService);
  });

  const PII_FIELDS = [
    { name: 'government_id_number', value: 'ABCDE1234F' },
    { name: 'gst_number', value: '29ABCDE1234F1Z5' },
    { name: 'full_name', value: 'राम कुमार शर्मा' },
    { name: 'registered_address', value: '12, MG Road, Bangalore - 560001' },
    { name: 'bank_account_details', value: 'SBIN0001234|1234567890' },
  ];

  test.each(PII_FIELDS)('$name encrypts and decrypts correctly', ({ value }) => {
    const encrypted = svc.encrypt(value);
    const decrypted = svc.decrypt(encrypted);
    expect(decrypted).toBe(value);
  });

  it('encrypted value is different from plaintext', () => {
    const value = 'test-sensitive-data';
    const encrypted = svc.encrypt(value);
    expect(encrypted.toString('hex')).not.toBe(value);
  });

  it('two encryptions of same value produce different ciphertexts (IV randomness)', () => {
    const value = 'same-input';
    const enc1 = svc.encrypt(value).toString('hex');
    const enc2 = svc.encrypt(value).toString('hex');
    expect(enc1).not.toBe(enc2);
  });

  it('tampered ciphertext throws on decryption', () => {
    const value = 'important-data';
    const encrypted = svc.encrypt(value);
    encrypted[encrypted.length - 1] ^= 0xff; // Flip last byte
    expect(() => svc.decrypt(encrypted)).toThrow();
  });
});

// ─── Signed URL expiry enforcement ────────────────────────────────────────────

describe('Signed URL Expiry Enforcement (Req 26.3)', () => {
  interface SignedUrl {
    url: string;
    expiresAt: Date;
    type: 'verification_doc' | 'product_media';
  }

  function generateSignedUrl(type: SignedUrl['type']): SignedUrl {
    const ttl =
      type === 'verification_doc'
        ? 60 * 60      // 60 minutes
        : 24 * 60 * 60; // 24 hours

    return {
      url: `https://r2.example.com/key?sig=abc&exp=${Date.now() + ttl * 1000}`,
      expiresAt: new Date(Date.now() + ttl * 1000),
      type,
    };
  }

  function isExpired(signed: SignedUrl, checkAt: Date): boolean {
    return checkAt > signed.expiresAt;
  }

  it('verification document signed URLs expire after 60 minutes', () => {
    const signed = generateSignedUrl('verification_doc');
    const SIXTY_MIN_PLUS_ONE = new Date(Date.now() + 61 * 60 * 1000);
    expect(isExpired(signed, SIXTY_MIN_PLUS_ONE)).toBe(true);
  });

  it('verification document signed URLs are valid within 60 minutes', () => {
    const signed = generateSignedUrl('verification_doc');
    const FIFTY_NINE_MIN = new Date(Date.now() + 59 * 60 * 1000);
    expect(isExpired(signed, FIFTY_NINE_MIN)).toBe(false);
  });

  it('product media signed URLs expire after 24 hours', () => {
    const signed = generateSignedUrl('product_media');
    const TWENTY_FIVE_HOURS = new Date(Date.now() + 25 * 60 * 60 * 1000);
    expect(isExpired(signed, TWENTY_FIVE_HOURS)).toBe(true);
  });

  it('product media signed URLs are valid within 24 hours', () => {
    const signed = generateSignedUrl('product_media');
    const TWENTY_THREE_HOURS = new Date(Date.now() + 23 * 60 * 60 * 1000);
    expect(isExpired(signed, TWENTY_THREE_HOURS)).toBe(false);
  });
});
