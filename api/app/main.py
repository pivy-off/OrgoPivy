from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
from typing import Any, Dict, List, Optional
import uuid
import json
import re
import os

from app.ingest import chunk_text, score, make_answer
from app.security import (
    limiter,
    SecurityHeadersMiddleware,
    RequestSizeLimitMiddleware,
    RateLimitMiddleware,
    sanitize_filename,
    validate_file_extension,
    validate_file_size,
    sanitize_string,
    validate_top_k,
    validate_course_id,
    validate_url,
    MAX_QUESTION_LENGTH,
    MAX_QUERY_LENGTH,
    MAX_TITLE_LENGTH,
)
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

app = FastAPI(title="OrgoPivy API", version="0.3.0")

# Add security middleware (order matters - add before CORS)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestSizeLimitMiddleware)
app.add_middleware(RateLimitMiddleware)

# Configure CORS with restricted settings
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],  # Only allow needed methods
    allow_headers=["Content-Type", "Authorization", "Accept"],  # Restrict headers but allow necessary ones
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Add rate limit exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "storage" / "uploads"
INDEX_DIR = BASE_DIR / "storage" / "index"
MANIFEST_PATH = BASE_DIR / "storage" / "uploads_manifest.json"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
INDEX_DIR.mkdir(parents=True, exist_ok=True)
( BASE_DIR / "storage" ).mkdir(parents=True, exist_ok=True)


def norm(s: Optional[str]) -> str:
    return (s or "").strip().lower()


def is_course_id(s: str) -> bool:
    return s in ["orgochem-1", "orgochem-2"]


def load_manifest() -> Dict[str, Any]:
    if not MANIFEST_PATH.exists():
        return {"items": []}
    try:
        return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except Exception:
        return {"items": []}


def save_manifest(m: Dict[str, Any]) -> None:
    MANIFEST_PATH.write_text(json.dumps(m, ensure_ascii=False, indent=2), encoding="utf-8")


def add_manifest_item(item: Dict[str, Any]) -> None:
    m = load_manifest()
    items = m.get("items", [])
    if not isinstance(items, list):
        items = []
    items.insert(0, item)
    m["items"] = items
    save_manifest(m)


def remove_manifest_item(upload_id: str) -> Optional[Dict[str, Any]]:
    m = load_manifest()
    items = m.get("items", [])
    if not isinstance(items, list):
        items = []
    kept: List[Dict[str, Any]] = []
    removed: Optional[Dict[str, Any]] = None
    for it in items:
        if str(it.get("upload_id")) == upload_id and removed is None:
            removed = it
        else:
            kept.append(it)
    m["items"] = kept
    save_manifest(m)
    return removed


def find_manifest_item(upload_id: str) -> Optional[Dict[str, Any]]:
    m = load_manifest()
    items = m.get("items", [])
    if not isinstance(items, list):
        return None
    for it in items:
        if str(it.get("upload_id")) == upload_id:
            return it
    return None


def build_index(upload_id: str, stored_filename: str, text: str, course: Optional[str], topic: Optional[str], source_url: Optional[str], source_title: Optional[str]) -> int:
    chunks = chunk_text(text)
    index_path = INDEX_DIR / f"{upload_id}.json"
    payload = {
        "upload_id": upload_id,
        "stored_filename": stored_filename,
        "chunk_count": len(chunks),
        "meta": {
            "course": norm(course) or None,
            "topic": norm(topic) or None,
            "source_url": (source_url or "").strip() or None,
            "source_title": (source_title or "").strip() or None,
        },
        "chunks": [{"id": i, "text": ch} for i, ch in enumerate(chunks)],
    }
    index_path.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    return len(chunks)


@app.get("/health")
@limiter.limit("100/minute")
def health(request: Request):
    return {"status": "ok"}


