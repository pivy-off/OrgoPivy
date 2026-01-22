import Link from "next/link"
// Legacy file - using old course structure
// @ts-ignore - Legacy file, may not match current types
import { getCourse, normalizeCourseId } from "../../lib/courses"

type Props = {
  params: Record<string, string | string[] | undefined>
}

function resolveSingleParam(params: Record<string, any>, preferredKey: string) {
  const direct = params?.[preferredKey]
  if (typeof direct === "string") return direct
  if (Array.isArray(direct) && typeof direct[0] === "string") return direct[0]

  const firstVal = Object.values(params ?? {})[0]
  if (typeof firstVal === "string") return firstVal
  if (Array.isArray(firstVal) && typeof firstVal[0] === "string") return firstVal[0]

  return ""
}

export default function CourseTopicsPage({ params }: Props) {
  const rawCourseId = resolveSingleParam(params, "courseId")
  const courseId = normalizeCourseId(rawCourseId)
  const course = getCourse(courseId)

  if (!course) {
    return (
      <div className="card" style={{ width: "100%", maxWidth: 980 }}>
        <div className="cardInner">
          <div className="stack">
            <div>
              <div className="h1">Course not found</div>
              <div className="subtle">
                Resolved courseId {rawCourseId || "(empty)"} Keys{" "}
                {Object.keys(params ?? {}).join(", ") || "(none)"}
              </div>
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
            {course.topics.map((t: { id: string; title: string; description: string; hasMechanism?: boolean }) => (
              <Link
                key={t.id}
                className="navLink"
                href={`/courses/${course.id}/topics/${t.id}`}
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
