"use client";

import { useState, useEffect, useMemo } from "react";

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
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  sessionHistory: Array<{ score: number; date: string }>;
};

export default function PracticeAchievements({ score, totalQuestions, correctAnswers, sessionHistory }: Props) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const percentage = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  }, [correctAnswers, totalQuestions]);

  const averageScore = useMemo(() => {
    if (sessionHistory.length === 0) return 0;
    const sum = sessionHistory.reduce((acc, s) => acc + s.score, 0);
    return Math.round(sum / sessionHistory.length);
  }, [sessionHistory]);

  useEffect(() => {
    const storageKey = "orgopivy-practice-achievements";
    const saved = localStorage.getItem(storageKey);
    let savedAchievements: Achievement[] = [];
    
    if (saved) {
      try {
        savedAchievements = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load achievements", e);
      }
    }

    const allAchievements: Achievement[] = [
      {
        id: "first-correct",
        name: "First Steps",
        description: "Answer your first question correctly",
        icon: "🎯",
        unlocked: savedAchievements.find(a => a.id === "first-correct")?.unlocked || correctAnswers >= 1,
        progress: Math.min(correctAnswers, 1),
        maxProgress: 1
      },
      {
        id: "perfect-10",
        name: "Perfect 10",
        description: "Get 10 questions correct in a row",
        icon: "🔥",
        unlocked: savedAchievements.find(a => a.id === "perfect-10")?.unlocked || correctAnswers >= 10,
        progress: Math.min(correctAnswers, 10),
        maxProgress: 10
      },
      {
        id: "century",
        name: "Century Club",
        description: "Answer 100 questions correctly",
        icon: "💯",
        unlocked: savedAchievements.find(a => a.id === "century")?.unlocked || correctAnswers >= 100,
        progress: Math.min(correctAnswers, 100),
        maxProgress: 100
      },
      {
        id: "perfect-score",
        name: "Perfect Score",
        description: "Achieve 100% on a practice session",
        icon: "⭐",
        unlocked: savedAchievements.find(a => a.id === "perfect-score")?.unlocked || percentage === 100,
        progress: percentage >= 100 ? 1 : 0,
        maxProgress: 1
      },
      {
        id: "consistent",
        name: "Consistent Performer",
        description: "Maintain 80%+ average across 5 sessions",
        icon: "📈",
        unlocked: savedAchievements.find(a => a.id === "consistent")?.unlocked || (sessionHistory.length >= 5 && averageScore >= 80),
        progress: Math.min(sessionHistory.length, 5),
        maxProgress: 5
      },
      {
        id: "dedicated",
        name: "Dedicated Learner",
        description: "Complete 20 practice sessions",
        icon: "🏆",
        unlocked: savedAchievements.find(a => a.id === "dedicated")?.unlocked || sessionHistory.length >= 20,
        progress: Math.min(sessionHistory.length, 20),
        maxProgress: 20
      }
    ];

    // Check for newly unlocked achievements
    const newlyUnlocked = allAchievements.filter(a => {
      const saved = savedAchievements.find(sa => sa.id === a.id);
      return a.unlocked && (!saved || !saved.unlocked);
    });

    if (newlyUnlocked.length > 0) {
      // Show notification for new achievements
      console.log("New achievements unlocked!", newlyUnlocked);
    }

    // Save updated achievements
    localStorage.setItem(storageKey, JSON.stringify(allAchievements));
    setAchievements(allAchievements);
  }, [correctAnswers, percentage, sessionHistory.length, averageScore]);

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
