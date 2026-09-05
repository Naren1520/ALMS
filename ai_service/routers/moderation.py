"""AI content moderation pipeline (Req 29.1–29.3)."""
from fastapi import APIRouter
from pydantic import BaseModel
from enum import Enum
from typing import Optional
import google.generativeai as genai
from config import settings

router = APIRouter()


class ModerationVerdict(str, Enum):
    SAFE = "SAFE"
    REQUIRES_REVIEW = "REQUIRES_REVIEW"
    VIOLATES_POLICY = "VIOLATES_POLICY"


class ModerationRequest(BaseModel):
    content: str
    content_type: str  # 'review' | 'listing' | 'message'
    language: str = "en"


class ModerationResponse(BaseModel):
    verdict: ModerationVerdict
    category: Optional[str] = None
    confidence: float


PROHIBITED_KEYWORDS = [
    "spam", "fake", "scam", "fraud", "illegal", "counterfeit",
    "prohibited", "banned", "inappropriate",
]


@router.post("/check", response_model=ModerationResponse)
async def check_content(request: ModerationRequest):
    """
    AI content moderation (Req 29.1–29.3).
    Returns SAFE / REQUIRES_REVIEW / VIOLATES_POLICY.
    """
    content_lower = request.content.lower()

    # Quick heuristic check
    for word in PROHIBITED_KEYWORDS:
        if word in content_lower:
            return ModerationResponse(
                verdict=ModerationVerdict.VIOLATES_POLICY,
                category="prohibited_content",
                confidence=0.95,
            )

    # Gemini-based moderation for borderline content
    if settings.gemini_api_key:
        try:
            genai.configure(api_key=settings.gemini_api_key)
            model = genai.GenerativeModel(settings.gemini_model)
            prompt = f"""
Moderate this {request.content_type} content for an artisan marketplace.
Content: "{request.content}"
Reply with exactly one of: SAFE, REQUIRES_REVIEW, or VIOLATES_POLICY
"""
            resp = model.generate_content(prompt)
            verdict_str = resp.text.strip().upper()
            if "VIOLATES" in verdict_str:
                return ModerationResponse(verdict=ModerationVerdict.VIOLATES_POLICY, confidence=0.85)
            elif "REQUIRES" in verdict_str:
                return ModerationResponse(verdict=ModerationVerdict.REQUIRES_REVIEW, confidence=0.75)
        except Exception:
            pass

    return ModerationResponse(verdict=ModerationVerdict.SAFE, confidence=0.9)
