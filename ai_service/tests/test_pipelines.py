"""
FastAPI Microservice Integration & Endpoint Tests
Tests all 8 microservice pipelines.
"""
import sys
import os
import io
import base64
from PIL import Image

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_endpoint():
    """Verify AI microservice health check."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "ALMS AI Service" in data["service"]


def test_catalog_generation_endpoint():
    """Verify /pipeline/catalog/generate generates valid catalog structure."""
    payload = {
        "text_input": "Handwoven Bastar bamboo storage basket crafted with natural cane",
        "category_hint": "Home & Utility",
    }
    response = client.post("/pipeline/catalog/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert "description_en" in data
    assert "description_hi" in data
    assert "category" in data
    assert "hashtags" in data
    assert len(data["hashtags"]) >= 5
    assert len(data["keywords"]) >= 10


def test_pricing_recommendation_endpoint():
    """Verify /pipeline/pricing/recommend returns fair wage floors and suggestions."""
    payload = {
        "category": "Textiles",
        "material": "Tussar Silk",
        "technique": "Handloom Weaving",
        "artisan_district": "Bastar",
    }
    response = client.post("/pipeline/pricing/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["retail_price_suggested"] > 0
    assert data["wholesale_price_suggested"] > 0
    assert data["retail_price_suggested"] >= data["wholesale_price_suggested"]
    assert "factor_breakdown" in data


def test_seo_generation_endpoint():
    """Verify /pipeline/seo/generate produces valid meta tags, slugs, and Schema.org JSON-LD."""
    payload = {
        "product_id": "prod-123",
        "title": "Bastar Handcrafted Bell Metal Dhokra Figurine",
        "description_en": "Authentic lost-wax cast bell metal artifact handcrafted by Bastar tribal artisans.",
        "category": "Metal Crafts",
        "material": "Brass & Bronze",
    }
    response = client.post("/pipeline/seo/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["meta_title"]) <= 60
    assert len(data["meta_description"]) <= 160
    assert "canonical_slug" in data
    assert "json_ld" in data
    assert data["json_ld"]["@type"] == "Product"


def test_embedding_generation_endpoint():
    """Verify /pipeline/embedding/generate generates 768-dimensional embeddings."""
    payload = {
        "product_id": "prod-456",
        "title": "Blue Pottery Vase",
        "description": "Quartz and cobalt glaze handcrafted pottery vase from Jaipur.",
        "category": "Ceramics",
        "craft": "Blue Pottery",
        "region": "Jaipur, Rajasthan",
        "material": "Quartz, Glass, Fuller Earth",
    }
    response = client.post("/pipeline/embedding/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["dimensions"] == 768
    assert len(data["embedding"]) == 768


def test_moderation_endpoint():
    """Verify content moderation classifies safe vs unsafe content."""
    # Safe content
    safe_resp = client.post(
        "/pipeline/moderation/check",
        json={"content": "Beautiful hand-stitched Kantha embroidery dupatta", "content_type": "listing"},
    )
    assert safe_resp.status_code == 200
    assert safe_resp.json()["verdict"] == "SAFE"

    # Prohibited content
    bad_resp = client.post(
        "/pipeline/moderation/check",
        json={"content": "Illegal fake counterfeit luxury copy for sale", "content_type": "listing"},
    )
    assert bad_resp.status_code == 200
    assert bad_resp.json()["verdict"] == "VIOLATES_POLICY"


def test_translation_endpoint():
    """Verify translation endpoint."""
    resp = client.post(
        "/pipeline/translation/translate",
        json={"text": "Authentic Handcrafted Terracotta Lamp", "source_language": "en", "target_language": "hi"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "translated_text" in data


def test_image_enhancement_endpoint():
    """Verify image enhancement pipeline processes images to 1200x1200 WebP."""
    # Create small test in-memory image
    img = Image.new("RGB", (100, 100), color=(200, 100, 50))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    b64_str = base64.b64encode(buf.getvalue()).decode("utf-8")

    payload = {
        "image_base64": b64_str,
        "product_id": "test-prod-1",
        "category": "textile",
        "original_key": "products/test-prod-1/original/test.jpg",
    }

    response = client.post("/pipeline/image/enhance", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["width"] == 1200
    assert data["height"] == 1200
    assert data["format"] == "webp"
    assert len(data["enhanced_base64"]) > 0
