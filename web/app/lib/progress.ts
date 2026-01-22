// Progress tracking utilities
import type { CourseId } from "./curriculum";

export type ProgressData = {
  topics: Record<string, boolean>;
  lastAccessed?: string;
  totalTime?: number; // in minutes
};

export type StudySession = {
  id: string;
  course: CourseId;
  topic: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
};

export type Bookmark = {
  id: string;
  course: CourseId;
  topic: string;
  createdAt: string;
  note?: string;
};

export type StudyNote = {
  id: string;
  course: CourseId;
  topic: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
};

// Progress tracking
export function getProgress(course: CourseId): ProgressData {
  if (typeof window === "undefined") return { topics: {} };
  try {
    const key = `orgopivy-progress-${course}`;
    const raw = localStorage.getItem(key);
    if (!raw) return { topics: {} };
    const data = JSON.parse(raw);
    return {
      topics: data.topics || {},
      lastAccessed: data.lastAccessed,
      totalTime: data.totalTime || 0,
    };
  } catch {
    return { topics: {} };
  }
}

export function saveProgress(course: CourseId, data: ProgressData): void {
  if (typeof window === "undefined") return;
  try {
    const key = `orgopivy-progress-${course}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
}

export function markTopicComplete(course: CourseId, topicSlug: string, complete: boolean): void {
  const progress = getProgress(course);
  progress.topics[topicSlug] = complete;
  progress.lastAccessed = new Date().toISOString();
  saveProgress(course, progress);
}

// Study sessions
export function getStudySessions(): StudySession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("orgopivy-sessions");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStudySession(session: StudySession): void {
  if (typeof window === "undefined") return;
  try {
    const sessions = getStudySessions();
    sessions.push(session);
    // Keep only last 100 sessions
    if (sessions.length > 100) sessions.shift();
    localStorage.setItem("orgopivy-sessions", JSON.stringify(sessions));
  } catch (e) {
    console.error("Failed to save study session", e);
  }
}

export function startStudySession(course: CourseId, topic: string): string {
  const session: StudySession = {
    id: Date.now().toString(),
    course,
    topic,
    startTime: new Date().toISOString(),
  };
  saveStudySession(session);
  return session.id;
}

export function endStudySession(sessionId: string): void {
  const sessions = getStudySessions();
  const session = sessions.find((s) => s.id === sessionId);
  if (session) {
    const endTime = new Date().toISOString();
    const start = new Date(session.startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / 1000 / 60); // minutes
    
    session.endTime = endTime;
    session.duration = duration;
    
    // Update total time in progress
    const progress = getProgress(session.course);
    progress.totalTime = (progress.totalTime || 0) + duration;
    saveProgress(session.course, progress);
    
    localStorage.setItem("orgopivy-sessions", JSON.stringify(sessions));
    
    // Check for achievements
    checkAchievements(session.course);
  }
}

// Bookmarks
export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("orgopivy-bookmarks");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addBookmark(course: CourseId, topic: string, note?: string): void {
  if (typeof window === "undefined") return;
  try {
    const bookmarks = getBookmarks();
    // Check if already bookmarked
    if (bookmarks.some((b) => b.course === course && b.topic === topic)) return;
    
    bookmarks.push({
      id: Date.now().toString(),
      course,
      topic,
      createdAt: new Date().toISOString(),
      note,
    });
    localStorage.setItem("orgopivy-bookmarks", JSON.stringify(bookmarks));
  } catch (e) {
    console.error("Failed to add bookmark", e);
  }
}

export function removeBookmark(course: CourseId, topic: string): void {
  if (typeof window === "undefined") return;
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter((b) => !(b.course === course && b.topic === topic));
    localStorage.setItem("orgopivy-bookmarks", JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to remove bookmark", e);
  }
}

export function isBookmarked(course: CourseId, topic: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.course === course && b.topic === topic);
}

// Study notes
export function getStudyNotes(course: CourseId, topic: string): StudyNote | null {
  if (typeof window === "undefined") return null;
  try {
    const key = `orgopivy-notes-${course}-${topic}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStudyNote(course: CourseId, topic: string, content: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = `orgopivy-notes-${course}-${topic}`;
    const now = new Date().toISOString();
    const existing = getStudyNotes(course, topic);
    
    const note: StudyNote = {
      id: existing?.id || Date.now().toString(),
      course,
      topic,
      content,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    
    localStorage.setItem(key, JSON.stringify(note));
  } catch (e) {
    console.error("Failed to save study note", e);
  }
}

// Achievements
export function getAchievements(): Achievement[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("orgopivy-achievements");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function unlockAchievement(id: string, name: string, description: string, icon: string): void {
  if (typeof window === "undefined") return;
  try {
    const achievements = getAchievements();
    if (achievements.some((a) => a.id === id)) return; // Already unlocked
    
    achievements.push({
      id,
      name,
      description,
      icon,
      unlockedAt: new Date().toISOString(),
    });
    localStorage.setItem("orgopivy-achievements", JSON.stringify(achievements));
  } catch (e) {
    console.error("Failed to unlock achievement", e);
  }
}

function checkAchievements(course: CourseId): void {
  const progress = getProgress(course);
  const completedCount = Object.values(progress.topics).filter(Boolean).length;
  const totalTime = progress.totalTime || 0;
  
  // First topic completed
  if (completedCount === 1) {
    unlockAchievement(
      `${course}-first-topic`,
      "Getting Started",
      "Completed your first topic!",
      "🎯"
    );
  }
  
  // Halfway there
  const topics = course === "orgochem-1" ? 6 : 7;
  if (completedCount === Math.floor(topics / 2)) {
    unlockAchievement(
      `${course}-halfway`,
      "Halfway Hero",
      "Completed half the course!",
      "⚡"
    );
  }
  
  // Course complete
  if (completedCount === topics) {
    unlockAchievement(
      `${course}-complete`,
      "Course Master",
      "Completed the entire course!",
      "🏆"
    );
  }
  
  // Study time achievements
  if (totalTime >= 60) {
    unlockAchievement(
      `${course}-hour`,
      "Dedicated Learner",
      "Studied for 1 hour!",
      "⏰"
    );
  }
  
  if (totalTime >= 300) {
    unlockAchievement(
      `${course}-marathon`,
      "Study Marathon",
      "Studied for 5 hours!",
      "🔥"
    );
  }
}

// Stats
export function getStats() {
  const orgochem1Progress = getProgress("orgochem-1");
  const orgochem2Progress = getProgress("orgochem-2");
  const sessions = getStudySessions();
  const bookmarks = getBookmarks();
  const achievements = getAchievements();
  
  const totalCompleted =
    Object.values(orgochem1Progress.topics).filter(Boolean).length +
    Object.values(orgochem2Progress.topics).filter(Boolean).length;
  
  const totalTime = (orgochem1Progress.totalTime || 0) + (orgochem2Progress.totalTime || 0);
  
  const recentSessions = sessions
    .filter((s) => s.endTime)
    .sort((a, b) => (b.endTime || "").localeCompare(a.endTime || ""))
    .slice(0, 5);
  
  return {
    totalCompleted,
    totalTime,
    totalSessions: sessions.length,
    totalBookmarks: bookmarks.length,
    totalAchievements: achievements.length,
    recentSessions,
    bookmarks: bookmarks.slice(0, 5),
    achievements: achievements.slice(-5).reverse(),
  };
}
