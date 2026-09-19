import os
import json
import base64
import logging
import requests
from typing import Optional
from fastapi import HTTPException
from app.providers.base import BaseAIProvider
from app.schemas import WasteAnalysisResult, WasteCategory
from app.providers.mock_provider import MockHeuristicAIProvider

logger = logging.getLogger("ecosort.gemini")

SYSTEM_PROMPT = """You are EcoSort AI, an expert waste segregation and environmental sustainability assistant.
Analyze the provided waste image and/or text description and classify it strictly into ONE of these allowed categories:
- "Wet / Organic"
- "Dry / Recyclable"
- "E-Waste"
- "Hazardous / Special"
- "General / Non-recyclable"
- "Uncertain"

Responsible AI guidelines:
1. If the item is ambiguous, blurred, or has mixed unidentifiable contents, set waste_category to "Uncertain" with low confidence (< 0.60).
2. For Hazardous items (batteries, chemicals, paint, medical waste, fluorescent lamps), recommend authorized municipal hazardous drop-off centers. Never give dangerous handling instructions.
3. Include an actionable sustainability tip promoting waste reduction, reuse, or circular alternatives (SDG 12).
4. Always conclude safety_note with a reminder that local municipal regulations take priority.

Output ONLY valid JSON matching this schema:
{
  "detected_item": "String naming the specific waste object",
  "material": "String identifying primary material composition",
  "waste_category": "One of the 6 allowed categories exactly",
  "confidence": 0.95,
  "disposal_guidance": "Step-by-step actionable disposal steps",
  "explanation": "Why this item belongs in this category and recycling/decomposition implications",
  "sustainability_tip": "Practical tip for prevention, reduction or reuse aligned with SDG 12",
  "safety_note": "Safety precautions and municipal precedence notice"
}"""


class GeminiMultimodalProvider(BaseAIProvider):
    """
    Multimodal Gemini API Provider.
    Supports multimodal inputs (image + text) with automatic fallback and retry.
    """

    def __init__(self, api_key: str, model_name: str = "gemini-flash-lite-latest"):
        self.api_key = api_key
        self._model_name = model_name
        self._fallback = MockHeuristicAIProvider()

    @property
    def provider_name(self) -> str:
        return f"Google Gemini Multimodal ({self._model_name})"

    @property
    def model_name(self) -> str:
        return self._model_name

    async def analyze(
        self,
        image_bytes: Optional[bytes] = None,
        mime_type: Optional[str] = None,
        text_prompt: Optional[str] = None
    ) -> WasteAnalysisResult:
        if not self.api_key:
            return await self._fallback.analyze(image_bytes, mime_type, text_prompt)

        # Prepare multimodal request parts
        parts = [{"text": SYSTEM_PROMPT}]

        if text_prompt and text_prompt.strip():
            parts.append({"text": f"User description of waste item: {text_prompt.strip()}"})

        if image_bytes:
            encoded_image = base64.b64encode(image_bytes).decode("utf-8")
            parts.append({
                "inline_data": {
                    "mime_type": mime_type or "image/jpeg",
                    "data": encoded_image
                }
            })

        if not text_prompt and not image_bytes:
            raise HTTPException(status_code=400, detail="No waste image or text provided.")

        payload = {
            "contents": [{"parts": parts}],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        # Models to attempt in order (resilience against Google temporary 503 load spikes)
        models_to_try = [self._model_name]
        if "lite" in self._model_name:
            models_to_try.append("gemini-flash-latest")
        else:
            models_to_try.append("gemini-flash-lite-latest")

        last_error = None

        for model in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
            try:
                response = requests.post(
                    url,
                    headers={"Content-Type": "application/json"},
                    json=payload,
                    timeout=20
                )

                if response.status_code == 200:
                    res_data = response.json()
                    candidates = res_data.get("candidates", [])
                    if candidates:
                        text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        cleaned_text = text_content.strip()
                        if cleaned_text.startswith("```json"):
                            cleaned_text = cleaned_text[7:]
                        if cleaned_text.startswith("```"):
                            cleaned_text = cleaned_text[3:]
                        if cleaned_text.endswith("```"):
                            cleaned_text = cleaned_text[:-3]
                        cleaned_text = cleaned_text.strip()

                        parsed = json.loads(cleaned_text)

                        cat = parsed.get("waste_category", "Uncertain")
                        valid_cats = [c.value for c in WasteCategory]
                        if cat not in valid_cats:
                            cat = "Uncertain"

                        return WasteAnalysisResult(
                            detected_item=parsed.get("detected_item", "Unidentified Item"),
                            material=parsed.get("material", "Mixed / Unknown"),
                            waste_category=cat,
                            confidence=float(parsed.get("confidence", 0.85)),
                            disposal_guidance=parsed.get("disposal_guidance", "Follow municipal waste guidance."),
                            explanation=parsed.get("explanation", "Classified based on visual/textual analysis."),
                            sustainability_tip=parsed.get("sustainability_tip", "Reduce single-use consumption."),
                            safety_note=parsed.get("safety_note", "Disposal rules vary by location. Follow your local municipality's waste-management guidelines.")
                        )

                logger.warning(f"Model {model} returned status {response.status_code}: {response.text[:150]}")
                last_error = f"HTTP {response.status_code}"

            except Exception as e:
                logger.warning(f"Model {model} request failed: {str(e)}")
                last_error = str(e)

        # If both models fail due to upstream quota/load spikes, gracefully fallback to heuristic
        logger.warning(f"External AI models temporarily busy ({last_error}). Falling back to Heuristic provider.")
        return await self._fallback.analyze(image_bytes, mime_type, text_prompt)
