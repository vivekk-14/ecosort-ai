import os
import logging
from dotenv import load_dotenv
from app.providers.base import BaseAIProvider
from app.providers.mock_provider import MockHeuristicAIProvider
from app.providers.gemini_provider import GeminiMultimodalProvider

load_dotenv()

logger = logging.getLogger("ecosort.ai_service")


def get_ai_provider() -> BaseAIProvider:
    """
    Factory function returning the configured AI provider.
    Vendor-agnostic: easily swap providers by updating .env.
    """
    provider_choice = os.getenv("AI_PROVIDER", "gemini").lower().strip()
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    model_name = os.getenv("AI_MODEL", "gemini-1.5-flash").strip()

    if provider_choice == "gemini" and gemini_key:
        logger.info(f"Using Gemini Multimodal AI Provider with model: {model_name}")
        return GeminiMultimodalProvider(api_key=gemini_key, model_name=model_name)

    if provider_choice == "gemini" and not gemini_key:
        logger.warning(
            "GEMINI_API_KEY is empty in backend/.env. "
            "Falling back to built-in Offline Heuristic AI Provider so you can test seamlessly!"
        )
        return MockHeuristicAIProvider()

    # Default fallback
    logger.info("Using Built-in Offline Heuristic AI Provider.")
    return MockHeuristicAIProvider()
