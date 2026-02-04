"use client";

import Link from "next/link";
import { getCourseTopics } from "../lib/curriculum";
import CourseProgressClient from "../components/CourseProgressClient";
import { useLanguage } from "../contexts/LanguageContext";

export default function OrgoChem2Page() {
  const { t, locale } = useLanguage();
  const topics = getCourseTopics("orgochem-2", locale);

  return (
    <main className="stack">
      <div className="card">
        <div className="cardInner">
          <div className="stack">
            <div className="row">
              <div>
                <h1 className="h1">{t("orgochem2")}</h1>
                <div className="subtle">{t("foundationsDesc2")}</div>
              </div>

              <div className="row">
                <Link className="btn" href="/">
                  {t("back")}
                </Link>
              </div>
            </div>

            <div className="divider" />

            <CourseProgressClient course="orgochem-2" topics={topics} />

            <div className="divider" />

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="btn btnPrimary" href="/practice?course=orgochem-2">
                {t("practiceProblemsBtn")}
              </Link>
              <Link className="btn" href="/orgochem-2/exams">
                {t("examMode")}
              </Link>
            </div>

            <div className="divider" />

            <div className="subtle">{t("tipStuck2")}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
