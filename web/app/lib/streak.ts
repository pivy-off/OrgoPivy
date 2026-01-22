// Study streak and daily goals tracking

export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalDays: number;
  dailyGoal: number; // minutes
  todayProgress: number; // minutes studied today
};

const STREAK_KEY = "orgopivy_streak";
const DEFAULT_GOAL = 30; // 30 minutes per day

export function getStreakData(): StreakData {
  if (typeof window === "undefined") {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      totalDays: 0,
      dailyGoal: DEFAULT_GOAL,
      todayProgress: 0,
    };
  }

  try {
    const stored = localStorage.getItem(STREAK_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading streak data:", e);
  }

  return {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    totalDays: 0,
    dailyGoal: DEFAULT_GOAL,
    todayProgress: 0,
  };
}

export function updateStreak(minutesStudied: number) {
  if (typeof window === "undefined") return;

  const data = getStreakData();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Check if we studied today
  if (data.lastStudyDate === today) {
    // Already studied today, just update progress
    data.todayProgress += minutesStudied;
  } else {
    // New day
    if (data.lastStudyDate === yesterday) {
      // Consecutive day - increment streak
      data.currentStreak += 1;
    } else if (data.lastStudyDate !== null) {
      // Streak broken
      data.currentStreak = 1;
    } else {
      // First time studying
      data.currentStreak = 1;
      data.totalDays = 1;
    }

    data.lastStudyDate = today;
    data.todayProgress = minutesStudied;
    data.totalDays += 1;

    // Update longest streak
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak;
    }
  }

  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving streak data:", e);
  }

  return data;
}

export function setDailyGoal(minutes: number) {
  if (typeof window === "undefined") return;

  const data = getStreakData();
  data.dailyGoal = minutes;

  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving daily goal:", e);
  }
}

export function getTodayProgress(): number {
  const data = getStreakData();
  const today = new Date().toISOString().split("T")[0];
  
  if (data.lastStudyDate === today) {
    return data.todayProgress;
  }
  
  return 0;
}

export function isGoalMet(): boolean {
  const data = getStreakData();
  return getTodayProgress() >= data.dailyGoal;
}
