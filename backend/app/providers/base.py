from abc import ABC, abstractmethod
from typing import Optional
from app.schemas import WasteAnalysisResult


class BaseAIProvider(ABC):
    """
    Abstract AI Provider Interface.
    Enables vendor-neutral AI swapping (Gemini, OpenAI, Anthropic, or local models).
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the active provider."""
        pass

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Name of the model being invoked."""
        pass

    @abstractmethod
    async def analyze(
        self,
        image_bytes: Optional[bytes] = None,
        mime_type: Optional[str] = None,
        text_prompt: Optional[str] = None
    ) -> WasteAnalysisResult:
        """
        Analyze the given waste input (image and/or text) and return
        a strictly-validated WasteAnalysisResult instance.
        """
        pass
