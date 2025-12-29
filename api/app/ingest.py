from pathlib import Path
from typing import List, Dict
import re

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\s+", " ", text).strip()
    return text

def chunk_text(text: str, max_chars: int = 900, overlap_chars: int = 120) -> List[str]:
    text = text.replace("\r\n", "\n").strip()
    if not text:
        return []

    chunks: List[str] = []
    start = 0
    n = len(text)

    while start < n:
        end = min(start + max_chars, n)

        if end < n:
            window = text[start:end]
            cut = window.rfind("\n\n")
            if cut != -1 and cut > max_chars * 0.5:
                end = start + cut

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        if end == n:
            break

        start = max(0, end - overlap_chars)

    return chunks

def score(query: str, chunk: str) -> int:
    q = normalize(query)
    c = normalize(chunk)
    if not q:
        return 0

    terms = [t for t in q.split(" ") if t]
    s = 0
    for t in terms:
        if len(t) < 2:
            continue
        s += c.count(t)
    return s

def make_answer(query: str, results: List[Dict], max_sentences: int = 5) -> str:
    q = normalize(query)
    if not q or not results:
        return "No answer found in your uploaded materials yet"

    terms = [t for t in q.split(" ") if len(t) >= 2]

    sentences = []
    for r in results:
        text = r.get("text", "")
        for raw in re.split(r"(?<=[\.\!\?])\s+|\n+", text):
            s = raw.strip()
            if len(s) < 25:
                continue
            c = normalize(s)
            hit = 0
            for t in terms:
                if t in c:
                    hit += 1
            if hit > 0:
                sentences.append((hit, s))

    if not sentences:
        top = results[0]["text"].strip()
        return top[:600]

    sentences.sort(key=lambda x: x[0], reverse=True)
    picked = []
    seen = set()

    for hit, s in sentences:
        key = normalize(s)
        if key in seen:
            continue
        seen.add(key)
        picked.append(s)
        if len(picked) >= max_sentences:
            break

    return " ".join(picked)
