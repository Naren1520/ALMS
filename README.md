# ALMS — Artisan Linkage and Market System

> **Smart India Hackathon 2024 · Problem Statement ID 26090**  
> **Organisation:** Ministry of Social Justice and Empowerment (MoSJE)  
> **Department:** Department of Social Justice and Empowerment  
> **Theme:** Heritage and Culture

A full-stack, production-grade, AI-powered platform that connects India's marginalized artisans (SC/ST/OBC/Divyang craftspeople) with domestic consumers and verified global B2B buyers through voice-driven cataloging, semantic search, dynamic pricing, and zero-friction digital commerce — all at **0% commission**.

---

## The Problem We Solve

India's 7 crore+ artisans are cut off from fair markets by three structural barriers:
1. **Digital illiteracy** — existing platforms require English proficiency and e-commerce knowledge
2. **Middleman exploitation** — aggregators extract 15–40% commission, impoverishing craftspeople
3. **Poor connectivity** — rural internet is unreliable; current tools fail offline

ALMS removes all three barriers simultaneously.

---

## Our Competitive Advantage

| Feature | Etsy / Amazon | GeM / TRIFED | **ALMS** |
|---|---|---|---|
| Onboarding | English forms | Complex compliance | **Voice AI in 10 regional dialects** |
| Commission | 15–40% | 3–10% | **0% (direct artisan revenue)** |
| Pricing | Race to bottom | Static manual | **AI fair-wage guardrail** |
| Connectivity | Online only | Online only | **Offline-first sync queue** |
| Logistics | Urban couriers | Standard postal | **Dak Ghar Niryat Kendra (India Post) integration** |
| Network | Siloed marketplace | Isolated gov catalog | **ONDC seller node auto-syndication** |
| Trust | Reviews only | None | **Explainable 0–100 Trust Score (11 event types)** |

---

## Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP_ScrollTrigger-88CE02?style=flat&logo=greensock&logoColor=black)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=react&logoColor=white)

### Backend
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=flat&logo=typeorm&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io_+_Redis_Adapter-010101?style=flat&logo=socketdotio&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ_8_Queues-FF6384?style=flat&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT_RS256-000000?style=flat&logo=jsonwebtokens&logoColor=white)

### AI Service
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat&logo=python&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_1.5_Pro-4285F4?style=flat&logo=google&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV_+_rembg-5C3EE8?style=flat&logo=opencv&logoColor=white)

