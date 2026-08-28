# ALMS — Artisan Linkage and Market System

**Problem Statement ID:** 26090  
**Organisation:** Ministry of Social Justice and Empowerment (MoSJE)  
**Department:** Department of Social Justice and Empowerment  
**Theme:** Heritage and Culture

A full-stack platform that connects India's marginalized artisans with domestic consumers and global B2B buyers through AI-powered cataloging, semantic search, dynamic pricing, and zero-friction digital commerce.
---

## Impact & Economic Value

ALMS eliminates the typical 40% middleman commission, placing revenue directly into the hands of marginalized craftspeople. The system addresses three primary government priorities:
1. **Targeted Upliftment:** Verification ensures MoSJE benefits reach genuine SC/ST/OBC and Divyang artisans.
2. **Infinite Market Access:** Product listings syndicate automatically across the **ONDC (Open Network for Digital Commerce)** ecosystem.
3. **Deep Rural Logistics:** Integration with **Dak Ghar Niryat Kendra (India Post)** allows seamless shipping from any local post office pin code.

## Competitive Edge

| Feature | Legacy E-Commerce (Etsy/Amazon) | Govt Portals (GeM/TRIFED) | ALMS (Our Solution) |
| :--- | :--- | :--- | :--- |
| **Onboarding Barrier** | High (Text/English forms) | Medium (Complex compliance) | **Zero-Literacy (Voice AI in Regional Dialects)** |
| **Middleman Take** | 15% – 40% Commission | 3% – 10% Platform fees | **0% Commission (Direct Artisan Revenue)** |
| **Pricing Safeguard** | None (Buyer-driven race to bottom) | Static manual pricing | **AI Artisan Protection Floor (Fair-Wage Guardrail)** |
| **Logistics Reach** | Urban courier dependency | Standard postal | **Native India Post (DNK) Pin-Code Integration** |
| **Syndication** | Siloed marketplace | Isolated govt catalog | **Automated ONDC Seller Node Broadcasting** |

---

##  User Personas & Workflows

1. **The Artisan (Primary Beneficiary):** Interacts via a mobile-optimized PWA. Uses voice notes in regional languages to auto-generate catalogs, review dynamic pricing suggestions, and manage orders offline.
2. **The Village Level Entrepreneur (VLE):** CSC operators who onboard elderly or digitally illiterate artisans, managing bulk media uploads and GI-tag documentation for a small transaction fee.
3. **The Global B2B Buyer:** Uses the web portal to issue bulk RFQs, browse the Craft Atlas, and make milestone payments protected by escrow.
4. **MoSJE Administrator:** Monitors verified onboarding rates, tracks economic growth metrics across regions, and moderates platform disputes.

---



## Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=black)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=react&logoColor=white)

### Backend
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=flat&logo=typeorm&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socketdotio&logoColor=white)
![Bull](https://img.shields.io/badge/Bull_Queue-FF6384?style=flat&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT_RS256-000000?style=flat&logo=jsonwebtokens&logoColor=white)

### AI Service
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat&logo=python&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_1.5_Pro-4285F4?style=flat&logo=google&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=flat&logo=opencv&logoColor=white)

