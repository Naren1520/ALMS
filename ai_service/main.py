"""
ALMS AI Service — FastAPI
Handles image enhancement, catalog generation, pricing, SEO,
embeddings, translation, and content moderation.
"""
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from routers import (
    image_pipeline_router,
    catalog_router,
    pricing_router,
    seo_router,
    embedding_router,
    translation_router,
    moderation_router,
    health_router,
)
from config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    yield


app = FastAPI(
    title="ALMS AI Service",
    version="1.0.0",
    description="AI/ML microservice for ALMS platform",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_service_token(x_service_token: str = Header(...)):
    """Service-to-service authentication."""
    if x_service_token != settings.ai_service_token:
        raise HTTPException(status_code=401, detail="Invalid service token")
    return x_service_token


app.include_router(health_router, prefix="/health", tags=["health"])
app.include_router(image_pipeline_router, prefix="/pipeline/image", tags=["image"])
app.include_router(catalog_router, prefix="/pipeline/catalog", tags=["catalog"])
app.include_router(pricing_router, prefix="/pipeline/pricing", tags=["pricing"])
app.include_router(seo_router, prefix="/pipeline/seo", tags=["seo"])
app.include_router(embedding_router, prefix="/pipeline/embedding", tags=["embedding"])
app.include_router(translation_router, prefix="/pipeline/translation", tags=["translation"])
app.include_router(moderation_router, prefix="/pipeline/moderation", tags=["moderation"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
