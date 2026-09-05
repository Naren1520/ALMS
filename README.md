# ALMS — Artisan Linkage and Market System

> **Smart India Hackathon 2026 · Problem Statement ID 26090**  
> **Ministry of Social Justice and Empowerment (MoSJE)** · Department of Social Justice and Empowerment  
> **Theme:** Heritage and Culture · **Commission Model:** 0% Direct-to-Artisan Revenue

[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js_16_Turbopack-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/UI-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS_v10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![FastAPI](https://img.shields.io/badge/AI_Service-FastAPI_Python_3.11+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-Supabase_PostgreSQL_16-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Redis](https://img.shields.io/badge/Queue_&_Cache-Redis_7_+_BullMQ-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

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
│ bilingual catalog    │ lighting & analysis  │ anti-exploitation pricing     │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ 🌐 ONDC Auto-Node    │ 🏢 B2B RFQ Pipeline  │ 📦 India Post DNK             │
│ Direct syndication   │ Multi-cluster quota  │ Rural export customs & PBE    │
│ to 50+ buyer apps    │ & 3-stage escrow     │ tracking from any pin code    │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ 🛡️ Trust Score Engine│ 🗺️ Craft Atlas Map   │ 📴 Offline-First Sync Queue   │
│ Explainable 0-100    │ Interactive regional │ IndexedDB auto-replay         │
│ multi-factor rating  │ GI & craft directory │ on internet reconnect         │
└──────────────────────┴──────────────────────┴───────────────────────────────┘
```

---

## 🏗️ System Architecture

ALMS is engineered as a decoupled, high-performance microservices architecture:

```
                                ┌────────────────────────────────────────────────────────┐
                                │                 Cloudflare CDN + Edge WAF              │
                                └───────────────────────────┬────────────────────────────┘
                                                            │
                                ┌───────────────────────────┼────────────────────────────┐
                                │                           │                            │
                      ┌─────────▼─────────┐       ┌─────────▼─────────┐        ┌─────────▼─────────┐
                      │    Next.js 16     │       │  NestJS Backend   │        │ FastAPI AI Engine │
                      │ Turbopack + R19   │◄─────►│    API Gateway    │◄──────►│   Microservice    │
                      │    Port: 3000     │REST/WS│    Port: 8080     │ HTTP   │    Port: 8000     │
                      └───────────────────┘       └─────────┬─────────┘ jobs   └───────────────────┘
                                                            │
                                ┌───────────────────────────┼────────────────────────────┐
                                │                           │                            │
                      ┌─────────▼─────────┐       ┌─────────▼─────────┐        ┌─────────▼─────────┐
                      │  PostgreSQL 16 +  │       │   Redis 7 Cache   │        │   Supabase Cloud  │
                      │     pgvector      │       │    + 8 BullMQ     │        │  Object & Storage │
                      │ (36+ RLS Tables)  │       │      Queues       │        │  (Media & Docs)   │
                      └───────────────────┘       └───────────────────┘        └───────────────────┘
                                                            │
                                ┌───────────────────────────▼────────────────────────────┐
                                │        National Infrastructure & Governance APIs       │
                                │        • ONDC Network (Beckn Protocol v1.1)            │
                                │        • DigiLocker (Aadhaar, Caste, UDID)             │
                                │        • Dak Ghar Niryat Kendra (India Post PBE)       │
                                └────────────────────────────────────────────────────────┘
```

### Microservice Components:

1. **Frontend (`/frontend`)**: Next.js 16 (Turbopack) with React 19, Tailwind CSS, Framer Motion 13, Lucide Icons, and Offline Sync Queue on **Port 3000**.
2. **Backend (`/backend`)**: NestJS v10 modular monolith in TypeScript, TypeORM, BullMQ distributed queue workers, JWT RS256 authentication, AES-256-GCM encryption, and WebSocket real-time messaging on **Port 8080**.
3. **AI Service (`/ai_service`)**: High-performance FastAPI microservice running Python 3.11+, Google Gemini 2.0/1.5 multimodal LLM, Pillow, and OpenCV computer vision pipelines on **Port 8000**.

---

## ⚡ Core Feature Matrix

### 1. 👩‍🎨 For Artisans (Zero Digital Literacy Required)
- **Custom Craft & Photo Upload**: Artisans can upload their own smartphone photos or drag-and-drop unique craft creations.
- **Multimodal AI Craft Analysis & Market Estimation Engine**:
  - **Identified Craft Form**: Automatic recognition of ancient techniques (e.g. *Lost-Wax Bell Metal Casting*, *Chashm-e-Bulbul Pashmina Weave*).
  - **Material Composition & Purity**: Verified natural ingredients (*Tussar Silk, River Bed Clay, Recycled Brass*).
  - **Defensible Price Floors**: Computes living-wage floor based on raw materials, artisan hours, and MoSJE minimum benchmarks.
  - **Market Intelligence**: Suggested B2C retail rates, B2B wholesale MOQ rates, and export HS code classifications.
- **Multilingual Voice-to-Catalog**: Speak in native dialects (Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, etc.). Automatically transcribes, translates, and generates structured ONDC metadata.
- **Direct Database Ingestion**: Products publish directly into Supabase PostgreSQL and appear instantly at the top of the Marketplace.

### 2. 💼 For B2B Buyers & Institutions
- **4-Stage Progressive B2B RFQ Pipeline** (`/b2b/rfq`):
  1. *Stage 1: Demand Specification & Anti-Exploitation Wage Check* (Flags sub-living wage rates).
  2. *Stage 2: Algorithmic Multi-Cluster Capacity Allocation* (Splits large demands across regional cooperatives with interactive quota sliders).
  3. *Stage 3: ONDC 3-Stage Smart Escrow Terms* (30% Raw Material Advance, 40% QC Pass, 30% Delivery Dispatch).
  4. *Stage 4: Live Production Tracking & ERP Manifest Downloader* (Simulate fund releases and export JSON purchase orders).

### 3. 🛍️ For Direct Retail Consumers
- **Explore Marketplace** (`/explore`): Discover GI-certified Indian crafts with live Supabase database connectivity.
- **1-Click Direct Consumer Order**: Instant checkout with fair-wage breakdown (85% direct wage share) and live ONDC Tracking ID.

### 4. 🧭 Role-Filtered Dynamic Navigation
- **Artisan**: `AI Studio` · `My Products` · `B2B RFQ Quotes` · `Impact & Trust`
- **Buyer**: `B2B RFQ Engine` · `Wholesale Catalog` · `Craft Clusters` · `Artisans Guild` · `ESG Impact`
- **Consumer**: `Explore Marketplace` · `Craft Atlas` · `Master Artisans` · `Heritage Stories`
- **Guest / Default**: `Explore Crafts` · `Craft Atlas` · `Artisans` · `Impact` · `Log In`

---

## 📁 Repository Structure

```
d:/ALMS/
├── frontend/                        # Next.js 16 (Turbopack) & React 19 App Router
│   ├── src/
│   │   ├── app/                     # Route pages (Home, Studio, RFQ, Atlas, Explore, Docs, Auth)
│   │   │   ├── artisan/create-product/ # Zero-literacy AI cataloging & custom upload studio
│   │   │   ├── artisans/            # Master artisan directory & profiles
│   │   │   ├── b2b/rfq/             # 4-Stage B2B RFQ engine & escrow contract simulator
│   │   │   ├── craft-atlas/         # Interactive SVG India craft map
│   │   │   ├── explore/             # Live Supabase semantic marketplace & 1-click order
│   │   │   ├── impact/              # MoSJE livelihood analytics dashboard
│   │   │   └── (auth)/              # Role-based login & registration
│   │   ├── components/              # Layout, Navbar, and interactive UI components
│   │   └── utils/                   # Supabase clients & state managers
│   ├── next.config.js               # API rewrites & Next 16 Turbopack configuration
│   └── package.json
├── backend/                         # NestJS Monolith API Gateway
│   ├── src/
│   │   ├── modules/                 # 17 domain feature modules (Auth, Product, B2B, Trust, Search)
│   │   ├── common/                  # Services, guards, filters, decorators
│   │   └── main.ts                  # NestJS bootstrap (Port 8080)
│   └── package.json
├── ai_service/                      # FastAPI AI & Computer Vision Microservice
│   ├── routers/                     # 8 AI Pipeline Routers (Catalog, Vision, Pricing, SEO, Translation)
│   ├── main.py                      # FastAPI application entrypoint (Port 8000)
│   └── requirements.txt
├── docker-compose.yml               # Multi-container orchestration
└── README.md                        # Master repository documentation
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: v20.x or later
- **Python**: v3.11 or later
- **Git**

---

### Step 1: AI Microservice (FastAPI)
```bash
cd ai_service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
> Verify: Open [http://localhost:8000/docs](http://localhost:8000/docs) for Swagger UI.

---

### Step 2: Backend API Gateway (NestJS)
```bash
cd backend
npm install
npm run build
npm run start:dev
```
> Verify: Open [http://localhost:8080/api/v1/products](http://localhost:8080/api/v1/products).

---

### Step 3: Frontend Web Application (Next.js 16)
```bash
cd frontend
npm install
npm run dev
```
> Verify: Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Configuration

### Backend (`backend/.env`)
| Key | Sample | Purpose |
|---|---|---|
| `PORT` | `8080` | HTTP Port for NestJS API |
| `FRONTEND_URL` | `http://localhost:3000` | CORS Origin |
| `DATABASE_HOST` | `aws-0-ap-northeast-2.pooler.supabase.com` | Supabase PostgreSQL Host |
| `DATABASE_PORT` | `5432` | DB Port |
| `DATABASE_NAME` | `postgres` | DB Name |
| `DATABASE_USER` | `postgres.shavgttipitgwhmafocn` | DB User |
| `DATABASE_SSL` | `true` | SSL Connection |
| `AI_SERVICE_URL` | `http://localhost:8000` | FastAPI microservice URL |
| `GEMINI_API_KEY` | `your-gemini-key` | Google Gemini AI Key |

### Frontend (`frontend/.env.local`)
| Key | Sample | Purpose |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8080` | Backend API URL for Next.js rewrites |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://shavgttipitgwhmafocn.supabase.co` | Supabase project endpoint |

---

## 🧪 Testing & Verification

```
═══════════════════════════════════════════════════════════════════════════
                      ALMS AUTOMATED TEST & BUILD COVERAGE
═══════════════════════════════════════════════════════════════════════════
  ✅ Frontend Build (Next.js 16 Turbopack)     : 14 Routes (100% Pass in 397ms)
  ✅ TypeScript Compilation (Frontend/Backend) : 0 Errors
  ✅ Backend NestJS Build                      : 100% Pass
  ✅ AI Microservice Interconnect              : 8 Pipelines Active (Port 8000)
  ✅ Supabase PostgreSQL Database              : Live & Synchronized
═══════════════════════════════════════════════════════════════════════════
```

Run test suite:
```bash
# Backend tests
cd backend && npm run test

# Frontend typecheck
cd frontend && npx tsc --noEmit
```

---

## 📜 License & Acknowledgements

Developed for **Smart India Hackathon 2026** under **Problem Statement ID 26090** for the **Ministry of Social Justice and Empowerment (MoSJE)**.

<div align="center">
  <sub>Built with ❤️ for Indian Artisans by Team AlgoVectors · 2026</sub>
</div>
