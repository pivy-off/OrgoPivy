# OrgoPivy API Security Implementation

## Overview
This document outlines the security measures implemented in the OrgoPivy API to protect against common vulnerabilities and attacks.

## Security Features

### 1. Rate Limiting
- **Implementation**: Using `slowapi` for rate limiting
- **Limits**:
  - Health endpoint: 100 requests/minute
  - Upload endpoint: 10 requests/minute
  - Search endpoint: 100 requests/minute
  - Ask endpoint: 60 requests/minute
  - List/Get uploads: 60 requests/minute
  - Delete uploads: 30 requests/minute
  - Default: 200 requests/hour per IP address
- **Rate limit headers**: Exposed in responses (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)

### 2. Security Headers
All responses include the following security headers:
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-XSS-Protection: 1; mode=block` - Enables XSS filtering
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts browser features (geolocation, microphone, camera)

### 3. CORS Configuration
- **Restricted origins**: Configurable via `ALLOWED_ORIGINS` environment variable
- **Default**: `http://localhost:3000,http://127.0.0.1:3000`
- **Allowed methods**: GET, POST, DELETE only
- **Allowed headers**: Content-Type, Authorization, Accept
- **Credentials**: Enabled for authenticated requests
- **Preflight caching**: 1 hour

### 4. File Upload Security
- **File size limit**: 10MB maximum
- **Allowed file types**: `.txt` only
- **Filename sanitization**: 
  - Removes path traversal attempts
  - Removes dangerous characters
  - Limits filename length to 255 characters
- **Path traversal protection**: Validates file paths are within upload directory
- **Request size limit**: 15MB maximum request body size

### 5. Input Validation & Sanitization
- **Query parameters**: 
  - Maximum length: 1000 characters (queries), 2000 characters (questions)
  - Sanitized to remove null bytes and control characters
- **Course ID validation**: Only accepts "orgochem-1" or "orgochem-2"
- **URL validation**: Must start with http:// or https://, max 2048 characters
- **Title validation**: Maximum 500 characters
- **Topic validation**: Maximum 100 characters
- **Top-K parameter**: Clamped between 1 and 50
- **Upload ID validation**: Must be 32-character hex string

### 6. Request Size Limits
- **Request body**: 15MB maximum
- **File uploads**: 10MB maximum
- Validated before processing to prevent DoS attacks

### 7. Error Handling
- **Generic error messages**: Prevents information leakage
- **Proper HTTP status codes**: 400 (Bad Request), 404 (Not Found), 413 (Payload Too Large), 415 (Unsupported Media Type)
- **Rate limit errors**: Properly handled with 429 status code

## Configuration

### Environment Variables
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins (default: localhost origins)

### Security Constants
Located in `api/app/security.py`:
- `MAX_FILE_SIZE`: 10MB
- `MAX_QUERY_LENGTH`: 1000 characters
- `MAX_QUESTION_LENGTH`: 2000 characters
- `MAX_TOP_K`: 50
- `MAX_FILENAME_LENGTH`: 255 characters
- `MAX_URL_LENGTH`: 2048 characters
- `MAX_TITLE_LENGTH`: 500 characters

## Dependencies
All security-related dependencies are listed in `api/requirements.txt`:
- `slowapi>=0.1.9` - Rate limiting
- `fastapi>=0.115.0` - Web framework with built-in security features
- `pydantic>=2.9.0` - Input validation

## Best Practices Implemented
1. ✅ Input validation on all endpoints
2. ✅ Output sanitization
3. ✅ Path traversal protection
4. ✅ File type and size validation
5. ✅ Rate limiting to prevent abuse
6. ✅ Security headers for defense in depth
7. ✅ CORS restrictions
8. ✅ Request size limits
9. ✅ Proper error handling without information leakage
10. ✅ UUID-based file storage (prevents filename guessing)

## Testing Recommendations
1. Test rate limiting by making rapid requests
2. Test file upload with various file types and sizes
3. Test path traversal attempts (e.g., `../../../etc/passwd`)
4. Test input validation with malicious payloads
5. Test CORS with different origins
6. Verify security headers are present in all responses
