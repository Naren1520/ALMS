"""Pydantic models for the Pricing Engine (Req 7.1–7.4)."""
from typing import Optional
from pydantic import BaseModel, Field


class PricingFactor(BaseModel):
    factor_name: str
    description: str
    impact: str  # 'positive' | 'negative' | 'neutral'


class PricingResult(BaseModel):
    """Structured output of PricingEngine (Req 7.1, 7.4)."""
    retail_price_min: float = Field(gt=0)
    retail_price_suggested: float = Field(gt=0)
    retail_price_max: float = Field(gt=0)
    wholesale_price_min: float = Field(gt=0)
    wholesale_price_suggested: float = Field(gt=0)
    wholesale_price_max: float = Field(gt=0)
    moq_suggested: int = Field(ge=1)
    confidence: float = Field(ge=0.0, le=1.0)
    factor_breakdown: list[PricingFactor] = Field(min_length=2, max_length=5)


class PricingRequest(BaseModel):
    product_id: Optional[str] = None
    category: str
    material: str
    technique: str
    artisan_district: str = "India"
    artisan_language: str = "en"
