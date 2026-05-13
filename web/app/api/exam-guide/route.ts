import { NextRequest, NextResponse } from "next/server";
import { findTopic, getCourseTopics, type CourseId, type TopicPracticeMcq } from "../../lib/curriculum";
import { Document, ExternalHyperlink, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const course = searchParams.get("course") as CourseId | null;
  const topicSlug = searchParams.get("topic");

  if (!course || !topicSlug) {
    return NextResponse.json(
      { error: "Missing course or topic parameter" },
      { status: 400 }
    );
  }

  const topic = findTopic(course, topicSlug);
  if (!topic) {
    return NextResponse.json(
      { error: "Topic not found" },
      { status: 404 }
    );
  }

  // For OrgoChem I: Check for uploaded study guides and practice exams
  if (course === "orgochem-1") {
    const fileContents: string[] = [];
    
    try {
      // First, check for practice exam files
      const practiceExamsRes = await fetch(`${API_BASE}/practice-exams`, {
        cache: "no-store",
      });
      
      if (practiceExamsRes.ok) {
        const practiceExamsData = await practiceExamsRes.json();
        const examFiles = Array.isArray(practiceExamsData?.items) ? practiceExamsData.items : [];
        
        // Map exam files to topics based on filename patterns
        // Exam 1 -> alkanes, cycloalkanes, stereochemistry (IUPAC naming, Newman projections)
        // Exam 2 -> substitution-elimination (SN1/SN2/E1/E2)
        // Exam 3 -> alkenes (addition reactions)
        // Exam 4 -> spectroscopy
        const topicExamMap: Record<string, string[]> = {
          "alkanes": ["exam 1", "practice exam1", "exam1"],
          "cycloalkanes": ["exam 1", "practice exam1", "exam1"],
          "stereochemistry": ["exam 1", "practice exam1", "exam1"],
          "substitution-elimination": ["exam2", "review exam2", "exam 2"],
          "alkenes": ["exam 3", "exam3", "chm311"],
          "spectroscopy": ["exam4", "reviewexam4", "exam 4"],
        };
        
        const relevantExamKeywords = topicExamMap[topicSlug] || [];
        
        for (const examFile of examFiles) {
          const filenameLower = examFile.filename?.toLowerCase() || "";
          const stemLower = examFile.stem?.toLowerCase() || "";
          
          // Check if this exam file is relevant to the current topic
          const isRelevant = relevantExamKeywords.some(keyword => 
            filenameLower.includes(keyword) || stemLower.includes(keyword)
          );
          
          // Also include files that might be general study guides (if no specific match)
          const isGeneralGuide = filenameLower.includes("study guide") && relevantExamKeywords.length === 0;
          
          if (isRelevant || isGeneralGuide) {
            try {
              const examContentRes = await fetch(`${API_BASE}/practice-exams/${examFile.filename}`, {
                cache: "no-store",
              });
              if (examContentRes.ok) {
                const examData = await examContentRes.json();
                const content = examData.content || "";
                if (content.trim() && content.length > 100) { // Only include if substantial content
                  fileContents.push(`\n--- Practice Exam: ${examFile.filename} ---\n${content}`);
                }
              }
            } catch (e) {
              console.error(`Failed to fetch practice exam ${examFile.filename}:`, e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching practice exam files:", error);
    }
    
    try {
      // Also check for uploaded files from API
      const uploadsRes = await fetch(`${API_BASE}/uploads`, {
        cache: "no-store",
      });
      
      if (uploadsRes.ok) {
        const uploadsData = await uploadsRes.json();
        const items = Array.isArray(uploadsData?.items) ? uploadsData.items : [];
        
        // Filter files for this course and topic
        const relevantFiles = items.filter((item: any) => {
          const itemCourse = item.course?.toLowerCase();
          const itemTopic = item.topic?.toLowerCase();
          return (
            itemCourse === course.toLowerCase() &&
            (itemTopic === topicSlug.toLowerCase() || !itemTopic) &&
            item.indexed === true
          );
        });

        for (const file of relevantFiles) {
          try {
            const fileRes = await fetch(`${API_BASE}/uploads/${file.upload_id}/text`, {
              cache: "no-store",
            });
            if (fileRes.ok) {
              const data = await fileRes.json();
              const content = data.text || "";
              if (content.trim()) {
                fileContents.push(`\n--- Content from ${file.original_filename} ---\n${content}`);
              }
            }
          } catch (e) {
            console.error(`Failed to fetch content for ${file.upload_id}:`, e);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }

    // If we have any content (practice exams or uploads), generate Word doc
    if (fileContents.length > 0) {
      const doc = generateWordDoc(topic, course, fileContents);
      const buffer = await Packer.toBuffer(doc);
      
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${topic.slug}-study-guide.docx"`,
        },
      });
    }
  }

  // Fallback: Generate from topic curriculum data (for OrgoChem II or if no uploads)
  const doc = generateWordDoc(topic, course, []);
  const buffer = await Packer.toBuffer(doc);
  
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${topic.slug}-study-guide.docx"`,
    },
  });
}

function generateWordDoc(topic: any, course: CourseId, uploadedContent: string[]) {
  const courseName = course === "orgochem-1" ? "OrgoChem I" : "OrgoChem II";
  
  const children: Paragraph[] = [
    new Paragraph({
      text: `${courseName} - ${topic.title}`,
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      text: "=".repeat(60),
    }),
    new Paragraph({ text: "" }),
    
    new Paragraph({
      text: "SUMMARY",
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text: "-".repeat(60),
    }),
    new Paragraph({
      text: topic.summary,
    }),
    new Paragraph({ text: "" }),
    
    new Paragraph({
      text: "WHY THIS TOPIC MATTERS",
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text: "-".repeat(60),
    }),
    new Paragraph({
      text: topic.shortDesc,
    }),
    new Paragraph({ text: "" }),
    
    new Paragraph({
      text: "MUST-KNOW CHECKLIST",
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text: "-".repeat(60),
    }),
    ...topic.mustKnow.map((item: string, index: number) =>
      new Paragraph({
        text: `${index + 1}. ${item}`,
      })
    ),
    new Paragraph({ text: "" }),
    
    new Paragraph({
      text: "STUDY STEPS",
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text: "-".repeat(60),
    }),
    ...topic.howToStudy.map((step: string, index: number) =>
      new Paragraph({
        text: `${index + 1}. ${step}`,
      })
    ),
    new Paragraph({ text: "" }),
  ];

  if (topic.practiceMcqs && topic.practiceMcqs.length > 0) {
    const labels = ["A", "B", "C", "D"] as const;
    const mcqParas: Paragraph[] = [
      new Paragraph({
        text: "PRACTICE MCQs (multiple choice)",
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: "-".repeat(60),
      }),
    ];
    topic.practiceMcqs.forEach((mcq: TopicPracticeMcq, i: number) => {
      mcqParas.push(new Paragraph({ text: `Q${i + 1}. ${mcq.question}` }));
      mcq.options.forEach((opt: string, j: number) => {
        mcqParas.push(new Paragraph({ text: `  ${labels[j]}. ${opt}` }));
      });
      mcqParas.push(new Paragraph({ text: `Answer: ${labels[mcq.answerIndex]}` }));
      mcqParas.push(new Paragraph({ text: mcq.explanation }));
      mcqParas.push(new Paragraph({ text: "" }));
    });
    children.push(...mcqParas);
  }

  if (uploadedContent.length > 0) {
    children.push(
      new Paragraph({
        text: "UPLOADED STUDY MATERIALS",
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: "-".repeat(60),
      }),
      ...uploadedContent.map((content) =>
        new Paragraph({
          text: content,
        })
      ),
      new Paragraph({ text: "" })
    );
  }

  children.push(
    new Paragraph({
      text: "FULL REFERENCE",
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text: "-".repeat(60),
    }),
    new Paragraph({
      text: topic.externalLabel,
    }),
    new Paragraph({
      children: [
        new ExternalHyperlink({
          link: topic.externalUrl,
          children: [
            new TextRun({
              text: topic.externalUrl,
              style: "Hyperlink",
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: "" }),
    
    new Paragraph({
      text: "EXAM TIPS",
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text: "-".repeat(60),
    }),
    new Paragraph({
      text: "• Always name the intermediate before predicting the product",
    }),
    new Paragraph({
      text: "• When stuck, list what the reagent can do, then match to the substrate",
    }),
    new Paragraph({
      text: "• Speed comes after accuracy. First be right, then be fast",
    }),
    new Paragraph({
      text: "• Do 10 practice problems before the exam",
    }),
    new Paragraph({
      text: "• Review the Must-Know checklist the night before",
    }),
    new Paragraph({ text: "" }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: "Generated by OrgoPivy - Student-Centered Organic Chemistry Learning",
          italics: true,
        }),
      ],
    })
  );

  return new Document({
    sections: [
      {
        children,
      },
    ],
  });
}
