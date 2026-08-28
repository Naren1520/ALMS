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
  @MinLength(12, { message: 'password must be at least 12 characters long' })
  @Matches(/[A-Z]/, { message: 'password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'password must contain at least one lowercase letter' })
  @Matches(/\d/, { message: 'password must contain at least one digit' })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'password must contain at least one special character',
  })
  password!: string;

  @IsEnum(
    [UserRole.ARTISAN, UserRole.BUYER, UserRole.CONSUMER],
    {
      message: `role must be one of: ${UserRole.ARTISAN}, ${UserRole.BUYER}, ${UserRole.CONSUMER}`,
    },
  )
  role!: UserRole.ARTISAN | UserRole.BUYER | UserRole.CONSUMER;
}
