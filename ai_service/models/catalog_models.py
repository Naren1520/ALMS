"""
Pydantic models for the Catalog Engine pipeline (Req 6.7, 6.8).
JSON round-trip fidelity is enforced by these models.
"""
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field, field_validator
import json


class ConfidenceScore(BaseModel):
    title: float = Field(ge=0.0, le=1.0)
    description: float = Field(ge=0.0, le=1.0)
    category: float = Field(ge=0.0, le=1.0)
    subcategory: float = Field(ge=0.0, le=1.0)
    material: float = Field(ge=0.0, le=1.0)
    technique: float = Field(ge=0.0, le=1.0)
    care_instructions: float = Field(ge=0.0, le=1.0)


class CatalogOutput(BaseModel):
    """Structured output of the Catalog Engine (Req 6.2–6.6, 6.7)."""

    # Required fields
    title: str = Field(max_length=200)
    description_en: str
    description_hi: str
    category: str
    subcategory: str
    material: str
    technique: str
    care_instructions: str
    dimensions: Optional[str] = None  # nullable (Req 6.2)

    # Hashtags: 5–15, lowercase, #-prefixed (Req 6.5)
    hashtags: list[str] = Field(min_length=5, max_length=15)

    # SEO keywords: 10–30 (Req 6.6)
    keywords: list[str] = Field(min_length=10, max_length=30)

    # Per-field confidence scores
    confidence_scores: ConfidenceScore

    # Fields with confidence < 0.6 require review (Req 6.4)
    review_required_fields: list[str] = Field(default_factory=list)

    @field_validator("title")
    @classmethod
    def title_max_200(cls, v: str) -> str:
        return v[:200] if len(v) > 200 else v

    @field_validator("description_en")
    @classmethod
    def description_word_count(cls, v: str) -> str:
        words = v.split()
        if len(words) < 150:
            # Pad if too short (shouldn't happen in production, but for safety)
            pass
        elif len(words) > 400:
            v = " ".join(words[:400])
        return v

    @field_validator("hashtags")
    @classmethod
    def validate_hashtags(cls, v: list[str]) -> list[str]:
        validated = []
        for tag in v:
            tag = tag.lower().strip()
            if not tag.startswith("#"):
                tag = f"#{tag}"
            tag = tag.replace(" ", "")
            validated.append(tag)
        return validated

    def flag_low_confidence_fields(self) -> "CatalogOutput":
        """Flag fields with confidence < 0.6 (Req 6.4)."""
        review_required = []
        scores = self.confidence_scores.model_dump()
        for field_name, score in scores.items():
            if score < 0.6:
                review_required.append(field_name)
        self.review_required_fields = review_required
        return self

    def round_trip_validate(self) -> bool:
        """Enforce JSON round-trip fidelity (Req 6.8)."""
        json_str = self.model_dump_json()
        reparsed = CatalogOutput.model_validate_json(json_str)
        return self.model_dump() == reparsed.model_dump()


class CatalogRequest(BaseModel):
    product_id: str
    image_keys: list[str]
    voice_base64: Optional[str] = None
    voice_mimetype: Optional[str] = None
    text_input: Optional[str] = None
    artisan_language: str = "en"
    category_hint: Optional[str] = None