@app.post("/upload")
@limiter.limit("10/minute")  # Limit uploads to 10 per minute
async def upload(
    request: Request,
    file: UploadFile = File(...),
    course: Optional[str] = Query(default=None),
    topic: Optional[str] = Query(default=None),
    source_url: Optional[str] = Query(default=None),
    source_title: Optional[str] = Query(default=None),
):
    # Validate and sanitize inputs
    course_n = validate_course_id(course) if course else ""
    topic_n = sanitize_string(topic or "", max_length=100) if topic else ""
    source_url_sanitized = validate_url(source_url) if source_url else None
    source_title_sanitized = sanitize_string(source_title or "", max_length=MAX_TITLE_LENGTH) if source_title else None
    
    # Validate and sanitize filename
    original_filename = file.filename or "upload.txt"
    original_filename = sanitize_filename(original_filename)
    validate_file_extension(original_filename)
    
    # Validate file size before reading
    if hasattr(file, 'size') and file.size:
        validate_file_size(file.size)
    
    ext = Path(original_filename).suffix.lower() or ".txt"
    upload_id = uuid.uuid4().hex
    stored_filename = f"{upload_id}{ext}"
    dest = UPLOAD_DIR / stored_filename
    
    # Ensure destination is within upload directory (prevent path traversal)
    dest = dest.resolve()
    if not str(dest).startswith(str(UPLOAD_DIR.resolve())):
        raise HTTPException(status_code=400, detail="Invalid file path")

    content = await file.read()
    
    # Validate actual file size
    validate_file_size(len(content))
    
    # Write file
    dest.write_bytes(content)

    indexed = False
    chunk_count = 0

    if ext == ".txt":
        text = dest.read_text(encoding="utf-8", errors="ignore")
        chunk_count = build_index(
            upload_id=upload_id,
            stored_filename=stored_filename,
            text=text,
            course=course_n,
            topic=topic_n,
            source_url=source_url_sanitized,
            source_title=source_title_sanitized,
        )
        indexed = True

    add_manifest_item(
        {
            "upload_id": upload_id,
            "original_filename": original_filename,
            "stored_filename": stored_filename,
            "bytes": len(content),
            "course": course_n or None,
            "topic": topic_n or None,
            "source_url": source_url_sanitized,
            "source_title": source_title_sanitized,
            "indexed": indexed,
            "chunk_count": chunk_count,
        }
    )

    return {
        "upload_id": upload_id,
        "original_filename": original_filename,
        "stored_filename": stored_filename,
        "bytes": len(content),
        "indexed": indexed,
        "chunk_count": chunk_count,
    }


@app.get("/uploads")
@limiter.limit("60/minute")
def list_uploads(request: Request):
    m = load_manifest()
    items = m.get("items", [])
    if not isinstance(items, list):
        items = []

    cleaned: List[Dict[str, Any]] = []
    for it in items:
        upload_id = str(it.get("upload_id") or "")
        stored = str(it.get("stored_filename") or "")
        if not upload_id or not stored:
            continue
        path = UPLOAD_DIR / stored
        if not path.exists() or not path.is_file():
            continue
        cleaned.append(
            {
                "upload_id": upload_id,
                "original_filename": it.get("original_filename") or stored,
                "stored_filename": stored,
                "bytes": int(path.stat().st_size),
                "indexed": bool(it.get("indexed")),
                "chunk_count": int(it.get("chunk_count") or 0),
                "course": it.get("course"),
                "topic": it.get("topic"),
            }
        )

    return {"count": len(cleaned), "items": cleaned}


@app.delete("/uploads/{upload_id}")
@limiter.limit("30/minute")
def delete_upload(request: Request, upload_id: str):
    # Validate upload_id format (should be hex string)
    if not upload_id or not re.match(r'^[a-f0-9]{32}$', upload_id):
        raise HTTPException(status_code=400, detail="Invalid upload ID format")
    it = remove_manifest_item(upload_id)
    if not it:
        raise HTTPException(status_code=404, detail="Upload not found")

    stored = str(it.get("stored_filename") or "")
    if stored:
        p = UPLOAD_DIR / stored
        if p.exists() and p.is_file():
            try:
                p.unlink()
            except Exception:
                pass

    idx = INDEX_DIR / f"{upload_id}.json"
    if idx.exists() and idx.is_file():
        try:
            idx.unlink()
        except Exception:
            pass

    return {"deleted": True, "upload_id": upload_id}


