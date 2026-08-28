"""SEO metadata generation (Req 8.1, 8.2, 8.6, 8.7)."""
import json
import re
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
import google.generativeai as genai
from config import settings

router = APIRouter()


class SeoRequest(BaseModel):
    product_id: str
    title: str
    description_en: str
    category: str
    material: Optional[str] = None


class SeoResult(BaseModel):
    meta_title: str = Field(max_length=60)
    meta_description: str = Field(max_length=160)
    og_title: str = Field(max_length=90)
    og_description: str = Field(max_length=300)
    canonical_slug: str
    hashtags: list[str] = Field(min_length=5, max_length=15)
    keywords: list[str] = Field(min_length=10, max_length=30)
    json_ld: dict


def slugify(text: str) -> str:
    import re
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text.strip())
    return text[:80]


@router.post("/generate", response_model=SeoResult)
async def generate_seo(request: SeoRequest):
    """Generate SEO metadata (Req 8.1, 8.2)."""
    model = None
    if settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel("gemini-1.5-pro")

    slug = slugify(request.title)
    meta_title = request.title[:57] + "..." if len(request.title) > 60 else request.title
    meta_desc = request.description_en[:157] + "..." if len(request.description_en) > 160 else request.description_en

    json_ld = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": request.title,
        "description": request.description_en,
        "category": request.category,
        "brand": {"@type": "Brand", "name": "ALMS Artisan"},
        "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
        },
    }

    return SeoResult(
        meta_title=meta_title,
        meta_description=meta_desc[:160],
        og_title=request.title[:87] + "..." if len(request.title) > 90 else request.title,
        og_description=request.description_en[:297] + "..." if len(request.description_en) > 300 else request.description_en,
        canonical_slug=slug,
        hashtags=["#handmade", "#artisan", "#india", "#craft", "#traditional"],
        keywords=["handmade", "artisan", "india", request.category.lower(), "craft",
                  "traditional", "handcrafted", "indigenous", "authentic", "cultural",
                  "heritage", "sustainable", "eco-friendly", "fair-trade", "artisanal"],
        json_ld=json_ld,
    )
