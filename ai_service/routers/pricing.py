"""Pricing engine (Req 7.1–7.7)."""
import json
import re
from fastapi import APIRouter, HTTPException
import google.generativeai as genai

from config import settings
from models.pricing_models import PricingRequest, PricingResult, PricingFactor

router = APIRouter()


def get_gemini():
    if settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)
        return genai.GenerativeModel("gemini-1.5-pro")
    return None


@router.post("/recommend", response_model=PricingResult)
async def recommend_pricing(request: PricingRequest):
    """Compute pricing recommendation (Req 7.1–7.4)."""

    model = get_gemini()
    if not model:
        return _fallback_pricing(request)

    prompt = f"""
You are a pricing expert for Indian artisan products.
Product: category={request.category}, material={request.material}, technique={request.technique}
District: {request.artisan_district}

Provide pricing recommendation in strict JSON:
{{
  "retail_price_min": 150,
  "retail_price_suggested": 250,
  "retail_price_max": 400,
  "wholesale_price_min": 100,
  "wholesale_price_suggested": 175,
  "wholesale_price_max": 280,
  "moq_suggested": 10,
  "confidence": 0.82,
  "factor_breakdown": [
    {{"factor_name": "Labor", "description": "Skilled handcraft labor", "impact": "positive"}},
    {{"factor_name": "Material cost", "description": "Raw material pricing in {request.artisan_district}", "impact": "neutral"}}
  ]
}}
Return ONLY valid JSON.
"""

    try:
        resp = model.generate_content(prompt)
        raw = re.sub(r"^```json\s*|\s*```$", "", resp.text.strip())
        data = json.loads(raw)
        return PricingResult.model_validate(data)
    except Exception:
        return _fallback_pricing(request)


def _fallback_pricing(request: PricingRequest) -> PricingResult:
    return PricingResult(
        retail_price_min=100.0,
        retail_price_suggested=250.0,
        retail_price_max=500.0,
        wholesale_price_min=70.0,
        wholesale_price_suggested=175.0,
        wholesale_price_max=350.0,
        moq_suggested=10,
        confidence=0.5,
        factor_breakdown=[
            PricingFactor(factor_name="Base estimate", description="Default pricing estimate", impact="neutral"),
            PricingFactor(factor_name="Category", description=f"Category: {request.category}", impact="positive"),
        ],
    )
