import Link from "next/link"

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-2">OrgoPivy</h1>
      <p className="text-muted-foreground mb-8">
        Choose OrgoChem I or OrgoChem II first. Then pick a topic.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/orgochem-1" className="border rounded-xl p-6 hover:shadow">
          <h2 className="text-xl font-semibold mb-2">OrgoChem I</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Foundations, stereochemistry, and reaction intuition
          </p>
          <div className="text-sm text-muted-foreground">
            SN1 • SN2 • E1 • E2 • Alkanes • Alkenes
          </div>
        </Link>

        <Link href="/orgochem-2" className="border rounded-xl p-6 hover:shadow">
          <h2 className="text-xl font-semibold mb-2">OrgoChem II</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Carbonyl chemistry, synthesis, and structure proof
          </p>
          <div className="text-sm text-muted-foreground">
            Alcohols • Carbonyls • Enolates • Amines
          </div>
        </Link>
      </div>
    </div>
  )
}
