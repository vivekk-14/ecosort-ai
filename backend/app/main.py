import os
import logging
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.schemas import WasteAnalysisResult, HealthCheckResponse
from app.utils import validate_and_process_image
from app.ai_service import get_ai_provider
from app.providers.base import BaseAIProvider

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ecosort.main")

app = FastAPI(
    title="EcoSort AI Backend",
    description="REST API for AI-powered waste segregation and disposal guidance adhering to SDG 12 & SDG 11.",
    version="1.0.0"
)

# CORS Configuration - permits React frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development and demonstration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["General"])
async def root():
    return {
        "project": "EcoSort AI",
        "description": "AI-Powered Waste Segregation & Disposal Assistant",
        "sdg_alignment": ["SDG 12: Responsible Consumption and Production", "SDG 11: Sustainable Cities"],
        "docs_url": "/docs",
        "health_check": "/api/health"
    }


@app.get("/api/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check(ai_provider: BaseAIProvider = Depends(get_ai_provider)):
    return HealthCheckResponse(
        status="healthy",
        service="EcoSort AI REST API",
        ai_provider=ai_provider.provider_name,
        model=ai_provider.model_name
    )


@app.post("/api/analyze", response_model=WasteAnalysisResult, tags=["Waste Segregation"])
async def analyze_waste(
    file: Optional[UploadFile] = File(None),
    text_prompt: Optional[str] = Form(None),
    ai_provider: BaseAIProvider = Depends(get_ai_provider)
):
    """
    Primary waste analysis endpoint.
    Accepts an uploaded image file, a text description, or both.
    Zero-storage: Image bytes are processed transiently in memory without being written to disk.
    """
    logger.info(f"Incoming /api/analyze request. File: {file.filename if file else 'None'}, Text: {text_prompt[:50] if text_prompt else 'None'}")

    # Validation: user must provide at least one input method
    has_file = file is not None and file.filename != ""
    has_text = text_prompt is not None and text_prompt.strip() != ""

    if not has_file and not has_text:
        raise HTTPException(
            status_code=400,
            detail="Please provide either a waste image file or a text description to analyze."
        )

    image_bytes = None
    mime_type = None

    if has_file:
        image_bytes, mime_type = await validate_and_process_image(file)
        logger.info(f"Image validated successfully ({len(image_bytes)} bytes, {mime_type})")

    # Delegate to active AI provider
    try:
        result = await ai_provider.analyze(
            image_bytes=image_bytes,
            mime_type=mime_type,
            text_prompt=text_prompt
        )
        logger.info(f"Analysis completed: '{result.detected_item}' -> Category: '{result.waste_category}' (Confidence: {result.confidence})")
        return result
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error during AI analysis: {str(exc)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error executing AI waste classification: {str(exc)}"
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
