# ALMS — Backend Service (NestJS)

[![NestJS](https://img.shields.io/badge/NestJS-10.3-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3-FE0803?style=flat&logo=typeorm&logoColor=white)](https://typeorm.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?style=flat&logo=socketdotio&logoColor=white)](https://socket.io/)
[![BullMQ](https://img.shields.io/badge/BullMQ-5.13-FF6384?style=flat&logo=redis&logoColor=white)](https://bullmq.io/)

The core REST API and WebSocket backend for the **Artisan Linkage and Market System (ALMS)**, powering cataloging, B2B procurement, semantic search, inventory management, trust scoring, and real-time buyer-artisan collaboration.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Key Features & Modules](#key-features--modules)
- [Directory Structure](#directory-structure)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Installation & Setup](#installation--setup)
- [Available Scripts](#available-scripts)
- [API & WebSocket Catalog](#api--websocket-catalog)
- [Security Architecture](#security-architecture)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Docker & Production Deployment](#docker--production-deployment)

---

## Architecture Overview

The ALMS Backend is built with **NestJS 10** using a modular domain-driven design with **TypeORM**, **PostgreSQL (Supabase)**, and **Redis (ioredis & BullMQ)**.

```
                  ┌──────────────────────────────┐
                  │    Next.js Frontend (3000)   │
                  └──────────────┬───────────────┘
                                 │ HTTP (REST) / WSS (Socket.io)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ALMS NestJS Backend (3001)                   │
│                                                                 │
│  [Global Filters & Security]                                    │
│   • Helmet Security Headers       • Argon2 Password Hashing     │
│   • CORS & Cookie Parser          • AES-256-GCM PII Encryption  │
│   • Global ValidationPipe         • RS256 JWT & Refresh Tokens  │
│   • Throttler Rate Limiting       • Exception Formatter Filter  │
│                                                                 │
│  [Domain Modules]                                               │
│   • Auth & Onboarding             • B2B RFQs & Quotes           │
│   • Product & AI Pipeline         • Messaging (WebSockets)      │
│   • Inventory & Stock Logs        • Trust Score Engine (0-100)  │
│   • Semantic Search (pgvector)    • Reviews & Disputes          │
│   • Craft Atlas & GI Tags         • Admin & Moderation Queue    │
└──────────────┬──────────────────┬─────────────────┬─────────────┘
               │                  │                 │
               ▼                  ▼                 ▼
     PostgreSQL + pgvector     Redis 7        FastAPI AI Service
       (Supabase DB)       (Cache / BullMQ)   (Gemini + rembg)
```

---

## Key Features & Modules

| Module | Description |
| :--- | :--- |
| **Auth & Security** | Asymmetric RS256 JWT access tokens (15m TTL), rotating refresh tokens in DB (SHA-256 hashed), Argon2 password hashing, and AES-256-GCM encrypted PII. |
| **Onboarding** | Multi-step role-based onboarding for Artisans (identity, craft specialization, bank details) and Buyers (organization, business type). |
| **Product Management** | Product lifecycle CRUD, multi-image upload to Cloudflare R2, automated AI pipeline integration, and craft GI tag verification. |
| **Inventory & Delta Logs** | Real-time stock tracking, atomic inventory decrements, batch tracking, threshold alerts, and excess inventory flash liquidation. |
| **B2B Procurement (RFQ)** | Complete Request for Quotation flow: RFQ creation, AI artisan matching, multi-tier pricing, sample requests, and milestone-based negotiations. |
| **Semantic Search** | Vector similarity queries using 768-dimensional text embeddings (`text-embedding-004`) via PostgreSQL `pgvector` HNSW indexes. |
| **Trust Score Engine** | Dynamic 0–100 explainable artisan trust scoring based on 11 weighted runtime factors (identity verification, fulfillment rate, review ratings, dispute record). |
| **Real-time Messaging** | Bi-directional WebSocket conversations (`/messaging` gateway) with message translation, status receipts (`SENT`, `DELIVERED`, `READ`), and moderation. |
| **Craft Atlas** | Geographical craft mapping, regional GI tag directory (11+ seeded crafts), and artisan density index across Indian states. |
| **Disputes & Moderation** | Structured claim filing, evidence submission, moderator assignment, resolution tracking, and BullMQ background task processing. |
| **Admin Panel** | Artisan verification queue, listing moderation, dispute arbitration, platform configuration overrides, and audit logs. |

---

## Directory Structure

```
backend/
├── src/
│   ├── app.module.ts              # Root NestJS application module
│   ├── main.ts                    # Bootstrap entry point (port, pipes, CORS, helmet)
│   ├── common/                    # Shared decorators, filters, interfaces, and utilities
│   │   ├── decorators/            # @CurrentUser, @Roles, etc.
│   │   ├── filters/               # Global HttpExceptionFilter
│   │   ├── interfaces/            # API response formats and common types
│   │   └── services/              # Encryption and utility services
│   ├── config/                    # Configuration loaders and Joi validation schema
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── env.validation.ts      # Strict Joi validation for startup env vars
│   │   ├── jwt.config.ts
│   │   └── redis.config.ts
│   └── modules/                   # Domain feature modules
│       ├── admin/                 # Platform administration & audit logs
│       ├── atlas/                 # Craft Atlas & GI tag registry
│       ├── auth/                  # Authentication, JWT strategies, refresh tokens
│       ├── b2b/                   # B2B RFQs, Quotes, Milestone management
│       ├── delivery/              # Shipping estimation and delivery tracking
│       ├── dispute/               # Dispute creation and evidence processing
│       ├── excess-inventory/      # Clearance and discount management
│       ├── inventory/             # Stock tracking, logs, and low-stock alerts
│       ├── market-discovery/      # Market trends & price recommendation
│       ├── messaging/             # Socket.io gateway & chat conversations
│       ├── moderation/            # Content filtering & BullMQ processors
│       ├── notifications/         # In-app notification delivery
│       ├── onboarding/            # Artisan & Buyer profile onboarding
│       ├── product/               # Product catalog, AI pipeline trigger, media
│       ├── review/                # Ratings, verified buyer reviews
│       ├── search/                # Semantic search with pgvector
│       └── trust/                 # Explainable Trust Score calculator
├── Dockerfile                     # Multi-stage production container build
├── nest-cli.json                  # Nest CLI configuration
├── package.json                   # Dependencies and scripts
└── tsconfig.json                  # TypeScript compiler settings
```

---

## Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js**: `v20.x` or later (LTS recommended)
- **npm**: `v10.x` or later
- **PostgreSQL**: `v16` (with `pgvector` extension enabled, e.g. Supabase)
- **Redis**: `v7.x` (locally via Docker or cloud provider like Upstash/Aiven)
- **OpenSSL**: For generating RS256 key pairs and encryption keys

---

## Environment Configuration

Create a `.env` file in the `/backend` directory:

```bash
cp .env.example .env
```

### Required Keys & Generation Commands

| Variable | Description | Example / How to Generate |
| :--- | :--- | :--- |
| `NODE_ENV` | Application environment (`development` \| `production` \| `test`) | `development` |
| `PORT` | HTTP Server Port | `3001` |
| `FRONTEND_URL` | Allowed CORS origin for frontend | `http://localhost:3000` |
| `DATABASE_HOST` | PostgreSQL Host (e.g., Supabase pooler/direct) | `db.your-project.supabase.co` |
| `DATABASE_PORT` | PostgreSQL Port | `5432` |
| `DATABASE_NAME` | Database name | `postgres` |
| `DATABASE_USER` | PostgreSQL Username | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL Password | `your-db-password` |
| `DATABASE_SSL` | Enable SSL for PostgreSQL | `true` |
| `REDIS_HOST` | Redis Host | `localhost` |
| `REDIS_PORT` | Redis Port | `6379` |
| `REDIS_PASSWORD` | Redis Password (if applicable) | `optional` |
| `JWT_PRIVATE_KEY` | RSA Private Key for RS256 signing | *See RSA key generation below* |
| `JWT_PUBLIC_KEY` | RSA Public Key for RS256 verification | *See RSA key generation below* |
| `ENCRYPTION_KEY` | 64 hex characters (32 bytes) for AES-256-GCM | `openssl rand -hex 32` |
| `R2_ACCOUNT_ID` | Cloudflare R2 Account ID | `your-r2-account-id` |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 Access Key | `your-r2-access-key` |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 Secret Key | `your-r2-secret-key` |
| `R2_BUCKET_NAME` | Cloudflare R2 Bucket Name | `alms-assets` |
| `AI_SERVICE_URL` | FastAPI AI Service endpoint | `http://localhost:8000` |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |

### Generating Cryptographic Keys

1. **RS256 JWT Key Pair**:
   ```bash
   # Generate Private Key
   openssl genrsa -out private.pem 2048

   # Extract Public Key
   openssl rsa -in private.pem -pubout -out public.pem
   ```
   *Paste the contents into `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` (or supply as base64 in `JWT_PRIVATE_KEY_B64` and `JWT_PUBLIC_KEY_B64`).*

2. **AES-256 Encryption Key**:
   ```bash
   openssl rand -hex 32
   ```

---

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```
   *(If there are peer dependency warnings on your platform, use `npm install --legacy-peer-deps`)*

2. **Setup Database**:
   Ensure PostgreSQL has the `pgvector` extension enabled:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

3. **Start Required Services (via Docker)**:
   If running Redis and Postgres locally:
   ```bash
   # From the project root
   docker compose up -d redis postgres
   ```

4. **Start the Development Server**:
   ```bash
   npm run start:dev
   # or
   npm run dev
   ```
   The backend will be available at **`http://localhost:3001`** with API prefix **`/api/v1`**.

---

## Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` / `npm run start:dev` | Start the development server with live reload / watch mode |
| `npm run start` | Start the application in standard mode |
| `npm run start:debug` | Start the application with V8 inspector debugging enabled |
| `npm run build` | Compile TypeScript into production JavaScript in `/dist` |
| `npm run start:prod` | Run the compiled production build from `/dist/main` |
| `npm test` | Run the test suite with Jest (including fast-check property tests) |
| `npm run test:watch` | Run Jest in interactive watch mode |
| `npm run test:cov` | Generate test coverage report |
| `npm run test:e2e` | Run end-to-end integration tests |
| `npm run lint` | Run ESLint to find and fix code style issues |
| `npm run format` | Format code using Prettier |

---

## API & WebSocket Catalog

All REST routes are prefixed with `/api/v1`.

### Authentication & User (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Register new user (Artisan / Buyer)
- `POST /api/v1/auth/login` — Authenticate user and issue RS256 access & refresh tokens
- `POST /api/v1/auth/refresh` — Rotate refresh token and obtain a new access token
- `POST /api/v1/auth/logout` — Revoke active refresh token
- `GET /api/v1/auth/me` — Get authenticated user details & active roles

### Onboarding (`/api/v1/onboarding`)
- `POST /api/v1/onboarding/artisan` — Submit artisan profile, craft categorization, and KYC
- `POST /api/v1/onboarding/buyer` — Submit buyer organization profile
- `GET /api/v1/onboarding/status` — Check onboarding completion status

### Product Catalog (`/api/v1/products`)
- `GET /api/v1/products` — List catalog products with pagination & filters
- `GET /api/v1/products/:id` — Get product detail by ID
- `POST /api/v1/products` — Create new artisan product listing
- `PUT /api/v1/products/:id` — Update product listing (creates a new version snapshot)
- `POST /api/v1/products/pipeline` — Trigger AI image enhancement & multilingual description pipeline
- `POST /api/v1/products/pricing-recommendation` — Fetch dynamic market pricing advice

### Inventory Management (`/api/v1/inventory`)
- `GET /api/v1/inventory` — Get artisan inventory batches and stock counts
- `POST /api/v1/inventory/batch` — Add or restock a production batch
- `PATCH /api/v1/inventory/adjust` — Atomic delta adjustment with audit log
- `GET /api/v1/inventory/alerts` — Fetch low-stock & reorder threshold alerts

### Excess Inventory Clearance (`/api/v1/excess-inventory`)
- `GET /api/v1/excess-inventory` — Browse discounted excess inventory deals
- `POST /api/v1/excess-inventory` — Mark inventory batch for clearance

### B2B Procurement & RFQ (`/api/v1/b2b`)
- `POST /api/v1/b2b/rfq` — Buyer creates Request for Quotation
- `GET /api/v1/b2b/rfq/matches` — AI-recommended artisan matches for an RFQ
- `POST /api/v1/b2b/quotes` — Artisan submits quotation with tiered wholesale pricing
- `PATCH /api/v1/b2b/quotes/:id/status` — Accept / reject / counter quote

### Semantic Search (`/api/v1/search`)
- `GET /api/v1/search?q={query}` — Vector similarity search powered by `pgvector` HNSW index

### Craft Atlas (`/api/v1/craft-atlas`)
- `GET /api/v1/craft-atlas/regions` — Fetch all craft clusters by state/region
- `GET /api/v1/craft-atlas/gi-tags` — List GI-tagged heritage craft registries

### Trust Score Engine (`/api/v1/trust-scores`)
- `GET /api/v1/trust-scores/:artisanId` — Get calculated 0–100 score and explainability breakdown

### Reviews & Ratings (`/api/v1/reviews`)
- `POST /api/v1/reviews` — Submit verified purchase rating and feedback
- `GET /api/v1/reviews/artisan/:id` — List reviews for an artisan

### Dispute Resolution (`/api/v1/disputes`)
- `POST /api/v1/disputes` — Raise order dispute with evidence URLs
- `GET /api/v1/disputes/:id` — View dispute timeline and status
- `POST /api/v1/disputes/:id/resolve` — (Admin/Moderator) Record resolution rationale

### Real-time Messaging (`/api/v1/conversations` + WebSocket Gateway)
- `GET /api/v1/conversations` — List user conversations
- `POST /api/v1/conversations` — Initiate chat session
- **WebSocket Gateway (`/messaging`)**:
  - `join_conversation` — Join conversation room
  - `send_message` — Send message with real-time push to recipient
  - `message_status` — Broadcast `DELIVERED` / `READ` receipts

### Admin Panel (`/api/v1/admin`)
- `GET /api/v1/admin/verifications` — Pending artisan verification queue
- `POST /api/v1/admin/verify/:id` — Approve or reject artisan KYC
- `GET /api/v1/admin/logs` — Query administrative audit logs

---

## Security Architecture

1. **RS256 Asymmetric Tokens**: Access tokens signed using RSA private key; validated across microservices with the public key.
2. **Rotating Refresh Tokens**: Refresh tokens stored as SHA-256 hashes in the database and invalidated upon rotation or logout.
3. **Field-Level Encryption**: Sensitive artisan data (PAN, Aadhaar, Bank Details) encrypted via AES-256-GCM before DB persistence.
4. **Helmet & Strict CSP**: Enforces standard browser security headers, preventing XSS and clickjacking.
5. **Rate Limiting**: Throttler module connected to Redis to prevent brute-force attacks on auth and heavy AI endpoints.
6. **Input Validation**: Strict class-validator DTOs with `whitelist: true` and `forbidNonWhitelisted: true`.

---

## Testing & Quality Assurance

The backend includes comprehensive unit tests, integration tests, and **Property-Based Testing (PBT)** using [`fast-check`](https://github.com/dubzzz/fast-check) to verify system invariants.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate code coverage
npm run test:cov
```

### Property-Based Invariant Tests
- **Auth & RBAC**: `auth.property.spec.ts`, `rbac.property.spec.ts`
- **Token Rotation**: `refresh.property.spec.ts`
- **Inventory Concurrency**: `decrement.property.spec.ts`
- **Trust Scoring Boundaries**: `score.property.spec.ts`
- **B2B Matching Logic**: `rfq-matching.property.spec.ts`
- **Product Version Snapshots**: `versioning.property.spec.ts`

---

## Docker & Production Deployment

### Building & Running with Docker

```bash
# Build the Docker image
docker build -t alms-backend .

# Run the container
docker run -p 3001:3001 --env-file .env alms-backend
```

### Production Build

```bash
# Compile TypeScript
npm run build

# Start production server
npm run start:prod
```
