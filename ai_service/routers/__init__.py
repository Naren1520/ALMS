from .health import router as health_router
from .image_pipeline import router as image_pipeline_router
from .catalog import router as catalog_router
from .pricing import router as pricing_router
from .seo import router as seo_router
from .embedding import router as embedding_router
from .translation import router as translation_router
from .moderation import router as moderation_router

__all__ = [
    "health_router",
    "image_pipeline_router",
    "catalog_router",
    "pricing_router",
    "seo_router",
    "embedding_router",
    "translation_router",
    "moderation_router",
]
