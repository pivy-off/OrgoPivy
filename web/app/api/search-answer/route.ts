import { NextRequest, NextResponse } from "next/server";
import { getCourseTopics, findTopic } from "../../lib/curriculum";
import type { CourseId } from "../../lib/curriculum";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const course = searchParams.get("course") as CourseId | null;

  if (!query.trim()) {
    return NextResponse.json({
      curriculumAnswer: null,
      curriculumSources: [],
      notesAnswer: null,
      notesContexts: [],
    });
  }

  // Search curriculum topics
  const orgochem1Topics = getCourseTopics("orgochem-1");
  const orgochem2Topics = getCourseTopics("orgochem-2");
  let topicsToSearch = [...orgochem1Topics, ...orgochem2Topics];

  if (course === "orgochem-1") {
    topicsToSearch = orgochem1Topics;
  } else if (course === "orgochem-2") {
    topicsToSearch = orgochem2Topics;
  }

  const q = query.toLowerCase();
  const matchingTopics = topicsToSearch.filter((topic) => {
    const searchText = `${topic.title} ${topic.shortDesc} ${topic.summary} ${topic.mustKnow.join(" ")} ${topic.howToStudy.join(" ")}`.toLowerCase();
    return searchText.includes(q);
  });

  // Generate answer from curriculum
  let curriculumAnswer = "";
  const curriculumSources: Array<{ title: string; href: string; courseId: string }> = [];

  if (matchingTopics.length > 0) {
    // Build a comprehensive answer from matching topics
    const topMatches = matchingTopics.slice(0, 3);
    
    curriculumAnswer = `Based on the curriculum, here's what you need to know about "${query}":\n\n`;
    
    topMatches.forEach((topic, idx) => {
      const courseId = orgochem1Topics.includes(topic) ? "orgochem-1" : "orgochem-2";
      curriculumSources.push({
        title: topic.title,
        href: `/${courseId}/${topic.slug}`,
        courseId,
      });

      curriculumAnswer += `${idx + 1}. **${topic.title}** (${courseId === "orgochem-1" ? "OrgoChem I" : "OrgoChem II"}):\n`;
      curriculumAnswer += `   ${topic.summary}\n\n`;
      
      if (topic.mustKnow.length > 0) {
        curriculumAnswer += `   Key concepts:\n`;
        topic.mustKnow.slice(0, 3).forEach((item) => {
          curriculumAnswer += `   • ${item}\n`;
        });
        curriculumAnswer += `\n`;
      }
    });

    curriculumAnswer += `For detailed study guides and practice problems, visit the topic pages linked above.`;
  } else {
    curriculumAnswer = `I couldn't find a direct match for "${query}" in the curriculum. Try searching for specific topics like "stereochemistry", "SN2 reactions", or "carbonyl chemistry". You can also use the Ask page to search through your uploaded notes.`;
  }

  // Try to get answer from uploaded notes (if backend is available)
  let notesAnswer: string | null = null;
  let notesContexts: Array<{ snippet?: string; stored_filename?: string }> = [];

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${apiBase}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: query,
        top_k: 3,
        course: course || undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.answer) {
        notesAnswer = data.answer;
        notesContexts = Array.isArray(data.contexts) ? data.contexts : [];
      }
    }
  } catch (e) {
    // Backend not available, that's okay
  }

  return NextResponse.json({
    curriculumAnswer,
    curriculumSources,
    notesAnswer,
    notesContexts,
  });
}