### Infrastructure
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?style=flat&logo=postgresql&logoColor=white)
![pgvector](https://img.shields.io/badge/pgvector-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis_7-DC382D?style=flat&logo=redis&logoColor=white)
![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-F38020?style=flat&logo=cloudflare&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel Edge                          │
│  /api/v1/*  ──────────────────────────────►  NestJS Service │
│  /*         ──────────────────────────────►  Next.js Service│
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         PostgreSQL 16     Redis 7      Cloudflare R2
          + pgvector     (Queue/Cache)  (Media Storage)
                              │
                              ▼
                      FastAPI AI Service
                   (Gemini · rembg · OpenCV)
```

---

## Features

### Artisan Tools
- **AI Image Pipeline** — background removal (rembg), lighting correction, and upscaling via OpenCV; original and enhanced images stored separately in R2
- **Multilingual Auto-Cataloger** — voice or text input in regional languages; Gemini 1.5 Pro generates SEO-ready English and Hindi product descriptions
- **Dynamic Pricing Assistant** — market-trend analysis using category demand signals and a regional cost index to suggest optimal retail and wholesale prices
- **Inventory Management** — full batch history with delta tracking, low-stock alerts, and lead-time scheduling

### Discovery and Commerce
- **ONDC Seller Node Integration** — Artisan catalogs are automatically formatted to ONDC retail specifications, making their inventory instantly discoverable across buyer apps like Paytm and PhonePe.
- **Semantic Search** — 768-dimensional text embeddings (Google `text-embedding-004`) stored with pgvector HNSW index for sub-100ms approximate nearest-neighbour search
- **Craft Atlas** — region-level map of craft traditions with GI tag registry (11 seeded crafts) and artisan density stats
- **B2B RFQ System** — buyers submit structured requests; AI scores and matches artisans by capacity, trust score, and craft alignment; multi-round quoting with wholesale tiers
- **Escrow Milestone Payments** — To protect artisans from buyer default, funds are locked in a smart escrow node and released upon India Post (DNK) delivery verification, preventing raw-material investment losses.

### Platform
- **Government API Verification** — Direct integration with DigiLocker API to instantly validate Aadhaar, SC/ST/OBC Caste Certificates, and UDID (Disability) cards to ensure platform integrity.
- **Dak Ghar Niryat Kendra Logistics** — India Post API integration allows artisans to auto-generate the Postal Bill of Export (PBE) for seamless international B2B shipping from any rural pin code.
- **Trust Score Engine** — 0–100 explainable score built from 11 weighted event types (identity verification, on-time fulfilment, reviews, dispute outcomes); weights are admin-configurable at runtime
- **Real-time Messaging** — WebSocket conversations between artisans and buyers with auto-translation and content moderation flags
- **Dispute Resolution & Admin** — structured evidence upload, user verification queue, and platform audit logs

### Security
- RS256 JWT access tokens (15-minute TTL) with rotating refresh tokens (SHA-256 hashed in DB)
- AES-256-GCM field-level encryption for PII (names, GST numbers, addresses)
- Row-level security policies on all Supabase tables
- CSRF protection, Helmet security headers, and global rate limiting via `@nestjs/throttler`
- Argon2 password hashing

## Infrastructure Economics & Scalability
ALMS is designed for extreme cost-efficiency to ensure sustainability for MoSJE:
* **Zero-Cost Pilot Infrastructure:** Utilizing Vercel Edge functions, Cloudflare R2 (zero egress fees), and Supabase free tiers allows the platform to support the first 10,000 artisans at near-zero hosting cost.
* **Open-Source AI:** Instead of relying entirely on expensive proprietary APIs, the pipeline leverages open-source models (`rembg`, OpenCV, IndicBERT) hosted on our FastAPI microservice.
* **Revenue Model for CSCs:** The VLE Mode introduces a micro-commission model (1-2% per bulk B2B order), incentivizing local tech-savvy youth to sustain the onboarding process without requiring direct government salaries.

  ## Phase 1: Pilot Deployment 
Before a national rollout, ALMS is structured for a controlled pilot deployment targeting the Dakshina Kannada district. 
* **Target Audience:** Partnering with local NGOs to onboard 500 regional artisans specializing in local crafts (e.g., Udupi handlooms, local woodwork).
* **VLE Activation:** Training 50 Common Service Centre (CSC) operators in the district to use the VLE Onboarding Mode.
* **Success Metrics:** Measuring the reduction in cataloging time (from hours to minutes) and the percentage increase in direct B2B inquiries over 90 days.

  ## Phase 2: Future Scope & Global Scale
- **Blockchain Provenance:** Implementing a lightweight immutable ledger to track the exact origin of GI-tagged products from raw material to final buyer, eliminating counterfeit claims.
- **Bhashini Voice-to-Voice AI:** Upgrading the real-time websocket chat so a buyer can speak in French and the artisan hears the translation in Kannada instantly.
- **Automated Customs Integration:** Expanding the DNK integration to auto-generate international commercial invoices based on HS Codes.

---

## Repository Structure

```
ALMS/
├── frontend/          # Next.js 14 App Router
│   ├── src/app/       # Pages and layouts
│   ├── src/components/# UI components (homepage, auth, artisan)
│   └── src/hooks/     # useReducedMotion, etc.
├── backend/           # NestJS API
│   └── src/
│       ├── modules/   # Feature modules (auth, products, orders, ...)
│       ├── common/    # Guards, filters, decorators, services
│       └── config/    # Env validation and config factories
├── ai_service/        # FastAPI
│   └── routers/       # catalog, pricing, seo, embedding, image_pipeline,
│                      # translation, moderation, health
├── supabase/
│   └── migrations/    # 7 ordered SQL migrations (extensions → seed data)
├── docker-compose.yml # Full local stack
└── vercel.json        # Monorepo services config
```

---

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker and Docker Compose

### Using Docker (recommended)

```bash
# Copy and fill in secrets
cp backend/.env.example backend/.env

# Start all services (PostgreSQL, Redis, backend, AI service, frontend)
docker compose up --build
```

| Service     | URL                          |
|-------------|------------------------------|
| Frontend    | http://localhost:3000        |
| Backend API | http://localhost:3001/api/v1 |
| AI Service  | http://localhost:8000        |
| Swagger     | http://localhost:3001/api    |

### Manual Setup

**Backend**
```bash
cd backend
cp .env.example .env          # fill in DATABASE_HOST, JWT keys, etc.
npm install
npm run start:dev
```

**AI Service**
```bash
cd ai_service
cp .env.example .env          # fill in GEMINI_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

### Generate JWT Key Pair

```bash
openssl genrsa -out backend/jwt_private.pem 2048
openssl rsa -in backend/jwt_private.pem -pubout -out backend/jwt_public.pem
```

Set the contents (with `\n` line endings) as `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` in `backend/.env`.

### Generate Encryption Key

```bash
openssl rand -hex 32
```

Paste the output as `ENCRYPTION_KEY` in `backend/.env`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_HOST` | PostgreSQL host (Supabase or local) |
| `DATABASE_PASSWORD` | PostgreSQL password |
| `REDIS_HOST` | Redis host |
| `JWT_PRIVATE_KEY` | RS256 private key (PEM, `\n`-escaped) |
| `JWT_PUBLIC_KEY` | RS256 public key (PEM, `\n`-escaped) |
| `ENCRYPTION_KEY` | 64 hex chars (32 bytes) for AES-256-GCM |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `AI_SERVICE_URL` | Internal URL of the FastAPI service |
| `GEMINI_API_KEY` | Google Gemini API key |
| `FRONTEND_URL` | Allowed CORS origin |

See `backend/.env.example` for the full list.

### AI Service (`ai_service/.env`)

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `R2_*` | Same R2 credentials as backend |

---

## Deployment

The project deploys as a Vercel monorepo using the Services feature. The root `vercel.json` defines two services and routes all `/api/v1/*` traffic to the NestJS backend and everything else to the Next.js frontend.

```
Vercel project → Framework: Services
```

Set all backend environment variables in the Vercel dashboard under the `backend` service environment.

The FastAPI AI service is not deployed to Vercel — host it separately (Cloud Run, Fly.io, or any container platform) and set `AI_SERVICE_URL` in the backend service environment.

---

## Database Migrations

Migrations run automatically when using Docker Compose (mounted into `docker-entrypoint-initdb.d`). For Supabase, apply them in order via the Supabase SQL editor or CLI:

```bash
supabase db push
```

Migration order:

| File | Description |
|------|-------------|
| `000001` | Extensions (pgvector, pg_trgm, uuid-ossp) |
| `000002` | Enums |
| `000003` | Core tables (31 tables) |
| `000004` | Row-level security policies |
| `000005` | Supporting indexes |
| `000006` | Trust event weight seeds |
| `000007` | Additional tables and seed data (GI tags, transit matrix, regional cost index) |

---

## License

Unlicensed — built for SIH 2024, Problem Statement 26090.
