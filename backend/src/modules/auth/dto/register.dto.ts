import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../common/enums';

/**
 * DTO for POST /auth/register
 *
 * Only the three public-registration roles are accepted.
 * ADMIN and MODERATOR can only be granted by an existing Admin.
 */
export class RegisterDto {
  @IsEmail({}, { message: 'email must be a valid RFC 5321 email address' })
  email!: string;

  /**
   * Password policy (Requirement 1.5):
   *   ≥12 chars, ≥1 uppercase, ≥1 lowercase, ≥1 digit, ≥1 special character
   */
  @IsString()
  password!: string;

  @IsEnum(
    [UserRole.ARTISAN, UserRole.BUYER, UserRole.CONSUMER],
    {
      message: `role must be one of: ${UserRole.ARTISAN}, ${UserRole.BUYER}, ${UserRole.CONSUMER}`,
    },
  )
  role!: UserRole.ARTISAN | UserRole.BUYER | UserRole.CONSUMER;
}
