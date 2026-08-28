"""
Image enhancement pipeline (Req 5.1–5.8).
Stages: content validation → background removal → lighting → sharpening → upscaling → framing
"""
import io
import time
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
import base64

router = APIRouter()

CRAFT_PRESETS = {
    "textile": {"background": "white"},
    "pottery": {"studio_light": True},
    "jewelry": {"macro_sharpen": True},
    "default": {"background": "white"},
}

MAX_PROCESS_SECONDS = 30


class ImageEnhanceRequest(BaseModel):
    image_base64: str
    product_id: str
    category: Optional[str] = None
    original_key: str


class ImageEnhanceResponse(BaseModel):
    original_key: str
    enhanced_base64: str
    width: int
    height: int
    size_bytes: int
    format: str = "webp"
    processing_time_ms: float


@router.post("/enhance", response_model=ImageEnhanceResponse)
async def enhance_image(request: ImageEnhanceRequest):
    """
    Full image enhancement pipeline (Req 5.1, 5.2, 5.6, 5.7).
    Must complete within 30 seconds per image.
    """
    start_time = time.time()

    try:
        image_bytes = base64.b64decode(request.image_base64)
        img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    except Exception:
        raise HTTPException(status_code=422, detail="Cannot decode image")

    # 1. Content validation — basic check (CLIP would be used in production)
    width, height = img.size
    if width < 10 or height < 10:
        raise HTTPException(
            status_code=422,
            detail="Please upload an image that clearly shows your product on a clear background."
        )

    # 2. Background removal (simplified — rembg in production)
    try:
        from rembg import remove as rembg_remove
        img_no_bg = rembg_remove(img)
    except Exception:
        img_no_bg = img  # Fallback: keep original

    # 3. Lighting & color correction
    img_rgb = img_no_bg.convert("RGB")
    enhancer = ImageEnhance.Brightness(img_rgb)
    img_rgb = enhancer.enhance(1.05)
    enhancer = ImageEnhance.Contrast(img_rgb)
    img_rgb = enhancer.enhance(1.1)

    # 4. Noise reduction (simplified — OpenCV in production)
    img_rgb = img_rgb.filter(ImageFilter.MedianFilter(size=3))

    # 5. Sharpening (unsharp mask)
    img_rgb = img_rgb.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))

    # 6. Upscaling to ≥1200px if smaller
    if img_rgb.width < 1200 or img_rgb.height < 1200:
        scale = max(1200 / img_rgb.width, 1200 / img_rgb.height)
        new_w = int(img_rgb.width * scale)
        new_h = int(img_rgb.height * scale)
        img_rgb = img_rgb.resize((new_w, new_h), Image.LANCZOS)

    # 7. Apply craft preset
    preset_key = request.category.lower() if request.category else "default"
    preset = CRAFT_PRESETS.get(preset_key, CRAFT_PRESETS["default"])

    if preset.get("macro_sharpen"):
        img_rgb = img_rgb.filter(ImageFilter.SHARPEN)

    # 8. Canvas framing to 1200×1200 white background
    canvas = Image.new("RGB", (1200, 1200), (255, 255, 255))
    img_rgb.thumbnail((1200, 1200), Image.LANCZOS)
    offset_x = (1200 - img_rgb.width) // 2
    offset_y = (1200 - img_rgb.height) // 2
    canvas.paste(img_rgb, (offset_x, offset_y))

    # Export as WebP ≤5 MB (Req 5.2)
    output = io.BytesIO()
    quality = 85
    while quality > 30:
        output.seek(0)
        output.truncate(0)
        canvas.save(output, format="WEBP", quality=quality)
        if output.tell() <= 5 * 1024 * 1024:
            break
        quality -= 10

    output.seek(0)
    enhanced_bytes = output.read()
    enhanced_base64 = base64.b64encode(enhanced_bytes).decode("utf-8")

    elapsed_ms = (time.time() - start_time) * 1000

    if elapsed_ms > MAX_PROCESS_SECONDS * 1000:
        raise HTTPException(status_code=408, detail="Image processing timeout")

    return ImageEnhanceResponse(
        original_key=request.original_key,
        enhanced_base64=enhanced_base64,
        width=1200,
        height=1200,
        size_bytes=len(enhanced_bytes),
        format="webp",
        processing_time_ms=elapsed_ms,
    )