### Infrastructure
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16_+_pgvector-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis_7-DC382D?style=flat&logo=redis&logoColor=white)
![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-F38020?style=flat&logo=cloudflare&logoColor=white)
![Docker](https://img.shields.io/badge/Docker_Compose-2496ED?style=flat&logo=docker&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

---

## Core Features

### For Artisans — Zero Friction
- **Voice-to-Catalog** — Speak in Hindi, Bengali, Telugu, Tamil, Gujarati, Kannada, Marathi, Malayalam, Odia, or Punjabi. Gemini 1.5 Pro generates a complete English + Hindi product listing automatically.
- **AI Image Enhancement** — Upload a raw photo. REMBG removes the background, OpenCV corrects lighting and color, Real-ESRGAN upscales to 1200×1200px WebP. Side-by-side comparison with original.
- **AI Pricing Assistant** — Fair-wage floor computed from regional cost index, labor complexity, and median comparable product prices. Non-blocking advisory warnings for below-minimum and above-maximum pricing.
- **Offline-First Sync Queue** — Drafts survive connectivity loss. Auto-replays on reconnect, auto-triggers the AI pipeline with no artisan action needed.
- **Market Discovery** — AI identifies 3+ domestic segments and 2+ international markets per product. GI Tag eligibility badge for qualifying craft categories.

### For B2B Buyers — Verified Procurement
- **RFQ System** — Submit structured bulk procurement requests with quantity, delivery date, and spec notes. AI-matched to 3–20 ranked artisans within 5 minutes.
- **AI Negotiation Assistant** — Artisans receive Gemini-drafted negotiation responses in their language. Always requires explicit artisan approval before sending.
- **Wholesale Price Tiers** — Up to 5 quantity-tiered price brackets per product. Highest applicable tier applied at checkout.
- **Excess Inventory Matching** — Products sitting above 80% capacity for 30+ days are automatically offered to eligible buyers at AI-recommended discounts (15–25% below wholesale).

### For the Platform — Trustworthy Commerce
- **Trust Score Engine** — Explainable 0–100 score from 11 weighted event types (identity verification, on-time fulfilment, reviews, disputes). Admin-configurable multipliers at runtime.
- **Real-Time Messaging** — WebSocket conversations with auto-translation between artisan and buyer languages. Delivery receipts: SENT → DELIVERED → READ.
- **Dispute Resolution** — Structured evidence upload, 2-hour moderator assignment SLA, 14-day escalation to Admin.
- **Semantic Search** — 768-dim embeddings (Google `text-embedding-004`) in pgvector HNSW index. Hybrid re-ranking: FTS × 0.4 + cosine similarity × 0.4 + Trust Score × 0.2. < 500ms for 1M+ products.
- **Craft Atlas** — Interactive SVG map of India. Click a state → see districts → see craft traditions, artisan density, sample products, and cultural descriptions.

### Government Integration
- **ONDC Seller Node** — Artisan catalogs auto-formatted to ONDC retail spec, discoverable on Paytm, PhonePe, and other buyer apps.
- **DigiLocker API** — Validates Aadhaar, SC/ST/OBC caste certificates, and UDID disability cards during artisan verification.
- **Dak Ghar Niryat Kendra** — India Post integration. Auto-generates Postal Bill of Export (PBE) for rural international shipping from any pin code.
- **Escrow Milestone Payments** — Funds locked until India Post DNK delivery verification. Protects artisans from raw-material investment losses.

---

## Architecture Overview

```
                    ┌─────────────────────────────────────────────────┐
                    │               Cloudflare CDN + WAF              │
                    └──────────────┬──────────────────────────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            │                      │                       │
     ┌──────▼──────┐        ┌──────▼──────┐       ┌───────▼──────┐
     │  Next.js 14  │        │  NestJS API  │       │  FastAPI AI  │
     │  App Router  │◄──────►│  (17 modules)│◄─────►│  (8 pipelines│
     │  Port 3000   │  REST+ │  Port 3001   │  HTTP │  Port 8000   │
     └─────────────┘  WS    └──────┬───────┘  jobs └──────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
       ┌──────▼──────┐    ┌────────▼──────┐    ┌────────▼──────┐
       │PostgreSQL 16 │    │   Redis 7     │    │Cloudflare R2  │
       │ + pgvector   │    │ BullMQ/Cache  │    │Object Storage │
       │ 36+ tables   │    │ 8 queues      │    │Images + Docs  │
       └─────────────┘    └───────────────┘    └───────────────┘
```

**17 NestJS modules:** Auth · Onboarding · Product · Inventory · B2B · Messaging · Trust · Review · Dispute · Atlas · Notifications · Admin · Search · ExcessInventory · Moderation · Delivery · MarketDiscovery

**8 BullMQ queues:** PRODUCT_CATALOG_GENERATION · IMAGE_ENHANCEMENT · EMBEDDING_UPDATE · PRICING · SEO_GENERATION · MARKET_DISCOVERY · TRANSLATION · MODERATION

**8 FastAPI AI pipelines:** Image Pipeline · Catalog Engine · Pricing Engine · SEO Engine · Embedding Service · Translation Service · Moderation Pipeline · Health

---

## Security Model

| Layer | Implementation |
|---|---|
| Authentication | RS256 JWT (15-min) + rotating refresh tokens (7-day, SHA-256 hashed) |
| Password storage | Argon2id adaptive hash |
| PII encryption | AES-256-GCM field-level (names, GST, addresses, bank accounts) |
| CSRF | Synchronizer Token Pattern, rotated every request |
| Rate limiting | 100 req/min/IP (unauth) · 500 req/min/user (auth) via Redis |
| Storage | All R2 objects private; signed URLs only (60-min verification, 24-hr media) |
| Headers | Helmet: CSP, HSTS, X-Frame-Options |
| Input | `class-validator` + `sanitize-html` server-side; TypeORM parameterized queries |
| Audit trail | Append-only `audit_logs` table; no UPDATE/DELETE rights granted |
| Row-level security | Supabase RLS policies on all tables |

---

## Database Schema (7 Migrations, 36+ Tables)

| Migration | Content |
|---|---|
| 000001 | Extensions: pgvector, pg_trgm, uuid-ossp |
| 000002 | 19 PostgreSQL enum types |
| 000003 | 31 core tables with all constraints and indexes |
| 000004 | Row-level security policies (Supabase) |
| 000005 | Supporting indexes (HNSW, GIN, B-tree) |
| 000006 | Trust event weight seeds (11 event types) |
| 000007 | GI tags, transit matrix, regional cost index, additional tables |

Key: pgvector HNSW index (`m=16, ef_construction=64`) on 768-dim product embeddings for sub-50ms ANN search at 1M+ scale.

---

## Repository Structure

```
ALMS/
├── frontend/                    # Next.js 14 App Router
│   └── src/
│       ├── app/                 # Pages: /, /artisan, /craft-atlas, /(auth)
│       ├── components/          # homepage/, layout/, providers/
│       ├── hooks/               # useReducedMotion, etc.
│       └── lib/                 # API client, WebSocket, Sync Queue
├── backend/                     # NestJS API (TypeScript)
│   └── src/
│       ├── modules/             # 17 feature modules
│       ├── common/              # Guards, filters, decorators, services
│       └── config/              # Env validation, config factories
├── ai_service/                  # FastAPI (Python 3.11)
│   ├── routers/                 # 8 pipeline routers
│   └── models/                  # Pydantic models
├── supabase/
│   └── migrations/              # 7 ordered SQL migration files
├── docker-compose.yml           # Full local stack
├── docs.md                      # Complete architecture docs + Mermaid diagrams
└── README.md                    # This file
```

---

## Local Development

### Prerequisites
- Node.js 20+, Python 3.11+, Docker & Docker Compose

### Quickstart (Docker — recommended)

```bash
# Clone and enter the project
git clone <repo-url> && cd ALMS

# Copy and configure secrets
cp backend/.env.example backend/.env
cp ai_service/.env.example ai_service/.env

# Generate RSA key pair for JWT
openssl genrsa -out backend/jwt_private.pem 2048
openssl rsa -in backend/jwt_private.pem -pubout -out backend/jwt_public.pem

# Generate AES-256 encryption key
openssl rand -hex 32  # → paste as ENCRYPTION_KEY in backend/.env

# Start all services
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api/v1 |
| Swagger UI | http://localhost:3001/api |
| AI Service | http://localhost:8000 |
| AI Docs | http://localhost:8000/docs |

### Manual Setup

```bash
# Backend
cd backend && npm install && npm run start:dev

# AI Service
cd ai_service && pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_HOST` | PostgreSQL host |
| `DATABASE_PASSWORD` | PostgreSQL password |
| `REDIS_HOST` | Redis host |
| `JWT_PRIVATE_KEY` | RS256 private key (PEM, `\n`-escaped) |
| `JWT_PUBLIC_KEY` | RS256 public key (PEM, `\n`-escaped) |
| `ENCRYPTION_KEY` | 64 hex chars (32 bytes) for AES-256-GCM |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `AI_SERVICE_URL` | Internal URL of FastAPI service |
| `AI_SERVICE_TOKEN` | Shared service-to-service token |
| `FRONTEND_URL` | Allowed CORS origin |

### AI Service (`ai_service/.env`)

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis URL |
| `R2_*` | Same R2 credentials as backend |

---

## Deployment

The project is configured as a Vercel monorepo with two services. Root `vercel.json` routes `/api/v1/*` to NestJS and everything else to Next.js.

The FastAPI AI service is deployed separately (Cloud Run / Fly.io). Set `AI_SERVICE_URL` in the Vercel backend environment to point to it.

```
Vercel project → Framework: Services
  ├── backend  →  NestJS (Node.js runtime)
  └── frontend →  Next.js (Edge runtime)
```

---

## Implementation Plan (35 Tasks)

The project follows a structured 35-task implementation plan, organized in dependency waves:

1. **Wave 0–1:** Database schema, enums, NestJS scaffold, CSRF + rate limiting
2. **Wave 2–5:** Auth (JWT, RBAC, refresh tokens, audit logging)
3. **Wave 5–8:** Onboarding verification flows, AI service scaffold, image pipeline
4. **Wave 8–12:** Catalog generation, pricing engine, SEO engine, product lifecycle
5. **Wave 12–15:** Inventory management, excess inventory engine, B2B RFQ + quoting
6. **Wave 16–21:** Messaging, negotiation assistant, trust score system, reviews, disputes
7. **Wave 17–22:** Semantic search, market discovery, GI tags, notifications
8. **Wave 22–26:** Production scheduling, Craft Atlas, offline sync queue, queue observability
9. **Wave 26–31:** Admin dashboard, moderation, i18n/a11y, security hardening
10. **Wave 31–32:** Homepage GSAP animations, Lighthouse optimization

**23 property-based tests** (fast-check + Hypothesis) validate critical invariants: inventory atomicity, token single-use, search ranking correctness, trust score computation, CSRF universality, and more.

See `docs.md` for the complete architecture documentation, Mermaid diagrams, and the Mermaid prompt to generate the full system flow diagram.

---

## Impact

- **Economic**: Eliminates 40% middleman commission — every rupee goes directly to the artisan
- **Scale**: Zero-cost infrastructure supports first 10,000 artisans on free tiers (Supabase, Vercel, R2)
- **Reach**: ONDC syndication makes every listing visible across Paytm, PhonePe, and 50+ buyer apps
- **Trust**: DigiLocker integration ensures benefits reach genuine SC/ST/OBC/Divyang artisans
- **Pilot**: Targeting Dakshina Kannada district — 500 artisans, 50 CSC VLEs, 90-day success metrics

---

## License

Unlicensed — built for Smart India Hackathon 2024, Problem Statement 26090, Ministry of Social Justice and Empowerment.
