"""
Property 7: Catalog Engine JSON Round-Trip Fidelity
Validates: Requirements 6.8

Run: pytest ai_service/tests/catalog.property.py -v
"""
import json
from hypothesis import given, settings
from hypothesis import strategies as st

# Make sure this runs from the project root
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from models.catalog_models import CatalogOutput, ConfidenceScore


def make_confidence_score_dict(draw, st_module):
    """Generate a valid ConfidenceScore dict."""
    return {
        field: draw(st_module.floats(min_value=0.0, max_value=1.0, allow_nan=False))
        for field in ['title', 'description', 'category', 'subcategory', 'material', 'technique', 'care_instructions']
    }


@settings(max_examples=200, deadline=5000)
@given(
    title=st.text(min_size=1, max_size=200),
    description_en=st.text(min_size=150, max_size=400),
    description_hi=st.text(min_size=1, max_size=400),
    category=st.text(min_size=1, max_size=50),
    subcategory=st.text(min_size=1, max_size=50),
    material=st.text(min_size=1, max_size=100),
    technique=st.text(min_size=1, max_size=100),
    care_instructions=st.text(min_size=1, max_size=200),
    hashtag_count=st.integers(min_value=5, max_value=15),
    keyword_count=st.integers(min_value=10, max_value=30),
    confidence=st.floats(min_value=0.0, max_value=1.0, allow_nan=False),
)
def test_catalog_round_trip_fidelity(
    title, description_en, description_hi, category, subcategory,
    material, technique, care_instructions,
    hashtag_count, keyword_count, confidence,
):
    """
    Property 7: For all valid catalog outputs, JSON round-trip produces
    field-for-field identical objects (Req 6.8).
    """
    hashtags = [f"#tag{i}" for i in range(hashtag_count)]
    keywords = [f"keyword{i}" for i in range(keyword_count)]
    confidence_scores = ConfidenceScore(
        title=confidence,
        description=confidence,
        category=confidence,
        subcategory=confidence,
        material=confidence,
        technique=confidence,
        care_instructions=confidence,
    )

    original = CatalogOutput(
        title=title[:200],
        description_en=" ".join(description_en.split()[:400]),
        description_hi=description_hi,
        category=category,
        subcategory=subcategory,
        material=material,
        technique=technique,
        care_instructions=care_instructions,
        dimensions=None,
        hashtags=hashtags,
        keywords=keywords,
        confidence_scores=confidence_scores,
        review_required_fields=[],
    )

    # Serialize → deserialize
    json_str = original.model_dump_json()
    reparsed = CatalogOutput.model_validate_json(json_str)

    # Field-for-field equivalence (Req 6.8)
    assert original.title == reparsed.title
    assert original.description_en == reparsed.description_en
    assert original.description_hi == reparsed.description_hi
    assert original.category == reparsed.category
    assert original.subcategory == reparsed.subcategory
    assert original.material == reparsed.material
    assert original.technique == reparsed.technique
    assert original.care_instructions == reparsed.care_instructions
    assert original.hashtags == reparsed.hashtags
    assert original.keywords == reparsed.keywords
    assert original.model_dump() == reparsed.model_dump()


@settings(max_examples=100)
@given(
    hashtag_count=st.integers(min_value=5, max_value=15),
)
def test_hashtag_count_invariant(hashtag_count):
    """All hashtags are 5–15 items with # prefix."""
    hashtags = [f"#tag{i}" for i in range(hashtag_count)]
    output = CatalogOutput(
        title="Test Product",
        description_en="A " * 150,
        description_hi="एक उत्पाद",
        category="Handicrafts",
        subcategory="General",
        material="Cotton",
        technique="Weaving",
        care_instructions="Hand wash",
        hashtags=hashtags,
        keywords=[f"kw{i}" for i in range(10)],
        confidence_scores=ConfidenceScore(**{k: 0.9 for k in ['title','description','category','subcategory','material','technique','care_instructions']}),
    )
    assert 5 <= len(output.hashtags) <= 15
    for tag in output.hashtags:
        assert tag.startswith("#")
        assert " " not in tag
        assert tag == tag.lower()


if __name__ == "__main__":
    test_catalog_round_trip_fidelity()
    test_hashtag_count_invariant()
    print("All catalog property tests passed!")