@app.get("/uploads/{upload_id}/text")
@limiter.limit("60/minute")
def get_upload_text(request: Request, upload_id: str):
    # Validate upload_id format
    if not upload_id or not re.match(r'^[a-f0-9]{32}$', upload_id):
        raise HTTPException(status_code=400, detail="Invalid upload ID format")
    it = find_manifest_item(upload_id)
    if not it:
        raise HTTPException(status_code=404, detail="Upload not found")

    stored = str(it.get("stored_filename") or "")
    path = UPLOAD_DIR / stored
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    if path.suffix.lower() != ".txt":
        raise HTTPException(status_code=415, detail="Only .txt supported for preview")

    text = path.read_text(encoding="utf-8", errors="ignore")
    return {"upload_id": upload_id, "original_filename": it.get("original_filename"), "text": text}


def match_scope(meta: Dict[str, Any], course: str, topic: str) -> bool:
    mc = norm(meta.get("course"))
    mt = norm(meta.get("topic"))

    if course and mc != course:
        return False
    if topic and mt != topic:
        return False
    return True


def search_impl(q: str, k: int = 5, course: str = "", topic: str = "") -> Dict[str, Any]:
    q = q or ""
    course = norm(course)
    topic = norm(topic)

    if not q.strip():
        return {"q": q, "k": k, "course": course or None, "topic": topic or None, "results": []}

    results: List[Dict[str, Any]] = []

    for index_file in INDEX_DIR.glob("*.json"):
        data = json.loads(index_file.read_text(encoding="utf-8"))
        meta = data.get("meta", {}) or {}

        if (course or topic) and not match_scope(meta, course=course, topic=topic):
            continue

        upload_id = data.get("upload_id")
        stored_filename = data.get("stored_filename")

        for ch in data.get("chunks", []):
            s = score(q, ch["text"])
            if s > 0:
                results.append(
                    {
                        "upload_id": upload_id,
                        "stored_filename": stored_filename,
                        "chunk_id": ch["id"],
                        "score": s,
                        "text": ch["text"],
                        "meta": meta,
                    }
                )

    results.sort(key=lambda r: r["score"], reverse=True)
    return {"q": q, "k": k, "course": course or None, "topic": topic or None, "results": results[:k]}


@app.get("/search")
@limiter.limit("100/minute")
def search(
    request: Request,
    q: str = Query(..., min_length=1, max_length=MAX_QUERY_LENGTH),
    k: int = Query(5, ge=1, le=50),
    course: Optional[str] = Query(default=None),
    topic: Optional[str] = Query(default=None),
):
    # Validate and sanitize inputs
    query = sanitize_string(q, max_length=MAX_QUERY_LENGTH)
    top_k = validate_top_k(k)
    course_n = validate_course_id(course) if course else ""
    topic_n = sanitize_string(topic or "", max_length=100) if topic else ""
    
    return search_impl(q=query, k=top_k, course=course_n, topic=topic_n)


def looks_like_math_question(q: str) -> bool:
    s = (q or "").lower()
    if "mole" in s or "moles" in s:
        return True
    if "grams" in s or " g " in f" {s} ":
        return True
    if re.search(r"\b\d+(\.\d+)?\b", s):
        return True
    return False


