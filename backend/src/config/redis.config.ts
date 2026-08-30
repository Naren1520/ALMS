import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  tls?: Record<string, unknown>;
}

/**
 * Redis connection configuration.
 * Used by BullMQ queues and the Socket.io Redis adapter.
 */
export const redisConfig = registerAs('redis', (): RedisConfig => {
  const host = process.env['REDIS_HOST'] ?? 'localhost';
  const isUpstash = host.includes('upstash.io') || process.env['REDIS_TLS'] === 'true';
  return {
    host,
    port: parseInt(process.env['REDIS_PORT'] ?? '6379', 10),
    ...(process.env['REDIS_PASSWORD'] ? { password: process.env['REDIS_PASSWORD'] } : {}),
    ...(isUpstash ? { tls: {} } : {}),
  };
});
