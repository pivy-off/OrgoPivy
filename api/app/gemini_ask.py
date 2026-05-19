"""
Gemini-backed study endpoints. Uses REST (urllib) — no extra Python deps.
"""
from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any, Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/gemini", tags=["gemini"])

_MODEL = "gemini-1.5-flash"
_GEN_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{_MODEL}:generateContent"
)

# session_token -> count (resets on restart)
_ask_counts: dict[str, int] = {}
_MAX_ASK_PER_SESSION = 20


class ChatTurn(BaseModel):
    role: Literal["user", "model"]
    content: str


class AskBody(BaseModel):
    question: str
    topic_slug: str
    course: Literal["orgochem-1", "orgochem-2"]
    context_chunks: list[str] = Field(default_factory=list)
    history: list[ChatTurn] = Field(default_factory=list)
    session_token: str
    # Client supplies curriculum fields (not in original minimal spec but required for tutor quality)
    topic_title: str | None = None
    topic_summary: str | None = None
    must_know_concepts: list[str] | None = None
    common_mistakes: list[str] | None = None
    suggested_video_url: str | None = None


class TopicContextBody(BaseModel):
    topic_slug: str
    course: Literal["orgochem-1", "orgochem-2"]
    session_token: str = ""
    topic_title: str | None = None
    topic_summary: str | None = None
    must_know_concepts: list[str] | None = None
    common_mistakes: list[str] | None = None
    context_chunks: list[str] = Field(default_factory=list)


class StudyGuideBody(TopicContextBody):
    pass


class AudioBriefBody(TopicContextBody):
    pass


class FreshQuestionsBody(TopicContextBody):
    pass


class ExplainMistakeBody(BaseModel):
    topic_slug: str
    course: Literal["orgochem-1", "orgochem-2"]
    session_token: str = ""
    question: str
    wrong_answer: str
    correct_answer: str
    topic_title: str | None = None


def _api_key() -> str:
    key = (os.environ.get("GEMINI_API_KEY") or "").strip()
    if not key:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY is not configured on the server.",
        )
    return key


def _gemini_post(
    *,
    system_instruction: str,
    contents: list[dict[str, Any]],
    response_mime_type: str | None = None,
    temperature: float = 0.4,
) -> str:
    body: dict[str, Any] = {
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "contents": contents,
        "generationConfig": {
            "temperature": temperature,
            "topP": 0.95,
            "maxOutputTokens": 8192,
        },
    }
    if response_mime_type:
        body["generationConfig"]["responseMimeType"] = response_mime_type

    data = json.dumps(body).encode("utf-8")
    url = f"{_GEN_URL}?key={_api_key()}"
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            err_body = e.read().decode("utf-8", errors="replace")
        except Exception:
            err_body = str(e)
        raise HTTPException(status_code=502, detail=f"Gemini HTTP error: {e.code} {err_body}") from e
    except urllib.error.URLError as e:
        raise HTTPException(status_code=502, detail=f"Gemini network error: {e!s}") from e

    try:
        parts = raw["candidates"][0]["content"]["parts"]
        return "".join(p.get("text", "") for p in parts)
    except (KeyError, IndexError, TypeError) as e:
        raise HTTPException(status_code=502, detail="Unexpected Gemini response shape") from e


def _fmt_list(xs: list[str] | None, fallback: str = "(none provided)") -> str:
    if not xs:
        return fallback
    return "\n".join(f"- {x}" for x in xs)


def _build_tutor_system_prompt(
    *,
    topic_title: str,
    topic_summary: str,
    must_know: str,
    mistakes: str,
    chunks: str,
) -> str:
    return (
        "You are an expert organic chemistry tutor for CHM 222 at Berea College (Dr. Garrett). "
        f"You are helping a student study {topic_title}. "
        f"You have access to:\n"
        f"TOPIC_SUMMARY:\n{topic_summary}\n\n"
        f"MUST_KNOW_CONCEPTS:\n{must_know}\n\n"
        f"COMMON_MISTAKES:\n{mistakes}\n\n"
        f"CONTEXT_CHUNKS:\n{chunks}\n\n"
        "Rules: Use correct IUPAC nomenclature. Reference reagents and mechanisms by name. "
        "For reactions describe: reactants → conditions → product → mechanism type. "
        "Correct misconceptions gently. Keep answers under 250 words unless mechanism needs more. "
        "Never fabricate reactions. If asked for a practice problem, generate one with 4 multiple choice "
        "options and explain after."
    )


