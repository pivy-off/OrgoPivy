import Link from "next/link"
import { getCourse } from "../../lib/courses"

type Props = {
  params: { courseId: string }
}

export default function CourseTopicsPage({ params }: Props) {
  const course = getCourse(params.courseId)

  if (!course) {
    return (
      <div className="card" style={{ width: "100%", maxWidth: 980 }}>
        <div className="cardInner">
          <div className="stack">
            <div>
              <div className="h1">Course not found</div>
              <div className="subtle">courseId {JSON.stringify(params.courseId)}</div>
            </div>
            <Link className="btn" href="/">
              Back to home
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
            <div className="h1">{course.title}</div>
            <div className="subtle">{course.subtitle}</div>
          </div>

          <div className="divider" />

          <div className="stackSm">
            {course.topics.map((t) => (
              <Link
                key={t.id}
                className="navLink"
                href={`/c/${course.id}/topics/${t.id}`}
              >
                <span>{t.title}</span>
                <span className="subtle">{t.hasMechanism ? "Mechanism" : "Study"}</span>
              </Link>
            ))}
          </div>

          <div className="row">
            <Link className="btn" href="/">
              Back to course selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
