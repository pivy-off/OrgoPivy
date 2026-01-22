import Link from "next/link"
// @ts-ignore - Legacy file
import { getCourse } from "../../../../lib/courses"

type Props = {
  params: { courseId: string; topicId: string }
}

export default function TopicPage({ params }: Props) {
  const course = getCourse(params.courseId)
  const topic = course?.topics.find((t: { id: string; title: string; description: string; hasMechanism?: boolean }) => t.id === params.topicId) ?? null

  if (!course || !topic) {
    return (
      <div className="card" style={{ width: "100%", maxWidth: 980 }}>
        <div className="cardInner">
          <div className="stack">
            <div>
              <div className="h1">Topic not found</div>
              <div className="subtle">
                courseId {params.courseId} topicId {params.topicId}
              </div>
            </div>
            <Link className="btn" href={`/courses/${params.courseId}`}>
              Back to topics
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ width: "100%", maxWidth: 980 }}>
      <div className="cardInner">
        <div className="stack">
          <div>
            <div className="h1">{topic.title}</div>
            <div className="subtle">{topic.description}</div>
          </div>

          <div className="divider" />

          <div className="stackSm">
            <div className="cardTitle">Summary</div>
            <div className="subtle">Coming next</div>

            <div className="cardTitle">Must Know</div>
            <div className="subtle">Coming next</div>

            <div className="cardTitle">Study Steps</div>
            <div className="subtle">Coming next</div>

            <div className="cardTitle">Practice</div>
            <div className="subtle">Coming next</div>

            <div className="cardTitle">Exam prep</div>
            <div className="subtle">Coming next</div>
          </div>

          <div className="row">
            <Link className="btn" href={`/courses/${course.id}`}>
              Back to topics
            </Link>
            <Link className="btn" href="/">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
