from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional


class WasteCategory(str, Enum):
    WET_ORGANIC = "Wet / Organic"
    DRY_RECYCLABLE = "Dry / Recyclable"
    E_WASTE = "E-Waste"
    HAZARDOUS_SPECIAL = "Hazardous / Special"
    GENERAL_NON_RECYCLABLE = "General / Non-recyclable"
    UNCERTAIN = "Uncertain"


class WasteAnalysisResult(BaseModel):
    detected_item: str = Field(
        ...,
        description="Name of the detected waste item, e.g. 'Plastic Water Bottle'"
    )
    material: str = Field(
        ...,
        description="Material composition, e.g. 'PET Plastic' or 'Organic matter'"
    )
    waste_category: WasteCategory = Field(
        ...,
        description="Categorization matching the exact allowed bins"
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence level between 0.0 and 1.0"
    )
    disposal_guidance: str = Field(
        ...,
        description="Actionable disposal guidance for the user"
    )
    explanation: str = Field(
        ...,
        description="Short technical or logistical explanation for this classification"
    )
    sustainability_tip: str = Field(
        ...,
        description="Tip to reduce waste or adopt reusable circular alternatives (SDG 12)"
    )
    safety_note: str = Field(
        ...,
        description="Safety warning and local rules priority notice"
    )


class HealthCheckResponse(BaseModel):
    status: str
    service: str
    ai_provider: str
    model: str
