import { NextRequest, NextResponse } from "next/server";
import { findTopic, getCourseTopics } from "../../lib/curriculum";
import type { CourseId } from "../../lib/curriculum";

type Problem = {
  id: string;
  question: string;
  type: "multiple-choice" | "drawing";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
};

// Generate problems from curriculum data
function generateProblemsFromCurriculum(
  course: CourseId,
  topicSlug: string,
  count: number = 10
): Problem[] {
  const topic = findTopic(course, topicSlug);
  if (!topic) return [];

  const problems: Problem[] = [];
  const { title, mustKnow, howToStudy, summary } = topic;

  // Generate multiple-choice questions from must-know items
  mustKnow.forEach((concept, idx) => {
    if (problems.length >= count) return;

    const conceptWords = concept.split(" ");
    const mainConcept = conceptWords.slice(0, 3).join(" ");

    // Create question based on concept
    let question = "";
    let correctAnswer = "";
    let options: string[] = [];
    let explanation = "";

    if (concept.includes("naming") || concept.includes("IUPAC")) {
      question = `What is the correct IUPAC naming rule for ${mainConcept}?`;
      correctAnswer = concept;
      options = [
        concept,
        concept.split(" ").reverse().join(" "),
        concept.replace("parent chain", "main chain"),
        concept.replace("alphabetical", "numerical"),
      ];
      explanation = `Based on IUPAC naming conventions: ${concept}`;
    } else if (concept.includes("mechanism") || concept.includes("reaction")) {
      question = `What is the key concept for ${mainConcept}?`;
      correctAnswer = concept;
      options = [
        concept,
        concept.replace("mechanism", "reaction"),
        concept.replace("reaction", "mechanism"),
        "None of the above",
      ];
      explanation = `The key concept is: ${concept}`;
    } else if (concept.includes("stability") || concept.includes("energy")) {
      question = `Which factor affects ${mainConcept}?`;
      correctAnswer = concept;
      options = [
        concept,
        concept.replace("stability", "reactivity"),
        concept.replace("energy", "entropy"),
        "None of the above",
      ];
      explanation = `The factor affecting ${mainConcept} is: ${concept}`;
    } else {
      question = `What is important to know about ${mainConcept}?`;
      correctAnswer = concept;
      options = [
        concept,
        concept.split(" ").slice(0, 2).join(" "),
        concept.split(" ").slice(-2).join(" "),
        "All of the above",
      ];
      explanation = `Key point: ${concept}`;
    }

    problems.push({
      id: `gen-${topicSlug}-${idx + 1}`,
      question,
      type: "multiple-choice",
      options: options.length === 4 ? options : [
        concept,
        concept.split(" ").reverse().join(" "),
        concept.replace(/\w+/g, (w) => w.toUpperCase()),
        "None of the above",
      ],
      correctAnswer,
      explanation,
      points: 10,
    });
  });

  // Generate short-answer questions from study steps
  howToStudy.forEach((step, idx) => {
    if (problems.length >= count) return;

    const stepWords = step.split(" ");
    const action = stepWords[0];
    const target = stepWords.slice(1, 4).join(" ");

    problems.push({
      id: `gen-${topicSlug}-study-${idx + 1}`,
      question: `According to study recommendations, what should you do for ${title}?`,
      type: "short-answer",
      correctAnswer: step,
      explanation: `Study step: ${step}`,
      points: 10,
    });
  });

  // Generate synthesis/mechanism questions if topic has mechanisms
  if (topic.hasMechanism && problems.length < count) {
    problems.push({
      id: `gen-${topicSlug}-mech-1`,
      question: `Draw the mechanism for a key reaction in ${title}. What is the first step?`,
      type: "mechanism",
      correctAnswer: `The first step involves ${mustKnow[0] || "the key reaction mechanism"}`,
      explanation: `For ${title}, the mechanism involves: ${mustKnow.slice(0, 2).join(" and ")}`,
      points: 15,
    });
  }

  // Generate multiple-choice questions from must-know items
  mustKnow.forEach((concept, idx) => {
    if (problems.length >= count) return;

    const conceptWords = concept.split(" ");
    const mainConcept = conceptWords.slice(0, 3).join(" ");

    // Create multiple-choice question based on concept
    let question = "";
    let correctAnswer = "";
    let options: string[] = [];
    let explanation = "";

    if (concept.includes("naming") || concept.includes("IUPAC")) {
      question = `What is the correct IUPAC naming rule for ${mainConcept}?`;
      correctAnswer = concept;
      options = [
        concept,
        concept.split(" ").reverse().join(" "),
        concept.replace("parent chain", "main chain"),
        concept.replace("alphabetical", "numerical"),
      ];
      explanation = `Based on IUPAC naming conventions: ${concept}`;
    } else if (concept.includes("mechanism") || concept.includes("reaction")) {
      question = `What is the key mechanism for ${mainConcept}?`;
      correctAnswer = concept;
      options = [
        concept,
        concept.replace("mechanism", "reaction"),
        concept.replace("reaction", "mechanism"),
        "None of the above",
      ];
      explanation = `The key mechanism is: ${concept}`;
    } else if (concept.includes("stability") || concept.includes("energy")) {
      question = `Which factor affects ${mainConcept}?`;
      correctAnswer = concept;
      options = [
        concept,
        concept.replace("stability", "reactivity"),
        concept.replace("energy", "entropy"),
        "None of the above",
      ];
      explanation = `The factor affecting ${mainConcept} is: ${concept}`;
    } else {
      question = `What is important to know about ${mainConcept}?`;
      correctAnswer = concept;
      options = [
        concept,
        concept.split(" ").slice(0, 2).join(" "),
        concept.split(" ").slice(-2).join(" "),
        "All of the above",
      ];
      explanation = `Key point: ${concept}`;
    }

    problems.push({
      id: `gen-${topicSlug}-${idx + 1}`,
      question,
      type: "multiple-choice",
      options: options.length === 4 ? options : [
        concept,
        concept.split(" ").reverse().join(" "),
        concept.replace(/\w+/g, (w) => w.toUpperCase()),
        "None of the above",
      ],
      correctAnswer,
      explanation,
      points: 10,
    });
  });

  // Generate drawing problems for topics with conformations/structures
  if ((topicSlug.includes("alkanes") || topicSlug.includes("cycloalkanes") || topicSlug.includes("stereochemistry")) && problems.length < count) {
    problems.push({
      id: `gen-${topicSlug}-draw-1`,
      question: `Draw the most stable conformation for ${title}.`,
      type: "drawing",
      correctAnswer: "Anti conformation or chair conformation (depending on topic)",
      explanation: `For ${title}, the most stable conformation minimizes steric interactions.`,
      points: 15,
    });
  }

  return problems.slice(0, count);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const course = searchParams.get("course") as CourseId | null;
  const topic = searchParams.get("topic") || "";
  const count = parseInt(searchParams.get("count") || "10", 10);

  if (!course || !topic) {
    return NextResponse.json(
      { error: "Course and topic are required" },
      { status: 400 }
    );
  }

  try {
    const problems = generateProblemsFromCurriculum(course, topic, count);
    
    return NextResponse.json({
      problems,
      count: problems.length,
      topic,
      course,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to generate problems" },
      { status: 500 }
    );
  }
}
