"""
Unified LLM client for OrgoPivy study features.

Provider priority (first configured wins):
  1. deepseek — DeepSeek API (OpenAI-compatible). New accounts get free API credits
     at https://platform.deepseek.com (no card required for trial grant).
  2. gemini — Google Gemini (GEMINI_API_KEY).

Set AI_PROVIDER=deepseek|gemini|auto (default auto).
"""
from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any, Literal

from fastapi import HTTPException

Provider = Literal["deepseek", "gemini"]

_DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
_DEEPSEEK_MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-chat").strip() or "deepseek-chat"

_GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash").strip() or "gemini-1.5-flash"
_GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{_GEMINI_MODEL}:generateContent"
)


def _env_provider() -> str:
    return (os.environ.get("AI_PROVIDER") or "auto").strip().lower()


def _has_deepseek() -> bool:
    return bool((os.environ.get("DEEPSEEK_API_KEY") or "").strip())


def _has_gemini() -> bool:
    return bool((os.environ.get("GEMINI_API_KEY") or "").strip())


def active_provider() -> Provider:
    pref = _env_provider()
    if pref == "deepseek":
        if not _has_deepseek():
            raise HTTPException(
                status_code=503,
                detail="AI_PROVIDER=deepseek but DEEPSEEK_API_KEY is not set.",
            )
        return "deepseek"
    if pref == "gemini":
        if not _has_gemini():
            raise HTTPException(
                status_code=503,
                detail="AI_PROVIDER=gemini but GEMINI_API_KEY is not set.",
            )
        return "gemini"
    # auto
    if _has_deepseek():
        return "deepseek"
    if _has_gemini():
        return "gemini"
    raise HTTPException(
        status_code=503,
        detail=(
            "No AI provider configured. Set DEEPSEEK_API_KEY (recommended — free credits "
            "at https://platform.deepseek.com) or GEMINI_API_KEY on the API server."
        ),
    )


def provider_display_name() -> str:
    return "DeepSeek" if active_provider() == "deepseek" else "Gemini"


def complete_chat(
    *,
    system_instruction: str,
    contents: list[dict[str, Any]],
    response_json: bool = False,
    temperature: float = 0.4,
) -> str:
    provider = active_provider()
    if provider == "deepseek":
        return _deepseek_complete(
            system_instruction=system_instruction,
            contents=contents,
            response_json=response_json,
            temperature=temperature,
        )
    return _gemini_complete(
        system_instruction=system_instruction,
        contents=contents,
        response_json=response_json,
        temperature=temperature,
    )


def _deepseek_messages(
    system_instruction: str, contents: list[dict[str, Any]]
) -> list[dict[str, str]]:
    """Map Gemini-style contents to OpenAI chat messages."""
    messages: list[dict[str, str]] = [{"role": "system", "content": system_instruction}]
    for item in contents:
        role = item.get("role", "user")
        parts = item.get("parts") or []
        text = "".join(p.get("text", "") for p in parts if isinstance(p, dict))
        if not text:
            continue
        oai_role = "assistant" if role == "model" else "user"
        messages.append({"role": oai_role, "content": text})
    return messages


def _deepseek_complete(
    *,
    system_instruction: str,
    contents: list[dict[str, Any]],
    response_json: bool,
    temperature: float,
) -> str:
    key = (os.environ.get("DEEPSEEK_API_KEY") or "").strip()
    if not key:
        raise HTTPException(status_code=503, detail="DEEPSEEK_API_KEY is not configured.")

    body: dict[str, Any] = {
        "model": _DEEPSEEK_MODEL,
        "messages": _deepseek_messages(system_instruction, contents),
        "temperature": temperature,
        "max_tokens": 8192,
    }
    if response_json:
        body["response_format"] = {"type": "json_object"}

    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        _DEEPSEEK_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {key}",
        },
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
        raise HTTPException(
            status_code=502, detail=f"DeepSeek HTTP error: {e.code} {err_body}"
        ) from e
    except urllib.error.URLError as e:
        raise HTTPException(status_code=502, detail=f"DeepSeek network error: {e!s}") from e

    try:
        return str(raw["choices"][0]["message"]["content"])
    except (KeyError, IndexError, TypeError) as e:
        raise HTTPException(status_code=502, detail="Unexpected DeepSeek response shape") from e


def _gemini_complete(
    *,
    system_instruction: str,
    contents: list[dict[str, Any]],
    response_json: bool,
    temperature: float,
) -> str:
    key = (os.environ.get("GEMINI_API_KEY") or "").strip()
    if not key:
        raise HTTPException(status_code=503, detail="GEMINI_API_KEY is not configured.")

    body: dict[str, Any] = {
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "contents": contents,
        "generationConfig": {
            "temperature": temperature,
            "topP": 0.95,
            "maxOutputTokens": 8192,
        },
    }
    if response_json:
        body["generationConfig"]["responseMimeType"] = "application/json"

    data = json.dumps(body).encode("utf-8")
    url = f"{_GEMINI_URL}?key={key}"
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
