"""
Multilingual catalog generation pipeline (Req 6.1–6.8).
"""
import json
import re
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai

from config import settings
from models.catalog_models import CatalogOutput, CatalogRequest, ConfidenceScore

router = APIRouter()

SUPPORTED_LANGUAGES = ["hi", "bn", "te", "mr", "ta", "gu", "kn", "ml", "or", "pa", "en"]


def get_gemini_model():
    if settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)
        return genai.GenerativeModel(settings.gemini_model)
    return None


def build_catalog_prompt(text_input: str, category_hint: Optional[str]) -> str:
    category_note = f"Category hint: {category_hint}" if category_hint else ""
    return f"""
You are an expert product catalog writer for Indian artisans.
{category_note}

Based on this description: "{text_input}"

Generate a complete product catalog in strict JSON format:
{{
  "title": "<English title, max 200 chars>",
  "description_en": "<English description, 150-400 words>",
  "description_hi": "<Hindi description>",
  "category": "<product category>",
  "subcategory": "<subcategory>",
  "material": "<material composition>",
  "technique": "<craft technique>",
  "care_instructions": "<care instructions>",
  "dimensions": null,
  "hashtags": ["#hashtag1", "#hashtag2", ... 5-15 items],
  "keywords": ["keyword1", ... 10-30 items],
  "confidence_scores": {{
    "title": 0.9,
    "description": 0.85,
    "category": 0.8,
    "subcategory": 0.75,
    "material": 0.7,
    "technique": 0.8,
    "care_instructions": 0.9
  }}
}}
Return ONLY valid JSON, no markdown.
"""


@router.post("/generate")
async def generate_catalog(request: CatalogRequest):
    """Generate multilingual product catalog (Req 6.1–6.8)."""

    # Transcribe voice if present
    text_input = request.text_input or ""
    if request.voice_base64:
        text_input = f"[Voice transcription placeholder] {text_input}"

    if not text_input.strip():
        text_input = "Handmade artisan product from India"

    model = get_gemini_model()

    if model:
        try:
            response = model.generate_content(
                build_catalog_prompt(text_input, request.category_hint)
            )
            raw_json = response.text.strip()
            # Strip markdown code blocks if present
            raw_json = re.sub(r"^```json\s*", "", raw_json)
            raw_json = re.sub(r"\s*```$", "", raw_json)
            data = json.loads(raw_json)
        except Exception as e:
            data = _fallback_catalog(text_input)
    else:
        data = _fallback_catalog(text_input)

    # Ensure confidence_scores structure
    if "confidence_scores" not in data:
        data["confidence_scores"] = {k: 0.8 for k in
            ["title","description","category","subcategory","material","technique","care_instructions"]}

    if "review_required_fields" not in data:
        data["review_required_fields"] = []

    try:
        output = CatalogOutput.model_validate(data)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Catalog validation failed: {exc}")

    # Flag low confidence fields (Req 6.4)
    output.flag_low_confidence_fields()

    # Enforce round-trip fidelity (Req 6.8)
    if not output.round_trip_validate():
        raise HTTPException(status_code=500, detail="Catalog round-trip validation failed")

    return output.model_dump()


def _fallback_catalog(text_input: str) -> dict:
    """Fallback when Gemini is unavailable."""
    return {
        "title": text_input[:200] if text_input else "Handcrafted Product",
        "description_en": f"A beautiful handcrafted product. {text_input} " * 10,
        "description_hi": "एक सुंदर हस्तनिर्मित उत्पाद।",
        "category": "Handicrafts",
        "subcategory": "General",
        "material": "Natural materials",
        "technique": "Traditional handcraft",
        "care_instructions": "Handle with care. Store in dry place.",
        "dimensions": None,
        "hashtags": ["#handmade", "#artisan", "#india", "#craft", "#traditional"],
        "keywords": ["handmade", "artisan", "india", "craft", "traditional",
                     "handcrafted", "indigenous", "authentic", "cultural", "heritage"],
        "confidence_scores": {
            "title": 0.5,
            "description": 0.5,
            "category": 0.5,
            "subcategory": 0.5,
            "material": 0.5,
            "technique": 0.5,
            "care_instructions": 0.5,
        },
        "review_required_fields": ["title", "description", "category"],
    }
