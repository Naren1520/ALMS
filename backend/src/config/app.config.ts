import { registerAs } from '@nestjs/config';

export interface AppConfig {
  nodeEnv: string;
  port: number;
  appName: string;
  frontendUrl: string;
  encryptionKey: string;
  aiServiceUrl: string;
  aiServiceToken: string;
}

/**
 * General application configuration.
 */
export const appConfig = registerAs('app', (): AppConfig => ({
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  port: parseInt(process.env['PORT'] ?? '8080', 10),
  appName: process.env['APP_NAME'] ?? 'ALMS',
  frontendUrl: process.env['FRONTEND_URL'] ?? 'http://localhost:3000',
  encryptionKey: process.env['ENCRYPTION_KEY'] ?? '',
  aiServiceUrl: process.env['AI_SERVICE_URL'] ?? 'http://127.0.0.1:8000',
  aiServiceToken: process.env['AI_SERVICE_TOKEN'] ?? '',
}));
