"""
Security middleware and utilities for OrgoPivy API
"""
from fastapi import Request, HTTPException, status
from fastapi.responses import Response, JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from typing import Callable
import re
from pathlib import Path

# Rate limiter instance
limiter = Limiter(key_func=get_remote_address, default_limits=["200/hour"])


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware to integrate slowapi rate limiter with FastAPI"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Rate limiting is handled by decorators, but we ensure limiter state is available
        if not hasattr(request.app.state, "limiter"):
            request.app.state.limiter = limiter
        return await call_next(request)

# Security configuration constants
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_FILE_EXTENSIONS = {".txt"}
MAX_QUERY_LENGTH = 1000
MAX_QUESTION_LENGTH = 2000
MAX_TOP_K = 50
MAX_FILENAME_LENGTH = 255
MAX_URL_LENGTH = 2048
MAX_TITLE_LENGTH = 500


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Remove server header (optional, but good practice)
        if "server" in response.headers:
            del response.headers["server"]
        
        return response


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    """Limit request body size"""
    
    MAX_BODY_SIZE = 15 * 1024 * 1024  # 15MB
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if request.method in ["POST", "PUT", "PATCH"]:
            content_length = request.headers.get("content-length")
            if content_length:
                try:
                    size = int(content_length)
                    if size > self.MAX_BODY_SIZE:
                        raise HTTPException(
                            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail=f"Request body too large. Maximum size: {self.MAX_BODY_SIZE // (1024*1024)}MB"
                        )
                except ValueError:
                    pass
        
        return await call_next(request)


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal attacks"""
    if not filename:
        return "upload.txt"
    
    # Remove path components
    filename = Path(filename).name
    
    # Limit length
    if len(filename) > MAX_FILENAME_LENGTH:
        name, ext = Path(filename).stem, Path(filename).suffix
        filename = name[:MAX_FILENAME_LENGTH - len(ext)] + ext
    
    # Remove dangerous characters
    filename = re.sub(r'[<>:"|?*\x00-\x1f]', '', filename)
    
    # Ensure it's not empty
    if not filename or filename.strip() == "":
        return "upload.txt"
    
    return filename


def validate_file_extension(filename: str) -> None:
    """Validate that file extension is allowed"""
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_FILE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_FILE_EXTENSIONS)}"
        )


def validate_file_size(size: int) -> None:
    """Validate file size"""
    if size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )


def sanitize_string(value: str, max_length: int = MAX_QUERY_LENGTH) -> str:
    """Sanitize and validate string input"""
    if not value:
        return ""
    
    # Trim whitespace
    value = value.strip()
    
    # Check length
    if len(value) > max_length:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Input too long. Maximum length: {max_length} characters"
        )
    
    # Remove null bytes and control characters (except newlines and tabs for text)
    value = re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f]', '', value)
    
    return value


def validate_top_k(value: int) -> int:
    """Validate and clamp top_k parameter"""
    if value < 1:
        return 1
    if value > MAX_TOP_K:
        return MAX_TOP_K
    return value


def validate_course_id(course: str) -> str:
    """Validate course ID"""
    course_norm = (course or "").strip().lower()
    if course_norm and course_norm not in ["orgochem-1", "orgochem-2"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course id. Use 'orgochem-1' or 'orgochem-2'"
        )
    return course_norm


def validate_url(url: str) -> str:
    """Validate and sanitize URL"""
    if not url:
        return ""
    
    url = url.strip()
    
    if len(url) > MAX_URL_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"URL too long. Maximum length: {MAX_URL_LENGTH} characters"
        )
    
    # Basic URL validation
    if url and not (url.startswith("http://") or url.startswith("https://")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid URL format. Must start with http:// or https://"
        )
    
    return url
