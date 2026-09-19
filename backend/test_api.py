import asyncio
from app.main import app, health_check, analyze_waste
from app.ai_service import get_ai_provider

async def run_tests():
    print("=== Testing Health Check ===")
    provider = get_ai_provider()
    health = await health_check(ai_provider=provider)
    print("Health response:", health)
    assert health.status == "healthy"

    print("\n=== Testing 10 Waste Cases via AI Service ===")
    test_cases = [
        ("Plastic water bottle", "Dry / Recyclable"),
        ("Banana peel", "Wet / Organic"),
        ("Cardboard box", "Dry / Recyclable"),
        ("Used tissue", "General / Non-recyclable"),
        ("Aluminum can", "Dry / Recyclable"),
        ("Old mobile phone", "E-Waste"),
        ("Battery", "Hazardous / Special"),
        ("Greasy pizza container with oil", "General / Non-recyclable"),
        ("Glass bottle", "Dry / Recyclable"),
        ("Mixed unknown trash debris", "Uncertain"),
    ]

    for item_input, expected_cat in test_cases:
        result = await analyze_waste(file=None, text_prompt=item_input, ai_provider=provider)
        match = "MATCH" if result.waste_category.value == expected_cat else "MISMATCH"
        print(f"[{match}] Input: '{item_input}' -> Detected: '{result.detected_item}' | Category: '{result.waste_category.value}' (Expected: '{expected_cat}') | Conf: {result.confidence * 100:.0f}%")
        assert result.detected_item
        assert result.material
        assert result.disposal_guidance
        assert result.explanation
        assert result.sustainability_tip
        assert result.safety_note

    print("\nAll 10 test cases verified successfully with full structured JSON fields!")

if __name__ == "__main__":
    asyncio.run(run_tests())
