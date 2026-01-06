import Link from "next/link"

type Props = {
  title: string
  subtitle: string
  href: string
}

export default function CourseCard({ title, subtitle, href }: Props) {
  return (
    <Link className="courseCard" href={href}>
      <div className="courseCardTop">
        <div className="courseCardTitle">{title}</div>
        <div className="courseCardBadge">Open</div>
      </div>

      <div className="courseCardSubtitle">{subtitle}</div>

      <div className="courseCardFooter">
        <span className="courseCardCta">View topics</span>
        <span className="courseCardArrow" aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  )
}
