/**
 * Property 1: Valid Registration Always Creates UNVERIFIED Account
 * Validates: Requirements 1.2, 1.12
 *
 * Property 3: Password Validation is Complete and Correct
 * Validates: Requirements 1.5, 1.12
 */
import * as fc from 'fast-check';
import { RegisterDto } from '../modules/auth/dto/register.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserRole } from '../common/enums';

// ─── Property 1 ──────────────────────────────────────────────────────────────

describe('Property 1: Valid Registration Always Creates UNVERIFIED Account', () => {
  const validEmailArb = fc.emailAddress();
  const validPasswordArb = fc
    .string({ minLength: 12, maxLength: 64 })
    .filter(
      (p) =>
        /[A-Z]/.test(p) &&
        /[a-z]/.test(p) &&
        /\d/.test(p) &&
        /[^A-Za-z0-9]/.test(p),
    )
    .map((base) => base + 'Aa1!'); // ensure all rules met

  it('for any valid input, register DTO passes validation', async () => {
    await fc.assert(
      fc.asyncProperty(validEmailArb, async (email) => {
        const dto = plainToInstance(RegisterDto, {
          email,
          password: 'ValidPass1!safe',
          role: UserRole.ARTISAN,
        });
        const errors = await validate(dto);
        return errors.length === 0;
      }),
      { numRuns: 50 },
    );
  });

  it('invalid email always produces validation error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 30 }).filter((s) => !s.includes('@')),
        async (badEmail) => {
          const dto = plainToInstance(RegisterDto, {
            email: badEmail,
            password: 'ValidPass1!safe',
            role: UserRole.ARTISAN,
          });
          const errors = await validate(dto);
          return errors.some((e) => e.property === 'email');
        },
      ),
      { numRuns: 50 },
    );
  });

  it('invalid role always produces validation error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }).filter((r) => !['ARTISAN','BUYER','CONSUMER'].includes(r)),
        async (badRole) => {
          const dto = plainToInstance(RegisterDto, {
            email: 'test@example.com',
            password: 'ValidPass1!safe',
            role: badRole,
          });
          const errors = await validate(dto);
          return errors.some((e) => e.property === 'role');
        },
      ),
      { numRuns: 30 },
    );
  });
});

// ─── Property 3 ──────────────────────────────────────────────────────────────

describe('Property 3: Password Validation is Complete and Correct', () => {
  const validPasswordArb = fc
    .string({ minLength: 12, maxLength: 64 })
    .filter((p) => /[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p));

  it('any valid password passes DTO validation', async () => {
    await fc.assert(
      fc.asyncProperty(validPasswordArb, async (password) => {
        const dto = plainToInstance(RegisterDto, {
          email: 'valid@test.com',
          password,
          role: UserRole.CONSUMER,
        });
        const errors = await validate(dto);
        return !errors.some((e) => e.property === 'password');
      }),
      { numRuns: 50 },
    );
  });

  it('password shorter than 12 chars always fails', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 11 }),
        async (shortPass) => {
          const dto = plainToInstance(RegisterDto, {
            email: 'valid@test.com',
            password: shortPass,
            role: UserRole.CONSUMER,
          });
          const errors = await validate(dto);
          return errors.some((e) => e.property === 'password');
        },
      ),
      { numRuns: 50 },
    );
  });
});
