import { apiUrl } from "@/app/lib/api";
import { getOrCreateSessionToken, incrementGlobalAiRequests, touchStreakActivity } from "@/lib/storage";
import type { Topic } from "@/app/lib/curriculum";

export type ChatTurn = { role: "user" | "model"; content: string };

export type AskResponse = {
  answer: string;
  confidence: "high" | "medium" | "low";
  related_concepts: string[];
  suggested_video: string | null;
  remaining_questions: number;
  provider?: string;
};

export type AiStatus = {
  configured: boolean;
  provider: "deepseek" | "gemini" | null;
  display_name: string | null;
  model?: string;
  free_tier_note?: string | null;
};

function topicPayload(topic: Topic | undefined, extraChunks: string[] = []) {
  const must =
    topic?.mustKnowItems?.map((m) => `${m.title}: ${m.description}`) ??
    (topic?.mustKnow?.map((s) => s) ?? []);
  const mistakes = topic?.commonMistakes ?? [];
  const chunks = [...extraChunks];
  return {
    topic_title: topic?.title,
    topic_summary: topic?.summary ?? "",
    must_know_concepts: must,
    common_mistakes: mistakes,
    context_chunks: chunks,
    suggested_video_url: topic?.bestVideos?.[0]?.url ?? null,
  };
}

async function parseError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const j = JSON.parse(text) as { detail?: string };
    if (typeof j.detail === "string") return j.detail;
  } catch {
    /* plain text */
  }
  return text || res.statusText;
}

/** Which LLM is configured (DeepSeek preferred). */
export async function fetchAiStatus(): Promise<AiStatus> {
  const res = await fetch(apiUrl("/ai/status"), { headers: { Accept: "application/json" } });
  if (!res.ok) return { configured: false, provider: null, display_name: null };
  return res.json() as Promise<AiStatus>;
}

export async function aiAsk(
  question: string,
  opts: {
    topicSlug: string;
    course: "orgochem-1" | "orgochem-2";
    history: ChatTurn[];
    topic?: Topic;
    contextChunks?: string[];
  },
): Promise<AskResponse> {
  const session_token = getOrCreateSessionToken();
  incrementGlobalAiRequests();
  touchStreakActivity();
  const tp = topicPayload(opts.topic, opts.contextChunks);
  const res = await fetch(apiUrl("/ai/ask"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      question,
      topic_slug: opts.topicSlug,
      course: opts.course,
      context_chunks: tp.context_chunks,
      history: opts.history,
      session_token,
      topic_title: tp.topic_title,
      topic_summary: tp.topic_summary,
      must_know_concepts: tp.must_know_concepts,
      common_mistakes: tp.common_mistakes,
      suggested_video_url: tp.suggested_video_url,
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<AskResponse>;
}

export async function aiStudyGuide(topic: Topic | undefined, slug: string): Promise<{ markdown: string }> {
  incrementGlobalAiRequests();
  touchStreakActivity();
  const tp = topicPayload(topic);
  const res = await fetch(apiUrl("/ai/study-guide"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic_slug: slug,
      course: "orgochem-2",
      session_token: getOrCreateSessionToken(),
      ...tp,
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function aiAudioBrief(topic: Topic | undefined, slug: string): Promise<{ transcript: string }> {
  incrementGlobalAiRequests();
  touchStreakActivity();
  const tp = topicPayload(topic);
  const res = await fetch(apiUrl("/ai/audio-brief"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic_slug: slug,
      course: "orgochem-2",
      session_token: getOrCreateSessionToken(),
      ...tp,
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export type FreshMcq = {
  question: string;
  options: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  explanation: string;
};

export async function aiFreshQuestions(
  topic: Topic | undefined,
  slug: string,
): Promise<{ questions: FreshMcq[] }> {
  incrementGlobalAiRequests();
  touchStreakActivity();
  const tp = topicPayload(topic);
  const res = await fetch(apiUrl("/ai/fresh-questions"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic_slug: slug,
      course: "orgochem-2",
      session_token: getOrCreateSessionToken(),
      ...tp,
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function aiExplainMistake(body: {
  topicSlug: string;
  question: string;
  wrongAnswer: string;
  correctAnswer: string;
  topic?: Topic;
}): Promise<{ explanation: string; key_concept: string }> {
  incrementGlobalAiRequests();
  touchStreakActivity();
  const res = await fetch(apiUrl("/ai/explain-mistake"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic_slug: body.topicSlug,
      course: "orgochem-2",
      session_token: getOrCreateSessionToken(),
      question: body.question,
      wrong_answer: body.wrongAnswer,
      correct_answer: body.correctAnswer,
      topic_title: body.topic?.title,
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
