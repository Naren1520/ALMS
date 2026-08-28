import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * TypeORM configuration factory loaded from environment variables.
 * Targets Supabase PostgreSQL with pgvector extension enabled.
 */
export const databaseConfig = registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env['DATABASE_HOST'] ?? 'localhost',
  port: parseInt(process.env['DATABASE_PORT'] ?? '5432', 10),
  database: process.env['DATABASE_NAME'] ?? 'postgres',
  username: process.env['DATABASE_USER'] ?? 'postgres',
  password: process.env['DATABASE_PASSWORD'] ?? '',
  ssl:
    process.env['DATABASE_SSL'] === 'true'
      ? { rejectUnauthorized: false }
      : false,

  // Entities are loaded via glob pattern — every *.entity.ts file in src/
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],

  // Migrations are managed by supabase SQL files — never auto-sync
  synchronize: false,
  migrationsRun: false,
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],

  logging: process.env['NODE_ENV'] === 'development' ? ['query', 'error'] : ['error'],

  extra: {
    // Supabase connection pool sizing
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  },
}));
