import Link from "next/link";

export default function TopicPage({ params }: { params: { courseId: string; topicId: string } }) {
  const courseId = (params.courseId || "").toLowerCase();
  const topicId = (params.topicId || "").toLowerCase();

  return (
    <main className="stack">
      <div className="card">
        <div className="cardInner">
          <div className="h1">Topic</div>
          <div className="subtle">
            Course {courseId} Topic {topicId}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardInner" style={{ display: "grid", gap: 12 }}>
          <div className="h1">Study path</div>

          <div className="subtle">1 Read your notes then rewrite a one page summary</div>
          <div className="subtle">2 Do mechanisms if applicable then explain each step out loud</div>
          <div className="subtle">3 Do practice problems then check mistakes</div>
          <div className="subtle">4 Before exam do timed sets and practice exams</div>
        </div>
      </div>

      <div className="card">
        <div className="cardInner" style={{ display: "grid", gap: 10 }}>
          <div className="h1">Tools</div>

          <div className="row" style={{ justifyContent: "flex-start" }}>
            <Link className="btn btnPrimary" href="/mechanisms">
              Mechanisms
            </Link>
            <Link className="btn btnPrimary" href="/spectra">
              NMR Studio
            </Link>
            <Link className="btn" href="/uploads">
              Upload and ingest
            </Link>
            <Link className="btn" href="/search">
              Search notes
            </Link>
            <Link className="btn" href="/ask">
              Ask
            </Link>
          </div>

          <div className="subtle">
            Later we will deep link mechanisms by topic and show the exact set for this topic page
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardInner">
          <div className="h1">Practice exams</div>
          <div className="subtle">We will add a practice section per course and attach your old exams for Ochem 1 and find Ochem 2 exams online</div>
        </div>
      </div>

      <div className="card">
        <div className="cardInner">
          <div className="h1">Tips</div>
          <div className="subtle">We will add a tips database sourced from online forums and show the best ones for this topic</div>
        </div>
      </div>
    </main>
  );
}
