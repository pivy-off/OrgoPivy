"""
AI study endpoints (DeepSeek preferred, Gemini fallback). OpenAI-compatible REST only.
"""
from __future__ import annotations

import json
import os
from typing import Any, Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app import llm_client

router = APIRouter(prefix="/ai", tags=["ai"])
legacy_router = APIRouter(prefix="/gemini", tags=["gemini"])

# DeepSeek free-tier friendly: more questions per session when using cheap model
_MAX_ASK_PER_SESSION = 40
_ask_counts: dict[str, int] = {}


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


def _llm_post(
    *,
    system_instruction: str,
    contents: list[dict[str, Any]],
    response_json: bool = False,
    temperature: float = 0.4,
) -> str:
    return llm_client.complete_chat(
        system_instruction=system_instruction,
        contents=contents,
        response_json=response_json,
        temperature=temperature,
    )


@router.get("/status")
def ai_status() -> dict[str, Any]:
    """Which provider is active (for UI badges)."""
    try:
        provider = llm_client.active_provider()
        name = llm_client.provider_display_name()
        return {
            "configured": True,
            "provider": provider,
            "display_name": name,
            "model": (
                os.environ.get("DEEPSEEK_MODEL", "deepseek-chat")
                if provider == "deepseek"
                else os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
            ),
            "free_tier_note": (
                "DeepSeek API includes free credits for new accounts at platform.deepseek.com"
                if provider == "deepseek"
                else None
            ),
        }
    except HTTPException:
        return {"configured": False, "provider": None, "display_name": None}


def ask_handler(body: AskBody) -> dict[str, Any]:
    token = (body.session_token or "anonymous").strip() or "anonymous"
    used = _ask_counts.get(token, 0)
    if used >= _MAX_ASK_PER_SESSION:
        raise HTTPException(
            status_code=429,
            detail="Session limit reached. Try again later or upload notes for grounded /ask search.",
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
        raw_text = _llm_post(
            system_instruction=system + "\n\n" + json_schema_hint,
            contents=contents,
            response_json=True,
            temperature=0.35,
        )
        data = json.loads(raw_text)
    except HTTPException:
        _ask_counts[token] = max(0, _ask_counts[token] - 1)
        raise
    except json.JSONDecodeError:
        _ask_counts[token] = max(0, _ask_counts[token] - 1)
        raise HTTPException(status_code=502, detail="Model returned invalid JSON") from None

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
        "provider": llm_client.active_provider(),
    }


def study_guide_handler(body: StudyGuideBody) -> dict[str, Any]:
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
    text = _llm_post(
        system_instruction=system,
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
        temperature=0.45,
    )
    return {"markdown": text.strip()}


def audio_brief_handler(body: AudioBriefBody) -> dict[str, Any]:
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
    text = _llm_post(
        system_instruction=system,
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
        temperature=0.55,
    )
    return {"transcript": text.strip()}


def fresh_questions_handler(body: FreshQuestionsBody) -> dict[str, Any]:
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
    raw_text = _llm_post(
        system_instruction=system,
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
        response_json=True,
        temperature=0.55,
    )
    try:
        qs = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail="Invalid JSON from model") from e
    if not isinstance(qs, list):
        raise HTTPException(status_code=502, detail="Expected JSON array")
    return {"questions": qs[:5]}


def explain_mistake_handler(body: ExplainMistakeBody) -> dict[str, Any]:
    title = _topic_title_default(body.topic_slug, body.topic_title)
    system = (
        "You explain why a student's MCQ answer was wrong, gently and clearly, for Dr. Garrett's CHM 222 course. "
        'Return JSON only: {"explanation": string, "key_concept": string}'
    )
    prompt = (
        f"Topic: {title} ({body.topic_slug})\n"
        f"Question: {body.question}\n"
        f"Student chose: {body.wrong_answer}\n"
        f"Correct answer: {body.correct_answer}\n"
    )
    raw_text = _llm_post(
        system_instruction=system,
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
        response_json=True,
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


def _register(r: APIRouter) -> None:
    r.add_api_route("/status", ai_status, methods=["GET"])
    r.add_api_route("/ask", ask_handler, methods=["POST"])
    r.add_api_route("/study-guide", study_guide_handler, methods=["POST"])
    r.add_api_route("/audio-brief", audio_brief_handler, methods=["POST"])
    r.add_api_route("/fresh-questions", fresh_questions_handler, methods=["POST"])
    r.add_api_route("/explain-mistake", explain_mistake_handler, methods=["POST"])


_register(router)
_register(legacy_router)
