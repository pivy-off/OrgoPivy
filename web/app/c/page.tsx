import Link from "next/link"
import { getCourse } from "../lib/courses"
import { ROUTES, type CourseId } from "../lib/routes"

type Props = {
  searchParams?: Record<string, string | string[] | undefined>
}

function pickFirst(v: unknown) {
  if (typeof v === "string") return v
  if (Array.isArray(v) && typeof v[0] === "string") return v[0]
  return ""
}

export default function CourseTopicsQueryPage({ searchParams }: Props) {
  const courseIdRaw = pickFirst(searchParams?.courseId)
  const course = getCourse(courseIdRaw)

  if (!course) {
    return (
      <div className="card" style={{ width: "100%", maxWidth: 980 }}>
        <div className="cardInner">
          <div className="stack">
            <div>
              <div className="h1">Course not found</div>
              <div className="subtle">courseId {JSON.stringify(courseIdRaw)}</div>
            </div>

            <div className="row">
              <Link className="btn" href={ROUTES.home}>
                Back to home
              </Link>
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
            <div className="h1">{course.title}</div>
            <div className="subtle">{course.subtitle}</div>
          </div>

          <div className="divider" />

          <div className="stackSm">
            {course.topics.map((t) => (
              <Link key={t.id} className="navLink" href={ROUTES.topic(course.id as CourseId, t.id)}>
                <span>{t.title}</span>
                <span className="subtle">{t.hasMechanism ? "Mechanism" : "Study"}</span>
              </Link>
            ))}
          </div>

          <div className="row">
            <Link className="btn" href={ROUTES.home}>
              Back to course selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
