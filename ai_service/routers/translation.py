"""Translation service (Req 15.3, 9.7)."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import google.generativeai as genai
from config import settings

router = APIRouter()


class TranslationRequest(BaseModel):
    text: str
    source_language: Optional[str] = None
    target_language: str = "en"


class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    detected_language: Optional[str]
    target_language: str


@router.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """Translate text between languages (Req 15.3)."""
    if request.source_language == request.target_language:
        return TranslationResponse(
            original_text=request.text,
            translated_text=request.text,
            detected_language=request.source_language,
            target_language=request.target_language,
        )

    translated = request.text  # fallback

    if settings.gemini_api_key:
        try:
            genai.configure(api_key=settings.gemini_api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"Translate to {request.target_language}. Return ONLY the translation:\n{request.text}"
            resp = model.generate_content(prompt)
            translated = resp.text.strip()
        except Exception:
            pass

    return TranslationResponse(
        original_text=request.text,
        translated_text=translated,
        detected_language=request.source_language,
        target_language=request.target_language,
    )
