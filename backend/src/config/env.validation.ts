import * as Joi from 'joi';

/**
 * Joi schema that validates required environment variables at startup.
 * Keys can be supplied as base64 (_B64) or raw PEM — at least one form required.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),

  // Database
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_NAME: Joi.string().default('postgres'),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_SSL: Joi.boolean().default(false),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),

  // JWT — accept base64 or raw PEM (at least one pair must be non-empty)
  JWT_PRIVATE_KEY_B64: Joi.string().allow('').optional(),
  JWT_PUBLIC_KEY_B64:  Joi.string().allow('').optional(),
  JWT_PRIVATE_KEY:     Joi.string().allow('').optional(),
  JWT_PUBLIC_KEY:      Joi.string().allow('').optional(),
  JWT_ACCESS_TOKEN_TTL:  Joi.number().default(900),
  JWT_REFRESH_TOKEN_TTL: Joi.number().default(604800),

  // Encryption — 64 hex chars = 32 bytes AES-256 key
  ENCRYPTION_KEY: Joi.when('NODE_ENV', {
    is: 'test',
    then: Joi.string().allow('').optional(),
    otherwise: Joi.string().length(64).required(),
  }),

  // R2 Storage
  R2_ACCOUNT_ID:        Joi.string().allow('').optional(),
  R2_ACCESS_KEY_ID:     Joi.string().allow('').optional(),
  R2_SECRET_ACCESS_KEY: Joi.string().allow('').optional(),
  R2_BUCKET_NAME:       Joi.string().default('alms-assets'),
  R2_ENDPOINT:          Joi.string().allow('').optional(),

  // Email
  SMTP_HOST:     Joi.string().allow('').optional(),
  SMTP_PORT:     Joi.number().default(587),
  SMTP_USER:     Joi.string().allow('').optional(),
  SMTP_PASSWORD: Joi.string().allow('').optional(),
  EMAIL_FROM:    Joi.string().default('noreply@alms.in'),

  // AI Service
  AI_SERVICE_URL:   Joi.string().default('http://localhost:8000'),
  AI_SERVICE_TOKEN: Joi.string().allow('').optional(),
  GEMINI_API_KEY:   Joi.string().allow('').optional(),

  // Frontend
  FRONTEND_URL: Joi.string().default('http://localhost:3000'),
  APP_NAME:     Joi.string().default('ALMS'),
}).options({ allowUnknown: true });
