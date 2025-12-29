from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from typing import Any, Dict, List
import uuid
import json
import re

from app.ingest import chunk_text, score, make_answer

app = FastAPI(title="OrgoPivy API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "storage" / "uploads"
INDEX_DIR = BASE_DIR / "storage" / "index"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
INDEX_DIR.mkdir(parents=True, exist_ok=True)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix.lower() or ".txt"
    safe_name = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / safe_name

    content = await file.read()
    dest.write_bytes(content)

    return {
        "original_filename": file.filename,
        "stored_filename": safe_name,
        "bytes": len(content),
    }


@app.get("/uploads")
def list_uploads():
    items = []
    for p in sorted(UPLOAD_DIR.glob("*")):
        if p.is_file():
            items.append({"stored_filename": p.name, "bytes": p.stat().st_size})
    return {"count": len(items), "items": items}


@app.get("/uploads/{stored_filename}/text")
def get_upload_text(stored_filename: str):
    path = UPLOAD_DIR / stored_filename
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    if path.suffix.lower() != ".txt":
        raise HTTPException(status_code=415, detail="Only .txt supported for now")
    text = path.read_text(encoding="utf-8", errors="ignore")
    return {"stored_filename": stored_filename, "text": text}


@app.post("/uploads/{stored_filename}/ingest")
def ingest_upload(stored_filename: str):
    path = UPLOAD_DIR / stored_filename
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    if path.suffix.lower() != ".txt":
        raise HTTPException(status_code=415, detail="Only .txt supported for now")

    text = path.read_text(encoding="utf-8", errors="ignore")
    chunks = chunk_text(text)

    index_path = INDEX_DIR / f"{stored_filename}.json"
    payload = {
        "stored_filename": stored_filename,
        "chunk_count": len(chunks),
        "chunks": [{"id": i, "text": ch} for i, ch in enumerate(chunks)],
    }
    index_path.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")

    return {"stored_filename": stored_filename, "chunk_count": len(chunks)}


def search_impl(q: str, k: int = 5) -> Dict[str, Any]:
    if not q.strip():
        return {"q": q, "k": k, "results": []}

    results: List[Dict[str, Any]] = []
    for index_file in INDEX_DIR.glob("*.json"):
        data = json.loads(index_file.read_text(encoding="utf-8"))
        stored_filename = data.get("stored_filename")
        for ch in data.get("chunks", []):
            s = score(q, ch["text"])
            if s > 0:
                results.append(
                    {
                        "stored_filename": stored_filename,
                        "chunk_id": ch["id"],
                        "score": s,
                        "text": ch["text"],
                    }
                )

    results.sort(key=lambda r: r["score"], reverse=True)
    return {"q": q, "k": k, "results": results[:k]}


@app.get("/search")
def search(q: str, k: int = 5):
    return search_impl(q=q, k=k)


def looks_like_math_question(q: str) -> bool:
    s = q.lower()
    if "mole" in s or "moles" in s:
        return True
    if "grams" in s or " g " in f" {s} ":
        return True
    if re.search(r"\b\d+(\.\d+)?\b", s):
        return True
    return False


def ask_impl(question: str, top_k: int = 5) -> Dict[str, Any]:
    if not question.strip():
        return {"answer": "", "contexts": []}

    search_payload = search_impl(q=question, k=top_k)
    results = search_payload.get("results", [])

    top_score = 0.0
    if results and isinstance(results[0], dict):
        try:
            top_score = float(results[0].get("score", 0.0))
        except Exception:
            top_score = 0.0

    if looks_like_math_question(question) and (not results or top_score < 0.2):
        return {
            "answer": "This looks like a calculation question. OrgoPivy answers from ingested notes. Add a chemistry formulas notes file and ingest it, or build a calculator endpoint for these.",
            "contexts": [],
        }

    answer = make_answer(question, results, max_sentences=5)

    contexts: List[Dict[str, Any]] = []
    for r in results:
        snippet = r["text"].strip().replace("\n", " ")
        contexts.append(
            {
                "stored_filename": r["stored_filename"],
                "chunk_id": r["chunk_id"],
                "score": r["score"],
                "snippet": snippet[:220],
            }
        )

    return {"answer": answer, "contexts": contexts}


@app.get("/ask")
def ask_get(q: str, k: int = 5):
    return ask_impl(question=q, top_k=k)


class AskRequest(BaseModel):
    question: str
    top_k: int = 5


@app.post("/ask")
def ask_post(req: AskRequest):
    return ask_impl(question=req.question, top_k=req.top_k)
