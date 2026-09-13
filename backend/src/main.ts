import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';
import { AppConfig } from './config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug'] });

  const configService = app.get(ConfigService);
  const appCfg = configService.get<AppConfig>('app')!;

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
        },
      },
    }),
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      // Allow Render preview URLs, Vercel deployments, and configured frontend
      const allowedPatterns = [
        appCfg.frontendUrl,
        /\.vercel\.app$/,
        /\.onrender\.com$/,
        /^http:\/\/localhost(:\d+)?$/,
      ];
      if (!origin || allowedPatterns.some(p => typeof p === 'string' ? p === origin : p.test(origin))) {
        callback(null, true);
      } else {
        callback(null, true); // permissive for hackathon — tighten in prod
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });

  // Global validation pipe — transforms + validates all DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: false,
    }),
  );

  // Global exception filter normalises all errors to ApiError shape
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api/v1');

  // Health check endpoint for Render (outside global prefix)
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/health', (_req: any, res: any) => {
    res.status(200).json({ status: 'ok', service: 'alms-backend', timestamp: new Date().toISOString() });
  });
  httpAdapter.get('/api/v1/health', (_req: any, res: any) => {
    res.status(200).json({ status: 'ok', service: 'alms-backend', timestamp: new Date().toISOString() });
  });

  const port = appCfg.port;
  await app.listen(port);
  logger.log(`ALMS Backend running on port ${port} (${appCfg.nodeEnv})`);
}

bootstrap();
