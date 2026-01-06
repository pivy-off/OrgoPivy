export type CourseId = "ochem1" | "ochem2"

export type Topic = {
  id: string
  title: string
  description: string
  hasMechanism?: boolean
}

export type Course = {
  id: CourseId
  title: string
  subtitle: string
  topics: Topic[]
}

export const COURSES: Record<CourseId, Course> = {
  ochem1: {
    id: "ochem1",
    title: "OrgoChem I",
    subtitle: "Foundations carbonyl chemistry substitution and elimination intro reactions",
    topics: [
      { id: "acid-base", title: "Acid base and pKa", description: "How to compare acidity basicity and predict direction of equilibrium" },
      { id: "sn1-sn2-e1-e2", title: "SN1 SN2 E1 E2", description: "Choose the pathway predict products and understand stereochemistry", hasMechanism: true },
      { id: "alkene-addition", title: "Alkene additions", description: "Hydration halogenation hydroboration oxidation and regiochemistry", hasMechanism: true },
      { id: "carbonyl-basics", title: "Carbonyl basics", description: "Nucleophilic addition reactivity trends and common reagents", hasMechanism: true },
      { id: "aldol", title: "Aldol reactions", description: "Enolates aldol addition vs condensation and key patterns", hasMechanism: true },
    ],
  },
  ochem2: {
    id: "ochem2",
    title: "OrgoChem II",
    subtitle: "Aromatics enolates multi step synthesis advanced mechanisms and strategy",
    topics: [
      { id: "aromatics", title: "Aromaticity and EAS", description: "Directing effects resonance and the common electrophilic substitutions", hasMechanism: true },
      { id: "enolates", title: "Enolates and alpha chemistry", description: "Alpha substitution alpha halogenation alpha alkylation and control", hasMechanism: true },
      { id: "carbonyl-derivatives", title: "Carboxylic acid derivatives", description: "Substitution reactivity order and synthesis conversions", hasMechanism: true },
      { id: "multistep", title: "Multi step synthesis strategy", description: "Retrosynthesis protecting groups and planning with constraints" },
    ],
  },
}

export function normalizeCourseId(raw: unknown): CourseId | null {
  const s = String(raw ?? "").trim().toLowerCase()

  if (s === "ochem1" || s === "ochem-1" || s === "orgochem-1" || s === "orgo-1") return "ochem1"
  if (s === "ochem2" || s === "ochem-2" || s === "orgochem-2" || s === "orgo-2") return "ochem2"

  return null
}

export function getCourse(rawCourseId: unknown) {
  const id = normalizeCourseId(rawCourseId)
  if (!id) return null
  return COURSES[id]
}
