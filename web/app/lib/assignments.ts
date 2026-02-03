import type { CourseId } from "./curriculum";
import type { HomeworkProblem } from "./homework-problems";

export type Assignment = {
  id: string;
  title: string;
  courseId: CourseId;
  topic?: string;
  problems: HomeworkProblem[];
  dueDate?: string;
  totalPoints: number;
  createdAt: string;
};

export function getAssignments(course: CourseId): Assignment[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(`orgopivy-assignments-${course}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function getAssignment(course: CourseId, assignmentId: string): Assignment | null {
  const assignments = getAssignments(course);
  return assignments.find((a) => a.id === assignmentId) || null;
}

export function saveAssignment(course: CourseId, assignment: Assignment): void {
  const assignments = getAssignments(course);
  const idx = assignments.findIndex((a) => a.id === assignment.id);
  if (idx >= 0) {
    assignments[idx] = assignment;
  } else {
    assignments.push(assignment);
  }
  localStorage.setItem(`orgopivy-assignments-${course}`, JSON.stringify(assignments));
}

export function importAssignment(json: string): Assignment | null {
  try {
    const data = JSON.parse(json);
    const courseId = data.courseId || data.course;
    if (!data.title || !data.problems?.length || !courseId) return null;
    const assignment: Assignment = {
      id: data.id || `imported-${Date.now()}`,
      title: data.title,
      courseId,
      topic: data.topic,
      problems: data.problems,
      totalPoints: data.totalPoints ?? data.problems.reduce((s: number, p: { points?: number }) => s + (p.points || 0), 0),
      createdAt: data.createdAt || new Date().toISOString(),
    };
    saveAssignment(assignment.courseId, assignment);
    return assignment;
  } catch {
    return null;
  }
}
