import Link from "next/link"
import { getCourse } from "../../lib/courses"
import { ROUTES, type CourseId } from "../../lib/routes"

type Props = {
  searchParams?: Record<string, string | string[] | undefined>
}

function pickFirst(v: unknown) {
  if (typeof v === "string") return v
  if (Array.isArray(v) && typeof v[0] === "string") return v[0]
  return ""
}

export default function TopicQueryPage({ searchParams }: Props) {
  const courseId = pickFirst(searchParams?.courseId)
  const topicId = pickFirst(searchParams?.topicId)

  const course = getCourse(courseId)
  const topic = course?.topics.find((t) => t.id === topicId) ?? null

  if (!course || !topic) {
    return (
      <div className="card" style={{ width: "100%", maxWidth: 980 }}>
        <div className="cardInner">
          <div className="stack">
            <div>
              <div className="h1">Topic not found</div>
              <div className="subtle">courseId {JSON.stringify(courseId)}</div>
              <div className="subtle">topicId {JSON.stringify(topicId)}</div>
            </div>

            <div className="row">
              <Link className="btn" href={ROUTES.home}>
                Home
              </Link>
              {courseId ? (
                <Link className="btn" href={ROUTES.course(courseId as CourseId)}>
                  Back to topics
                </Link>
              ) : null}
            </div>
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
            <Link className="btn" href={ROUTES.course(course.id as CourseId)}>
              Back to topics
            </Link>
            <Link className="btn" href={ROUTES.home}>
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
