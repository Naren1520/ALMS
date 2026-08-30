# ALMS — Artisan Linkage and Market System

> **Smart India Hackathon 2026 · Problem Statement ID 26090**  
> **Ministry of Social Justice and Empowerment (MoSJE)** · Department of Social Justice and Empowerment  
> **Theme:** Heritage and Culture · **Commission Model:** 0% Direct-to-Artisan Revenue

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_14_App_Router-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS_v10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![FastAPI](https://img.shields.io/badge/AI_Service-FastAPI_Python_3.11+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16_+_pgvector-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Queue_&_Cache-Redis_7_+_BullMQ-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Cloudflare R2](https://img.shields.io/badge/Storage-Cloudflare_R2-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://www.cloudflare.com/products/r2/)

---

## 🏛️ Executive Summary & The Problem We Solve

India is home to over **7 crore (70 million) traditional artisans and craftspeople**, predominantly from Scheduled Castes (SC), Scheduled Tribes (ST), Other Backward Classes (OBC), and Divyangjan (differently-abled) communities. Despite producing world-renowned GI-tagged crafts, rural producers remain trapped in poverty due to three compounding systemic failures:

1. **Digital & Language Illiteracy** — E-commerce platforms demand English proficiency, complex seller catalogs, and SKU taxonomy management.
2. **Aggregator Exploitation** — Middlemen and private marketplaces extract **15% to 40% commissions**, capturing the majority of consumer value.
3. **Connectivity Fragility** — Rural production hubs have intermittent 2G/3G mobile data, causing upload failures and data loss on conventional platforms.

**ALMS (Artisan Linkage and Market System)** solves all three challenges simultaneously by offering a **zero-literacy, voice-first, AI-driven, offline-resilient digital commerce operating system with 0% platform commission.**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ALMS CORE VALUE PROPOSITIONS                       │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│ 🎙️ Voice-to-Catalog  │ 🎨 AI Image Studio   │ ⚖️ Fair-Wage Cost Floor      │
│ Native speech to     │ Raw photo to studio  │ Dynamic algorithmic           │
│ bilingual catalog    │ 1200x1200px WebP     │ anti-exploitation pricing     │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ 🌐 ONDC Auto-Node    │ 🏢 B2B RFQ Matching  │ 📦 India Post DNK             │
│ Direct syndication   │ Multi-cluster batch  │ Rural export customs & PBE    │
│ to 50+ buyer apps    │ capacity allocation  │ tracking from any pin code    │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ 🛡️ Trust Score Engine│ 🗺️ Craft Atlas Map   │ 📴 Offline-First Sync Queue   │
│ Explainable 0-100    │ Interactive regional │ IndexedDB auto-replay         │
│ multi-factor rating  │ GI & craft directory │ on internet reconnect         │
└──────────────────────┴──────────────────────┴───────────────────────────────┘
```

---

## 🏗️ System Architecture

ALMS is engineered as a decoupled, resilient microservices architecture comprising three primary tiers:

```
                               ┌────────────────────────────────────────────────────────┐
                               │                 Cloudflare CDN + Edge WAF              │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
                               ┌───────────────────────────┼────────────────────────────┐
                               │                           │                            │
                     ┌─────────▼─────────┐       ┌─────────▼─────────┐        ┌─────────▼─────────┐
                     │   Next.js 14 Web  │       │  NestJS Backend   │        │ FastAPI AI Engine │
                     │  (App Router UI)  │◄─────►│    API Gateway    │◄──────►│  Microservice     │
                     │    Port: 3000     │REST/WS│    Port: 8080     │ HTTP   │    Port: 8000     │
                     └───────────────────┘       └─────────┬─────────┘ jobs   └───────────────────┘
                                                           │
                               ┌───────────────────────────┼────────────────────────────┐
                               │                           │                            │
                     ┌─────────▼─────────┐       ┌─────────▼─────────┐        ┌─────────▼─────────┐
                     │  PostgreSQL 16 +  │       │   Redis 7 Cache   │        │   Cloudflare R2   │
                     │     pgvector      │       │    + 8 BullMQ     │        │  S3 Object Store  │
                     │ (36+ RLS Tables)  │       │      Queues       │        │  (Media & Docs)   │
                     └───────────────────┘       └───────────────────┘        └───────────────────┘
                                                           │
                               ┌───────────────────────────▼────────────────────────────┐
                               │        National Infrastructure & Governance APIs       │
                               │        • ONDC Network (Beckn Protocol v1.1)            │
                               │        • DigiLocker (Aadhaar, Caste, UDID)             │
                               │        • Dak Ghar Niryat Kendra (India Post PBE)       │
                               └───────────────────────────┘────────────────────────────┘
```

### Microservice Components:

1. **Frontend (`/frontend`)**: Next.js 14 with App Router, React 18, Tailwind CSS, GSAP ScrollTrigger, Lucide Icons, and Offline Sync Queue.
2. **Backend (`/backend`)**: NestJS v10 modular monolith in TypeScript, TypeORM, BullMQ distributed queue workers, JWT RS256 authentication, AES-256-GCM encryption, and WebSocket real-time messaging on **Port 8080**.
3. **AI Service (`/ai_service`)**: High-performance FastAPI microservice running Python 3.11+, Google Gemini 1.5 Pro multimodal LLM, Pillow, and OpenCV computer vision pipelines on **Port 8000**.

---

## ⚡ Core Feature Matrix

### 1. For Artisans (Zero Digital Literacy Required)
- **Multilingual Voice-to-Catalog Engine**: Artisans speak naturally in Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Odia, or Punjabi. The pipeline automatically transcribes audio, extracts technical metadata (materials, craft technique, care instructions), generates bilingual English & Hindi descriptions, and outputs ONDC-compliant taxonomy.
- **Computer Vision Image Enhancement**: Eliminates cluttered backgrounds from rural workshops, performs intelligent lighting & white balance correction, sharpens fine craft textures, and frames products onto clean 1200×1200 WebP assets.
- **Fair-Wage Cost Floor Pricing Assistant**: Computes an uncompromised price floor based on raw material costs, skilled labor hours, local minimum wages, and regional cost indices, protecting artisans from predatory buyer undercutting.
- **Offline-First Sync Queue**: Artisan actions and drafts are preserved locally when mobile signal drops and automatically synced to the server once reconnected.
- **Craft GI-Tag Registry**: Automated geographical indication lookup to badge and verify authentic regional crafts.

### 2. For B2B Buyers & Institutions
- **Multi-Cluster RFQ Allocation**: Allows corporate buyers, hotels, and export houses to place bulk orders that are algorithmically split across multiple artisan self-help groups (SHGs) to guarantee timely fulfillment without overloading single clusters.
- **AI Negotiation Assistant**: Provides artisans with translated, context-aware negotiation proposals to bridge language gaps with global enterprise buyers.
- **Tiered Wholesale Pricing & Excess Inventory Clearing**: Automatically surfaces surplus stock at volume discounts without cannibalizing retail prices.

### 3. For Platform & Governance (MoSJE / Government of India)
- **Explainable 0–100 Trust Score**: Real-time reliability rating calculated from 11 weighted event types (DigiLocker verification, on-time delivery rate, dispute resolution ratio, buyer reviews).
- **Interactive National Craft Atlas**: Interactive vector map visualizing artisan density, craft varieties, GI tags, and socio-economic indicators across every Indian state.
- **Government Escrow & India Post Integration**: Funds are safely held in milestone escrow until Dak Ghar Niryat Kendra (DNK) postal verification confirms parcel handover.

---

## 📁 Repository Structure

```
d:/ALMS/
├── frontend/                        # Next.js 14 App Router Frontend
│   ├── src/
│   │   ├── app/                     # Route pages (Home, Studio, RFQ, Atlas, Explore, Docs, Auth)
│   │   │   ├── artisan/create-product/ # Zero-literacy AI cataloging studio
│   │   │   ├── artisans/            # Master artisan directory & profiles
│   │   │   ├── b2b/rfq/             # Bulk RFQ matching & capacity allocator
│   │   │   ├── craft-atlas/         # Interactive SVG India craft map
│   │   │   ├── explore/             # Semantic marketplace catalog
│   │   │   ├── impact/              # MoSJE livelihood analytics dashboard
│   │   │   ├── docs/                # Interactive architecture documentation
│   │   │   └── (auth)/              # Login & Multi-step registration
│   │   ├── components/              # Reusable UI & Homepage components
│   │   ├── lib/                     # Sync queue & state utilities
│   │   └── utils/                   # Supabase clients & middleware
│   ├── next.config.js               # API rewrites & CSP configuration
│   └── package.json
├── backend/                         # NestJS API Monolith
│   ├── src/
│   │   ├── modules/                 # 17 domain feature modules
│   │   │   ├── auth/                # JWT RS256 auth & RBAC
│   │   │   ├── product/             # Product lifecycle & BullMQ processor
│   │   │   ├── b2b/                 # RFQ matching & capacity engine
│   │   │   ├── trust/               # 0-100 Trust score calculator
│   │   │   ├── search/              # pgvector hybrid semantic search
│   │   │   ├── messaging/           # WebSocket conversations & translation
│   │   │   ├── dispute/             # Dispute resolution workflow
│   │   │   ├── moderation/          # AI & manual content moderation
│   │   │   └── atlas/               # GI tags & geographic craft clusters
│   │   ├── common/                  # Services, guards, filters, decorators
│   │   │   └── services/            # AI service client, R2 storage, AES-256 encryption
│   │   ├── config/                  # Environment validation & configs
│   │   └── main.ts                  # NestJS bootstrap
│   └── package.json
├── ai_service/                      # FastAPI AI & Computer Vision Microservice
│   ├── routers/                     # 8 Microservice Pipeline Routers
│   │   ├── image_pipeline.py        # Image background extraction & enhancement
│   │   ├── catalog.py               # Multilingual voice/text catalog generation
│   │   ├── pricing.py               # Fair-wage price floor recommendations
│   │   ├── seo.py                   # Meta tags & Schema.org JSON-LD generator
│   │   ├── embedding.py             # 768-dim semantic embeddings
│   │   ├── translation.py           # Multilingual translation router
│   │   ├── moderation.py            # AI content moderation & compliance
│   │   └── health.py                # Service health & readiness
│   ├── models/                      # Pydantic v2 schemas & validators
│   ├── tests/                       # Pytest & Hypothesis property test suites
│   ├── main.py                      # FastAPI application entrypoint
│   └── requirements.txt
├── supabase/                        # Database migrations & schemas
│   └── migrations/                  # 7 ordered SQL migration scripts
├── docker-compose.yml               # Complete multi-container local stack
├── docs.md                          # Full system specifications & Mermaid charts
└── README.md                        # Master repository documentation
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: v20.x or later
- **Python**: v3.11 or later
- **Docker & Docker Compose** (Optional for containerized run)
- **Git**

---

### Option 1: Running Concurrently (Recommended for Local Dev)

#### 1. Setup AI Microservice (FastAPI)
```bash
# Enter AI directory
cd ai_service

# Install dependencies (or use uv / pip)
pip install -r requirements.txt

# Run the FastAPI server (Port 8000)
uvicorn main:app --reload --port 8000
```
> Verify: Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser for Swagger UI.

---

#### 2. Setup Backend Service (NestJS)
```bash
# In a new terminal window:
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Build TypeScript
npm run build

# Start dev server (Port 8080)
npm run start:dev
```
> Verify: Open [http://localhost:8080/api/v1/products](http://localhost:8080/api/v1/products) or check logs.

---

#### 3. Setup Frontend Web App (Next.js)
```bash
# In a new terminal window:
cd frontend

# Install dependencies
npm install

# Start Next.js development server (Port 3000)
npm run dev
```
> Verify: Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option 2: Running via Docker Compose

```bash
# From project root:
docker compose up --build
```

| Service | Local URL | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:3000` | Next.js 14 Responsive UI & AI Studio |
| **Backend API Gateway** | `http://localhost:3001/api/v1` | NestJS REST API & WebSocket Server |
| **FastAPI AI Engine** | `http://localhost:8000` | AI Enhancement & Catalog Service |
| **FastAPI Interactive Docs** | `http://localhost:8000/docs` | OpenAPI / Swagger Documentation |

---

## 🔑 Environment Configuration

### Backend (`backend/.env`)
| Key | Default / Sample | Purpose |
|---|---|---|
| `PORT` | `3001` | HTTP Port for NestJS API |
| `FRONTEND_URL` | `http://localhost:3000` | CORS Origin |
| `DATABASE_HOST` | `localhost` / Supabase Host | PostgreSQL 16 DB Host |
| `DATABASE_PORT` | `5432` | DB Port |
| `DATABASE_NAME` | `postgres` | DB Name |
| `DATABASE_USER` | `postgres` | DB User |
| `DATABASE_PASSWORD` | `your-password` | DB Password |
| `REDIS_HOST` | `localhost` | Redis instance for BullMQ queues |
| `REDIS_PORT` | `6379` | Redis port |
| `AI_SERVICE_URL` | `http://localhost:8000` | FastAPI microservice URL |
| `AI_SERVICE_TOKEN` | `dev-token` | Service-to-service auth token |
| `ENCRYPTION_KEY` | `64-hex-characters` | AES-256-GCM PII field encryption key |
| `JWT_PRIVATE_KEY` | `-----BEGIN RSA PRIVATE KEY-----...` | RS256 private key for JWT |
| `JWT_PUBLIC_KEY` | `-----BEGIN PUBLIC KEY-----...` | RS256 public key for JWT |

### AI Microservice (`ai_service/.env`)
| Key | Default / Sample | Purpose |
|---|---|---|
| `AI_SERVICE_TOKEN` | `dev-token` | Shared service verification token |
| `GEMINI_API_KEY` | `your-gemini-api-key` | Google Gemini 1.5 Pro API Key |
| `BACKEND_URL` | `http://localhost:3001` | Callback URL to NestJS |

### Frontend (`frontend/.env.local`)
| Key | Default / Sample | Purpose |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:3001` | Backend API URL for Next.js rewrites |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-supabase.co` | Supabase project endpoint |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | Supabase public key |

---

## 🧪 Testing & Verification Suite

ALMS enforces strict correctness invariants across its microservices using property-based testing and end-to-end unit test suites.

```
═══════════════════════════════════════════════════════════════════════════
                      ALMS AUTOMATED TEST COVERAGE
═══════════════════════════════════════════════════════════════════════════
 ✅ Backend Test Suites (Jest + fast-check)    : 16 Suites, 69 Tests (100% Pass)
 ✅ AI Service Test Suites (Pytest+Hypothesis) : 10 Tests (100% Pass)
 ✅ Next.js Frontend Compilation               : 16 Routes (100% Pass)
 ✅ TypeScript Strict Typecheck                : 0 Errors
═══════════════════════════════════════════════════════════════════════════
```

### 1. Run Backend Property Invariant Tests
```bash
cd backend
npm run test
```
*Validates:*
- **Property 1–4**: Registration state invariants, RBAC denial universality, Password complexity, Refresh token single-use.
- **Property 5–6**: 3-second BullMQ AI job enqueuing, R2 original asset preservation on failure.
- **Property 8–9**: Search ranking ordering invariant, zero-search fallback invariant.
- **Property 10–13**: Active order deletion guards, Pre-update snapshot history, Inventory atomic decrement.
- **Property 14–17**: RFQ match scoring invariant, Message delivery state progression, 0–100 Trust score clamping, Review submission gates.
- **Property 18–22**: Dispute eligibility windows, GI tag membership, CSRF protection universality, Rate limit enforcement, Security audit trails.

### 2. Run AI Microservice Test Suite
```bash
# From workspace root
pytest ai_service/tests -v
```
*Validates:*
- **Property 7**: Catalog Engine JSON Round-Trip Fidelity (Hypothesis).
- **Pipelines**: Health, Image enhancement, Catalog generation, Fair-wage pricing, SEO generator, Embedding generation, Content moderation, Multilingual translation.

### 3. Verify Production Builds
```bash
# Backend build
cd backend && npm run build

# Frontend build
cd frontend && npm run build
```

---

## 📡 API Reference

### Backend Endpoints (`/api/v1`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register artisan, buyer, or moderator | No |
| `POST` | `/api/v1/auth/login` | Authenticate and obtain JWT RS256 token | No |
| `POST` | `/api/v1/auth/refresh` | Rotate single-use refresh token | Yes |
| `POST` | `/api/v1/products` | Create draft listing & enqueue AI pipeline | Artisan |
| `POST` | `/api/v1/products/preview-ai` | Instant live AI catalog, pricing & SEO preview | No |
| `GET` | `/api/v1/products/:id` | Fetch product by ID | No |
| `PUT` | `/api/v1/products/:id` | Update product (creates version snapshot) | Artisan |
| `PATCH` | `/api/v1/products/:id/status` | Transition product lifecycle status | Artisan |
| `GET` | `/api/v1/products/:id/images/compare`| Get original vs enhanced image signed URLs | Artisan |
| `POST` | `/api/v1/b2b/rfqs` | Submit enterprise RFQ request | Buyer |
| `GET` | `/api/v1/b2b/rfqs/:id/matches` | Retrieve AI-ranked artisan cluster allocations | Buyer |
| `GET` | `/api/v1/trust/scores/:artisanId` | Get breakdown of 0-100 Trust Score | Any |
| `POST` | `/api/v1/search` | pgvector hybrid search (FTS + Cosine + Trust) | No |

### AI Microservice Endpoints (`/pipeline`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health status |
| `POST` | `/pipeline/image/enhance` | Background removal, color balance & 1200x1200 WebP |
| `POST` | `/pipeline/catalog/generate` | Multilingual catalog from voice / text note |
| `POST` | `/pipeline/pricing/recommend` | Fair-wage price floor & wholesale tiers |
| `POST` | `/pipeline/seo/generate` | Metadata, slug & Schema.org JSON-LD |
| `POST` | `/pipeline/embedding/generate` | 768-dim vector embedding generation |
| `POST` | `/pipeline/translation/translate`| Text translation across 10 Indian languages |
| `POST` | `/pipeline/moderation/check` | Content safety classification |

---

## 🎯 Socio-Economic Impact

- **100% Direct Livelihood Retention**: By eliminating the 15–40% broker margin, artisans increase take-home income by **up to 65%**.
- **ONDC National Reach**: Democratizes discovery by syndicating rural products across Paytm, PhonePe, and major consumer apps without separate listing fees.
- **Fair-Wage Algorithmic Protection**: Protects unorganized rural craftspeople from distress selling below production cost.
- **Cultural Heritage Preservation**: Documents fading indigenous techniques, tribal stories, and GI-tag histories for posterity.

---

## 📜 License & Acknowledgements

Developed for **Smart India Hackathon 2026** under **Problem Statement ID 26090** for the **Ministry of Social Justice and Empowerment (MoSJE)**.

Built with dedication for India's master artisans. 🇮🇳
