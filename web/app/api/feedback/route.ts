import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const FEEDBACK_FILE = path.join(process.cwd(), "data", "feedback.json");

export type FeedbackEntry = {
  id: string;
  timestamp: string;
  type: "broken_video" | "other";
  course: string;
  topic: string;
  topicSlug: string;
  videoTitle?: string;
  videoUrl?: string;
  itemIndex?: number;
  message?: string;
};

async function ensureDataDir() {
  const dir = path.dirname(FEEDBACK_FILE);
  await mkdir(dir, { recursive: true });
}

async function readFeedback(): Promise<FeedbackEntry[]> {
  try {
    const raw = await readFile(FEEDBACK_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeFeedback(entries: FeedbackEntry[]) {
  await ensureDataDir();
  await writeFile(FEEDBACK_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type = "broken_video",
      course,
      topic,
      topicSlug,
      videoTitle,
      videoUrl,
      itemIndex,
      message,
    } = body;

    const entry: FeedbackEntry = {
      id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: type || "broken_video",
      course: course || "",
      topic: topic || "",
      topicSlug: topicSlug || "",
      videoTitle,
      videoUrl,
      itemIndex,
      message,
    };

    const entries = await readFeedback();
    entries.push(entry);
    await writeFeedback(entries);

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (e) {
    console.error("Feedback API error:", e);
    return NextResponse.json({ ok: false, error: "Failed to save feedback" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const entries = await readFeedback();
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json([]);
  }
}