def ask_impl(question: str, top_k: int = 5, course: str = "", topic: str = "") -> Dict[str, Any]:
    question = question or ""
    course = norm(course)
    topic = norm(topic)

    if not question.strip():
        return {"answer": "", "contexts": [], "course": course or None, "topic": topic or None}

    search_payload = search_impl(q=question, k=top_k, course=course, topic=topic)
    results = search_payload.get("results", [])

    top_score = 0.0
    if results and isinstance(results[0], dict):
        try:
            top_score = float(results[0].get("score", 0.0))
        except Exception:
            top_score = 0.0

    if looks_like_math_question(question) and (not results or top_score < 0.2):
        return {
            "answer": "This looks like a calculation question Add a formulas notes txt and upload it Then ask again",
            "contexts": [],
            "course": course or None,
            "topic": topic or None,
        }

    answer = make_answer(question, results, max_sentences=5)

    contexts: List[Dict[str, Any]] = []
    for r in results:
        snippet = r["text"].strip().replace("\n", " ")
        contexts.append(
            {
                "upload_id": r.get("upload_id"),
                "chunk_id": r.get("chunk_id"),
                "score": r.get("score"),
                "snippet": snippet[:260],
                "meta": r.get("meta", {}) or {},
            }
        )

    return {"answer": answer, "contexts": contexts, "course": course or None, "topic": topic or None}


@app.get("/ask")
@limiter.limit("60/minute")
def ask_get(
    request: Request,
    q: str = Query(..., min_length=1, max_length=MAX_QUESTION_LENGTH),
    k: int = Query(5, ge=1, le=50),
    course: Optional[str] = Query(default=None),
    topic: Optional[str] = Query(default=None),
):
    # Validate and sanitize inputs
    question = sanitize_string(q, max_length=MAX_QUESTION_LENGTH)
    top_k = validate_top_k(k)
    course_n = validate_course_id(course) if course else ""
    topic_n = sanitize_string(topic or "", max_length=100) if topic else ""
    
    return ask_impl(question=question, top_k=top_k, course=course_n, topic=topic_n)


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=MAX_QUESTION_LENGTH)
    top_k: int = Field(5, ge=1, le=50)
    course: Optional[str] = Field(None, max_length=50)
    topic: Optional[str] = Field(None, max_length=100)


@app.post("/ask")
@limiter.limit("60/minute")
def ask_post(request: Request, req: AskRequest):
    # Validate and sanitize inputs
    question = sanitize_string(req.question, max_length=MAX_QUESTION_LENGTH)
    top_k = validate_top_k(req.top_k)
    course_n = validate_course_id(req.course) if req.course else ""
    topic_n = sanitize_string(req.topic or "", max_length=100) if req.topic else ""
    
    return ask_impl(
        question=question,
        top_k=top_k,
        course=course_n,
        topic=topic_n,
    )


PRACTICE_EXAMS_DIR = BASE_DIR / "storage" / "practice_exams"


@app.get("/practice-exams")
@limiter.limit("60/minute")
def list_practice_exams(request: Request):
    """List available practice exam files"""
    if not PRACTICE_EXAMS_DIR.exists():
        return {"count": 0, "items": []}
    
    items = []
    for file_path in PRACTICE_EXAMS_DIR.iterdir():
        if file_path.is_file() and file_path.suffix.lower() == ".txt":
            try:
                content = file_path.read_text(encoding="utf-8", errors="ignore")
                items.append({
                    "filename": file_path.name,
                    "stem": file_path.stem,
                    "size": len(content),
                    "preview": content[:500] if len(content) > 500 else content,
                })
            except Exception:
                continue
    
    return {"count": len(items), "items": items}


@app.get("/practice-exams/{filename}")
@limiter.limit("60/minute")
def get_practice_exam(request: Request, filename: str):
    """Get content of a practice exam file"""
    # Sanitize filename to prevent path traversal
    filename = sanitize_filename(filename)
    if not filename.endswith(".txt"):
        filename = f"{filename}.txt"
    
    file_path = PRACTICE_EXAMS_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Practice exam not found")
    
    # Ensure file is within practice_exams directory
    file_path = file_path.resolve()
    if not str(file_path).startswith(str(PRACTICE_EXAMS_DIR.resolve())):
        raise HTTPException(status_code=400, detail="Invalid file path")
    
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
        return {
            "filename": filename,
            "content": content,
            "size": len(content),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")
