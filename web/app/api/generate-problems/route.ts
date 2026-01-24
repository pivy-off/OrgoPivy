import { NextRequest, NextResponse } from "next/server";
import { findTopic, getCourseTopics } from "../../lib/curriculum";
import type { CourseId } from "../../lib/curriculum";

type Problem = {
  id: string;
  question: string;
  type: "multiple-choice" | "drawing" | "short-answer";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  hints: string[];
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
    let hints: string[] = [];

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
      hints = [
        "Find the longest continuous carbon chain",
        "Number from the end that gives lowest substituent numbers",
        "List substituents in alphabetical order",
        "Use proper prefixes (di-, tri-, etc.) for multiples",
      ];
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
      hints = [
        "Identify the substrate type (primary/secondary/tertiary)",
        "Check the nucleophile/base strength and type",
        "Consider the solvent (polar protic vs aprotic)",
        "Apply the mechanism rules for the specific conditions",
      ];
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
      hints = [
        "Consider steric and electronic effects",
        "Think about bond strengths and molecular orbitals",
        "Compare relative energies of different states",
        "Consider the role of substituents",
      ];
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
      hints = [
        "Review the must-know items for this topic",
        "Check the study steps for guidance",
        "Refer to the external textbook reference",
        "Consider the specific conditions and reagents",
      ];
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
      hints,
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
      hints: [
        "Look at the study steps provided for this topic",
        "Focus on the recommended approach for learning",
        "Consider what order to practice in",
        "Think about what will help you remember best",
      ],
    });
  });

  // Generate synthesis/mechanism questions if topic has mechanisms
  if (topic.hasMechanism && problems.length < count) {
    problems.push({
      id: `gen-${topicSlug}-mech-1`,
      question: `Draw the mechanism for a key reaction in ${title}. What is the first step?`,
      type: "short-answer",
      correctAnswer: `The first step involves ${mustKnow[0] || "the key reaction mechanism"}`,
      explanation: `For ${title}, the mechanism involves: ${mustKnow.slice(0, 2).join(" and ")}`,
      points: 15,
      hints: [
        "Identify the electrophile and nucleophile",
        "Consider the reaction conditions (heat, light, catalyst)",
        "Look for resonance stabilization",
        "Check for stereochemical implications",
      ],
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
    let hints: string[] = [];

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
      hints = [
        "Find the longest continuous carbon chain",
        "Number from the end that gives lowest substituent numbers",
        "List substituents in alphabetical order",
        "Use proper prefixes (di-, tri-, etc.) for multiples",
      ];
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
      hints = [
        "Identify the substrate type (primary/secondary/tertiary)",
        "Check the nucleophile/base strength and type",
        "Consider the solvent (polar protic vs aprotic)",
        "Apply the mechanism rules for the specific conditions",
      ];
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
      hints = [
        "Consider steric and electronic effects",
        "Think about bond strengths and molecular orbitals",
        "Compare relative energies of different states",
        "Consider the role of substituents",
      ];
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
      hints = [
        "Review the must-know items for this topic",
        "Check the study steps for guidance",
        "Refer to the external textbook reference",
        "Consider the specific conditions and reagents",
      ];
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
      hints,
    });
  });

  // Generate drawing problems for topics with conformations/structures
  if ((topicSlug.includes("alkanes") || topicSlug.includes("cycloalkanes") || topicSlug.includes("stereochemistry")) && problems.length < count) {
    const question = topicSlug.includes("cycloalkanes")
      ? "Draw the chair conformation of cyclohexane showing axial and equatorial positions."
      : topicSlug.includes("stereochemistry")
      ? "Draw the Newman projection for the most stable conformation of butane."
      : `Draw the most stable conformation for ${title}.`;

    const hints = topicSlug.includes("cycloalkanes")
      ? [
        "Chair conformation has alternating axial/equatorial positions",
        "1,3-diaxial interactions cause steric strain",
        "Draw both axial and equatorial hydrogens",
        "Ring flip interconverts axial and equatorial positions",
      ]
      : topicSlug.includes("stereochemistry")
      ? [
        "Draw Newman projection looking down C2-C3 bond",
        "Anti conformation has methyl groups 180° apart",
        "Anti conformation minimizes steric interactions",
        "Remember: anti = 180°, gauche = 60°, eclipsed = 0°",
      ]
      : [
        "Consider steric interactions between substituents",
        "Look for staggered vs eclipsed arrangements",
        "Identify the most stable dihedral angles",
        "Minimize 1,3-diaxial or gauche interactions",
      ];

    problems.push({
      id: `gen-${topicSlug}-draw-1`,
      question,
      type: "drawing",
      correctAnswer: "Anti conformation or chair conformation (depending on topic)",
      explanation: `For ${title}, the most stable conformation minimizes steric interactions.`,
      points: 15,
      hints,
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
