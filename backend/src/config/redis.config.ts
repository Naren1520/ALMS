import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

/**
 * Redis connection configuration.
 * Used by BullMQ queues and the Socket.io Redis adapter.
 */
export const redisConfig = registerAs('redis', (): RedisConfig => ({
  host: process.env['REDIS_HOST'] ?? 'localhost',
  port: parseInt(process.env['REDIS_PORT'] ?? '6379', 10),
  ...(process.env['REDIS_PASSWORD'] ? { password: process.env['REDIS_PASSWORD'] } : {}),
}));
