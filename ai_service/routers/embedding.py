"""Product embedding generation (Req 9.1, 9.4)."""
from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter()


class EmbeddingRequest(BaseModel):
    product_id: str
    title: str
    description: str
    category: str
    craft: str
    region: str
    material: str


class EmbeddingResponse(BaseModel):
    product_id: str
    embedding: list[float]
    dimensions: int


@router.post("/generate", response_model=EmbeddingResponse)
async def generate_embedding(request: EmbeddingRequest):
    """
    Generate 768-dim embedding for product (Req 9.1).
    In production: calls Google text-embedding-004.
    """
    combined_text = (
        f"{request.title}. {request.description}. "
        f"{request.category}. {request.craft}. "
        f"{request.region}. {request.material}"
    )

    # Deterministic mock — in production calls Google Embedding API
    np.random.seed(hash(combined_text) % (2**31))
    embedding = np.random.normal(0, 1, 768).tolist()

    return EmbeddingResponse(
        product_id=request.product_id,
        embedding=embedding,
        dimensions=768,
    )
