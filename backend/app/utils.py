import io
from PIL import Image
from fastapi import HTTPException, UploadFile

ALLOWED_IMAGE_FORMATS = {"JPEG", "PNG", "WEBP", "MPO", "BMP"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


async def validate_and_process_image(file: UploadFile) -> tuple[bytes, str]:
    """
    Validates uploaded image using Pillow.
    Ensures:
    1. File size is within limits (<5MB).
    2. Format is a valid image (JPEG, PNG, WEBP, etc.).
    3. Image is not corrupted.
    Returns:
        (image_bytes, mime_type)
    """
    # Read file bytes in-memory (zero disk storage for privacy)
    content = await file.read()

    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum supported size is {MAX_FILE_SIZE // (1024 * 1024)}MB."
        )

    try:
        # Verify image using Pillow
        image = Image.open(io.BytesIO(content))
        image.verify()  # Verifies file integrity

        # Re-open for format and dimension check (verify clears some internals)
        image = Image.open(io.BytesIO(content))
        image_format = image.format

        if image_format not in ALLOWED_IMAGE_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image format: '{image_format}'. Please upload JPG, PNG, or WEBP."
            )

        mime_type = file.content_type or f"image/{image_format.lower()}"
        return content, mime_type

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid or corrupted image file: {str(e)}"
        )
