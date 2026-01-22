"use client";

import { useEffect, useState, useRef } from "react";
import type { CourseId } from "../lib/curriculum";
import { startStudySession, endStudySession } from "../lib/progress";

type Props = {
  course: CourseId;
  topic: string;
};

export default function StudyTimer({ course, topic }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  function handleStart() {
    const id = startStudySession(course, topic);
    setSessionId(id);
    setIsRunning(true);
    setElapsed(0);
  }

  function handleStop() {
    if (sessionId) {
      endStudySession(sessionId);
      setSessionId(null);
    }
    setIsRunning(false);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleResume() {
    setIsRunning(true);
  }

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const displayTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div
      style={{
        padding: "16px 20px",
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "monospace",
            color: isRunning ? "var(--green)" : "var(--text)",
          }}
        >
          {displayTime}
        </div>
        {isRunning && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--green)",
              animation: "pulse 2s infinite",
            }}
          />
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {!isRunning && elapsed === 0 && (
          <button
            type="button"
            className="btn btnPrimary"
            onClick={handleStart}
            style={{ fontSize: 14 }}
          >
            Start Timer
          </button>
        )}

        {isRunning && (
          <>
            <button
              type="button"
              className="btn"
              onClick={handlePause}
              style={{ fontSize: 14 }}
            >
              Pause
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleStop}
              style={{ fontSize: 14 }}
            >
              Stop
            </button>
          </>
        )}

        {!isRunning && elapsed > 0 && (
          <>
            <button
              type="button"
              className="btn btnPrimary"
              onClick={handleResume}
              style={{ fontSize: 14 }}
            >
              Resume
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleStop}
              style={{ fontSize: 14 }}
            >
              Save & Stop
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