def _topic_title_default(slug: str, title: str | None) -> str:
    return (title or "").strip() or slug.replace("-", " ").title()


@router.post("/ask")
def gemini_ask(body: AskBody) -> dict[str, Any]:
    token = (body.session_token or "anonymous").strip() or "anonymous"
    used = _ask_counts.get(token, 0)
    if used >= _MAX_ASK_PER_SESSION:
        raise HTTPException(
            status_code=429,
            detail="Session limit reached. Upload your notes to unlock more questions.",
        )

    title = _topic_title_default(body.topic_slug, body.topic_title)
    summary = (body.topic_summary or "").strip() or "Summary not provided for this topic."
    must = _fmt_list(body.must_know_concepts)
    mistakes = _fmt_list(body.common_mistakes)
    chunks = _fmt_list(body.context_chunks, "(no uploaded chunks)")

    system = _build_tutor_system_prompt(
        topic_title=title,
        topic_summary=summary,
        must_know=must,
        mistakes=mistakes,
        chunks=chunks,
    )

    contents: list[dict[str, Any]] = []
    for turn in body.history:
        role = "user" if turn.role == "user" else "model"
        contents.append({"role": role, "parts": [{"text": turn.content}]})
    contents.append({"role": "user", "parts": [{"text": body.question.strip()}]})

    json_schema_hint = (
        "Respond with JSON only (no markdown fences) matching this shape:\n"
        '{"answer": string, "confidence": "high"|"medium"|"low", '
        '"related_concepts": string[], "suggested_video": string | null}\n'
        "related_concepts should be short labels drawn from must-know ideas when possible. "
        "suggested_video may be a YouTube URL or null."
    )

    _ask_counts[token] = used + 1
    remaining = _MAX_ASK_PER_SESSION - _ask_counts[token]

    try:
        raw_text = _gemini_post(
            system_instruction=system + "\n\n" + json_schema_hint,
            contents=contents,
            response_mime_type="application/json",
            temperature=0.35,
        )
        data = json.loads(raw_text)
    except HTTPException:
        _ask_counts[token] = max(0, _ask_counts[token] - 1)
        raise
    except json.JSONDecodeError:
        _ask_counts[token] = max(0, _ask_counts[token] - 1)
        raise HTTPException(status_code=502, detail="Gemini returned invalid JSON") from None

    answer = str(data.get("answer", "")).strip()
    if not answer:
        _ask_counts[token] = max(0, _ask_counts[token] - 1)
        raise HTTPException(status_code=502, detail="Empty answer from model")

    conf = data.get("confidence", "medium")
    if conf not in ("high", "medium", "low"):
        conf = "medium"
    related = data.get("related_concepts") or []
    if not isinstance(related, list):
        related = []
    related = [str(x) for x in related[:12]]
    vid = data.get("suggested_video")
    if vid is not None and not isinstance(vid, str):
        vid = None
    if not vid and body.suggested_video_url:
        vid = body.suggested_video_url.strip() or None

    return {
        "answer": answer,
        "confidence": conf,
        "related_concepts": related,
        "suggested_video": vid,
        "remaining_questions": remaining,
    }


