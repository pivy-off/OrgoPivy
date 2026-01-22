"use client";

import { useEffect, useState } from "react";
import { getStats } from "../lib/progress";
import { getStreakData } from "../lib/streak";
import { getCourseTopics } from "../lib/curriculum";

export default function ProgressChart() {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);
  const [streak, setStreak] = useState(getStreakData());

  useEffect(() => {
    setStats(getStats());
    setStreak(getStreakData());
  }, []);

  if (!stats) return null;

  const orgochem1Topics = getCourseTopics("orgochem-1");
  const orgochem2Topics = getCourseTopics("orgochem-2");
  const totalTopics = orgochem1Topics.length + orgochem2Topics.length;
  const completionRate = totalTopics > 0 
    ? Math.round((stats.totalCompleted / totalTopics) * 100) 
    : 0;

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Progress Overview</div>
        <div className="subtle" style={{ fontSize: 13 }}>
          Your learning journey
        </div>
      </div>

      <div style={{ display: "grid", gap: 20 }}>
        {/* Completion Rate */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Topics Completed</span>
            <span style={{ fontSize: 14, color: "var(--muted)" }}>
              {stats.totalCompleted} / {totalTopics}
            </span>
          </div>
          <div style={{
            width: "100%",
            height: 12,
            background: "var(--border)",
            borderRadius: 6,
            overflow: "hidden",
          }}>
            <div style={{
              width: `${completionRate}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--blue), var(--purple))",
              transition: "width 0.3s ease",
            }} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8, textAlign: "center", color: "var(--blue)" }}>
            {completionRate}%
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <div style={{ textAlign: "center", padding: 16, background: "var(--panel-2)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
              {Math.floor(stats.totalTime / 60)}h
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Total Study Time</div>
          </div>
          <div style={{ textAlign: "center", padding: 16, background: "var(--panel-2)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
              {streak.currentStreak}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Day Streak</div>
          </div>
          <div style={{ textAlign: "center", padding: 16, background: "var(--panel-2)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
              {stats.totalBookmarks}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Bookmarks</div>
          </div>
          <div style={{ textAlign: "center", padding: 16, background: "var(--panel-2)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
              {stats.totalAchievements}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Achievements</div>
          </div>
        </div>
      </div>
    </div>
  );
}
