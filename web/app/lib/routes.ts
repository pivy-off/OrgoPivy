export type CourseId = "ochem1" | "ochem2"

export const ROUTES = {
  home: "/",
  course: (courseId: CourseId) => `/courses/${encodeURIComponent(courseId)}`,
  topic: (courseId: CourseId, topicId: string) =>
    `/courses/${encodeURIComponent(courseId)}/topics/${encodeURIComponent(topicId)}`,
}