@router.post("/study-guide")
def gemini_study_guide(body: StudyGuideBody) -> dict[str, Any]:
    title = _topic_title_default(body.topic_slug, body.topic_title)
    summary = (body.topic_summary or "").strip() or "Not provided."
    must = _fmt_list(body.must_know_concepts)
    mistakes = _fmt_list(body.common_mistakes)
    chunks = _fmt_list(body.context_chunks, "(none)")

    system = (
        "You write structured study guides for CHM 222 (Dr. Garrett) organic chemistry students. "
        "Output GitHub-flavored Markdown only. About 600 words. Use headings (##, ###), bullets, and "
        "a short recap box at the end. No fabricated reactions."
    )
    prompt = (
        f"Topic: {title} ({body.course}, slug={body.topic_slug})\n\n"
        f"Summary:\n{summary}\n\nMust know:\n{must}\n\nCommon mistakes:\n{mistakes}\n\n"
        f"Extra context:\n{chunks}\n"
    )
    text = _gemini_post(
        system_instruction=system,
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
        temperature=0.45,
    )
    return {"markdown": text.strip()}


@router.post("/audio-brief")
def gemini_audio_brief(body: AudioBriefBody) -> dict[str, Any]:
    title = _topic_title_default(body.topic_slug, body.topic_title)
    summary = (body.topic_summary or "").strip() or "Not provided."
    must = _fmt_list(body.must_know_concepts)
    chunks = _fmt_list(body.context_chunks, "(none)")

    system = (
        "Write a ~400 word conversational podcast transcript (two friendly hosts: Alex and Jordan) "
        "for students studying organic chemistry. No stage directions except occasional short beats in brackets. "
        "Stay accurate; do not invent reactions."
    )
    prompt = (
        f"Episode topic: {title}. Course: {body.course}. Slug: {body.topic_slug}.\n\n"
        f"Summary:\n{summary}\n\nMust know:\n{must}\n\nContext:\n{chunks}\n"
    )
    text = _gemini_post(
        system_instruction=system,
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
        temperature=0.55,
    )
    return {"transcript": text.strip()}


@router.post("/fresh-questions")
def gemini_fresh_questions(body: FreshQuestionsBody) -> dict[str, Any]:
    title = _topic_title_default(body.topic_slug, body.topic_title)
    summary = (body.topic_summary or "").strip() or "Not provided."
    must = _fmt_list(body.must_know_concepts)
    chunks = _fmt_list(body.context_chunks, "(none)")

    system = (
        "Create exactly 5 unique multiple-choice organic chemistry questions for exam practice. "
        "Return JSON only: an array of objects with keys: "
        'question (string), options (array of 4 strings), answerIndex (0-3 int), explanation (string). '
        "Do not duplicate stereochemistry/regiochemistry ideas across all five unless necessary. "
        "No fabricated named reactions."
    )
    prompt = (
        f"Topic: {title}. Slug: {body.topic_slug}. Course: {body.course}.\n\n"
        f"Summary:\n{summary}\n\nMust know:\n{must}\n\nContext:\n{chunks}\n"
    )
    raw_text = _gemini_post(
        system_instruction=system,
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
        response_mime_type="application/json",
        temperature=0.55,
    )
    try:
        qs = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail="Invalid JSON from model") from e
    if not isinstance(qs, list):
        raise HTTPException(status_code=502, detail="Expected JSON array")
    return {"questions": qs[:5]}


@router.post("/explain-mistake")
def gemini_explain_mistake(body: ExplainMistakeBody) -> dict[str, Any]:
    title = _topic_title_default(body.topic_slug, body.topic_title)
    system = (
        "You explain why a student's MCQ answer was wrong, gently and clearly, for Dr. Garrett's CHM 222 course. "
        "Return JSON only: {\"explanation\": string, \"key_concept\": string}"
    )
    prompt = (
        f"Topic: {title} ({body.topic_slug})\n"
        f"Question: {body.question}\n"
        f"Student chose: {body.wrong_answer}\n"
        f"Correct answer: {body.correct_answer}\n"
    )
    raw_text = _gemini_post(
        system_instruction=system,
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
        response_mime_type="application/json",
        temperature=0.35,
    )
    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail="Invalid JSON from model") from e
    return {
        "explanation": str(data.get("explanation", "")).strip(),
        "key_concept": str(data.get("key_concept", "")).strip(),
    }
