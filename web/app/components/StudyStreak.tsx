"use client";

import { useEffect, useState } from "react";
import { getStreakData, setDailyGoal, isGoalMet } from "../lib/streak";
import { getStats } from "../lib/progress";

export default function StudyStreak() {
  const [streak, setStreak] = useState(getStreakData());
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(streak.dailyGoal);

  useEffect(() => {
    setStreak(getStreakData());
    setStats(getStats());
  }, []);

  const goalMet = isGoalMet();
  const progressPercent = Math.min((streak.todayProgress / streak.dailyGoal) * 100, 100);

  function handleSaveGoal() {
    if (newGoal > 0 && newGoal <= 480) {
      setDailyGoal(newGoal);
      setStreak(getStreakData());
      setEditingGoal(false);
    }
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Study Streak</div>
        <div className="subtle" style={{ fontSize: 13 }}>
          Keep your momentum going!
        </div>
      </div>

      <div style={{ display: "grid", gap: 20 }}>
        {/* Current Streak */}
        <div style={{ textAlign: "center", padding: "20px 0", background: "var(--panel-2)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: "var(--blue)", marginBottom: 4 }}>
            {streak.currentStreak}
          </div>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>
            Day{streak.currentStreak !== 1 ? "s" : ""} Streak
          </div>
          {streak.longestStreak > streak.currentStreak && (
            <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 4 }}>
              Best: {streak.longestStreak} days
            </div>
          )}
        </div>

        {/* Daily Goal */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Daily Goal</div>
            {!editingGoal ? (
              <button
                type="button"
                className="btn"
                onClick={() => setEditingGoal(true)}
                style={{ fontSize: 12, padding: "4px 8px" }}
              >
                Edit
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  value={newGoal}
                  onChange={(e) => setNewGoal(parseInt(e.target.value) || 0)}
                  min={1}
                  max={480}
                  style={{
                    width: 60,
                    padding: "4px 8px",
                    fontSize: 12,
                    background: "var(--panel-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text)",
                  }}
                />
                <button
                  type="button"
                  className="btn btnPrimary"
                  onClick={handleSaveGoal}
                  style={{ fontSize: 12, padding: "4px 8px" }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setEditingGoal(false);
                    setNewGoal(streak.dailyGoal);
                  }}
                  style={{ fontSize: 12, padding: "4px 8px" }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: "var(--muted)" }}>
                {Math.floor(streak.todayProgress)} / {streak.dailyGoal} minutes
              </span>
              <span style={{ color: goalMet ? "var(--green)" : "var(--muted)" }}>
                {goalMet ? "✓ Goal Met!" : `${Math.ceil(streak.dailyGoal - streak.todayProgress)} min left`}
              </span>
            </div>
            <div style={{
              width: "100%",
              height: 8,
              background: "var(--border)",
              borderRadius: 4,
              overflow: "hidden",
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: goalMet
                  ? "linear-gradient(90deg, var(--green), var(--green-2))"
                  : "linear-gradient(90deg, var(--blue), var(--purple))",
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <div style={{ textAlign: "center", padding: 12, background: "var(--panel-2)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)" }}>{streak.totalDays}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Total Days</div>
          </div>
          <div style={{ textAlign: "center", padding: 12, background: "var(--panel-2)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)" }}>
              {stats ? Math.floor(stats.totalTime / 60) : 0}h
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Total Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
