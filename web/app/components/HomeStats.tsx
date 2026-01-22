"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStats } from "../lib/progress";
import { getCourseTopics, findTopic } from "../lib/curriculum";
import type { CourseId } from "../lib/curriculum";

export default function HomeStats() {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  if (!stats) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 40,
      }}
    >
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>{stats.totalCompleted}</div>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Topics Completed</div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
          {Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m
        </div>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Study Time</div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>{stats.totalBookmarks}</div>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Bookmarks</div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>{stats.totalAchievements}</div>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Achievements</div>
      </div>
    </div>
  );
}

export function RecentActivity() {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  if (!stats || (stats.recentSessions.length === 0 && stats.bookmarks.length === 0)) {
    return null;
  }

  return (
    <div className="card" style={{ marginTop: 40 }}>
      <div className="cardInner">
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recent Activity</div>
        
        {stats.recentSessions.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--muted)" }}>
              Recent Study Sessions
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {stats.recentSessions.map((session) => {
                const topic = findTopic(session.course, session.topic);
                return (
                  <div
                    key={session.id}
                    style={{
                      padding: 12,
                      background: "var(--panel-2)",
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        {topic?.title || session.topic}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        {session.duration} min • {new Date(session.endTime || "").toLocaleDateString()}
                      </div>
                    </div>
                    <Link
                      href={`/${session.course}/${session.topic}`}
                      className="btn"
                      style={{ fontSize: 12, padding: "6px 12px" }}
                    >
                      Open
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stats.bookmarks.length > 0 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--muted)" }}>
              Bookmarked Topics
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {stats.bookmarks.map((bookmark) => {
                const topic = findTopic(bookmark.course, bookmark.topic);
                return (
                  <div
                    key={bookmark.id}
                    style={{
                      padding: 12,
                      background: "var(--panel-2)",
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        ⭐ {topic?.title || bookmark.topic}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        {bookmark.course === "orgochem-1" ? "OrgoChem I" : "OrgoChem II"}
                      </div>
                    </div>
                    <Link
                      href={`/${bookmark.course}/${bookmark.topic}`}
                      className="btn"
                      style={{ fontSize: 12, padding: "6px 12px" }}
                    >
                      Open
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AchievementsDisplay() {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  if (!stats || stats.achievements.length === 0) {
    return null;
  }

  return (
    <div className="card" style={{ marginTop: 40 }}>
      <div className="cardInner">
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recent Achievements</div>
        <div style={{ display: "grid", gap: 12 }}>
          {stats.achievements.map((achievement) => (
            <div
              key={achievement.id}
              style={{
                padding: 16,
                background: "var(--panel-2)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 32 }}>{achievement.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                  {achievement.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{achievement.description}</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
