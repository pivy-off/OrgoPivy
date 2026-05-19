"use client";

import { useEffect, useMemo } from "react";

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
};

type Props = {
  totalQuestions: number;
  correctAnswers: number;
  sessionHistory: Array<{ score: number; date: string }>;
};

const ACHIEVEMENTS_KEY = "orgopivy-practice-achievements";

function loadSavedAchievements(): Achievement[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (saved) return JSON.parse(saved) as Achievement[];
  } catch (e) {
    console.error("Failed to load achievements", e);
  }
  return [];
}

export default function PracticeAchievements({ totalQuestions, correctAnswers, sessionHistory }: Props) {

  const percentage = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  }, [correctAnswers, totalQuestions]);

  const averageScore = useMemo(() => {
    if (sessionHistory.length === 0) return 0;
    const sum = sessionHistory.reduce((acc, s) => acc + s.score, 0);
    return Math.round(sum / sessionHistory.length);
  }, [sessionHistory]);

  const achievements = useMemo(() => {
    const savedAchievements = typeof window !== "undefined" ? loadSavedAchievements() : [];
    const wasUnlocked = (id: string) => savedAchievements.find((a) => a.id === id)?.unlocked ?? false;
    return [
      {
        id: "first-correct",
        name: "First Steps",
        description: "Answer your first question correctly",
        icon: "🎯",
        unlocked: wasUnlocked("first-correct") || correctAnswers >= 1,
        progress: Math.min(correctAnswers, 1),
        maxProgress: 1,
      },
      {
        id: "perfect-10",
        name: "Perfect 10",
        description: "Get 10 questions correct in a row",
        icon: "🔥",
        unlocked: wasUnlocked("perfect-10") || correctAnswers >= 10,
        progress: Math.min(correctAnswers, 10),
        maxProgress: 10,
      },
      {
        id: "century",
        name: "Century Club",
        description: "Answer 100 questions correctly",
        icon: "💯",
        unlocked: wasUnlocked("century") || correctAnswers >= 100,
        progress: Math.min(correctAnswers, 100),
        maxProgress: 100,
      },
      {
        id: "perfect-score",
        name: "Perfect Score",
        description: "Achieve 100% on a practice session",
        icon: "⭐",
        unlocked: wasUnlocked("perfect-score") || percentage === 100,
        progress: percentage >= 100 ? 1 : 0,
        maxProgress: 1,
      },
      {
        id: "consistent",
        name: "Consistent Performer",
        description: "Maintain 80%+ average across 5 sessions",
        icon: "📈",
        unlocked: wasUnlocked("consistent") || (sessionHistory.length >= 5 && averageScore >= 80),
        progress: Math.min(sessionHistory.length, 5),
        maxProgress: 5,
      },
      {
        id: "dedicated",
        name: "Dedicated Learner",
        description: "Complete 20 practice sessions",
        icon: "🏆",
        unlocked: wasUnlocked("dedicated") || sessionHistory.length >= 20,
        progress: Math.min(sessionHistory.length, 20),
        maxProgress: 20,
      },
    ];
  }, [correctAnswers, percentage, sessionHistory.length, averageScore]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = loadSavedAchievements();
    const newlyUnlocked = achievements.filter(
      (a) => a.unlocked && !saved.find((s) => s.id === a.id)?.unlocked,
    );
    if (newlyUnlocked.length > 0) {
      console.log("New achievements unlocked!", newlyUnlocked);
    }
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }, [achievements]);


  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div style={{
      padding: 20,
      background: "linear-gradient(135deg, rgba(0, 122, 255, 0.06) 0%, rgba(88, 86, 214, 0.06) 100%)",
      borderRadius: 16,
      border: "1px solid rgba(0, 122, 255, 0.2)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Achievements</div>
          <div style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.6)" }}>
            {unlockedCount} of {totalCount} unlocked
          </div>
        </div>
        <div style={{
          fontSize: 32,
          fontWeight: 700,
          background: "linear-gradient(135deg, #007AFF, #5856D6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          {percentage}%
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            style={{
              padding: 16,
              borderRadius: 12,
              border: `2px solid ${achievement.unlocked ? "#34C759" : "rgba(0, 0, 0, 0.1)"}`,
              background: achievement.unlocked ? "rgba(52, 199, 89, 0.1)" : "white",
              opacity: achievement.unlocked ? 1 : 0.6,
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8, filter: achievement.unlocked ? "none" : "grayscale(100%)" }}>
              {achievement.icon}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              {achievement.name}
            </div>
            <div style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.6)", marginBottom: 8 }}>
              {achievement.description}
            </div>
            {achievement.maxProgress > 1 && (
              <div style={{
                width: "100%",
                height: 4,
                background: "rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                overflow: "hidden",
                marginTop: 8
              }}>
                <div style={{
                  width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                  height: "100%",
                  background: achievement.unlocked ? "#34C759" : "#007AFF",
                  transition: "width 0.3s ease"
                }} />
              </div>
            )}
            {achievement.unlocked && (
              <div style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#34C759",
                marginTop: 8
              }}>
                ✓ Unlocked
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
