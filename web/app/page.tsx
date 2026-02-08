"use client";

import Link from "next/link";
import HomeStats, { RecentActivity, AchievementsDisplay } from "./components/HomeStats";
import HomeSearch from "./components/HomeSearch";
import StudyStreak from "./components/StudyStreak";
import QuickReview from "./components/QuickReview";
import ProgressChart from "./components/ProgressChart";
import { useLanguage } from "./contexts/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <main style={{ 
      width: "100%",
      minWidth: 0,
      padding: "40px 0",
      paddingBottom: "calc(40px + env(safe-area-inset-bottom))",
      minHeight: "calc(100vh - 120px)"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px",
        paddingLeft: "max(24px, env(safe-area-inset-left))",
        paddingRight: "max(24px, env(safe-area-inset-right))",
        minWidth: 0,
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: "center",
          marginBottom: 40
        }}>
          {/* Search */}
          <HomeSearch />
        </div>

        {/* Course Cards Grid - at top */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 32,
          maxWidth: 1000,
          margin: "0 auto"
        }}>
          <Link href="/orgochem-1" style={{ textDecoration: "none", display: "block" }}>
            <div className="courseCard" style={{
              height: "100%",
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Decorative gradient corner */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 200,
                height: 200,
                background: "linear-gradient(135deg, rgba(0, 122, 255, 0.12) 0%, rgba(88, 86, 214, 0.08) 100%)",
                borderRadius: "0 20px 0 100%",
                pointerEvents: "none"
              }} />
              
              <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="courseCardTop" style={{ marginBottom: 20 }}>
                  <div className="courseCardTitle" style={{ fontSize: 36, marginBottom: 0 }}>
                    {t("orgochem1")}
                  </div>
                </div>

                <div className="courseCardSubtitle" style={{ 
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: "var(--muted)",
                  marginBottom: 24,
                  flex: 1
                }}>
                  {t("orgo1Desc")}
                </div>

                <div className="courseCardFooter" style={{ marginTop: "auto" }}>
                  <span className="courseCardCta" style={{ fontSize: 16 }}>
                    {t("viewTopics")}
                  </span>
                  <span className="courseCardArrow" style={{ fontSize: 20 }}>
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/orgochem-2" style={{ textDecoration: "none", display: "block" }}>
            <div className="courseCard" style={{
              height: "100%",
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Decorative gradient corner */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 200,
                height: 200,
                background: "linear-gradient(135deg, rgba(88, 86, 214, 0.12) 0%, rgba(0, 122, 255, 0.08) 100%)",
                borderRadius: "0 20px 0 100%",
                pointerEvents: "none"
              }} />
              
              <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="courseCardTop" style={{ marginBottom: 20 }}>
                  <div className="courseCardTitle" style={{ fontSize: 36, marginBottom: 0 }}>
                    {t("orgochem2")}
                  </div>
                </div>

                <div className="courseCardSubtitle" style={{ 
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: "var(--muted)",
                  marginBottom: 24,
                  flex: 1
                }}>
                  {t("orgo2Desc")}
                </div>

                <div className="courseCardFooter" style={{ marginTop: "auto" }}>
                  <span className="courseCardCta" style={{ fontSize: 16, color: "#5856D6" }}>
                    {t("viewTopics")}
                  </span>
                  <span className="courseCardArrow" style={{ fontSize: 20, color: "#5856D6" }}>
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <HomeStats />

        {/* Recent Activity & Achievements */}
        <RecentActivity />
        <AchievementsDisplay />

        {/* Study Tools Grid - at bottom */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
          marginTop: 48,
          marginBottom: 40,
        }}>
          <StudyStreak />
          <QuickReview />
          <ProgressChart />
        </div>

        {/* Professor Tools card */}
        <Link
          href="/professor"
          className="professorCard"
          style={{
            display: "block",
            marginTop: 48,
            padding: 24,
            borderRadius: 16,
            border: "2px solid rgba(88, 86, 214, 0.3)",
            background: "linear-gradient(135deg, rgba(88, 86, 214, 0.08) 0%, rgba(0, 122, 255, 0.06) 100%)",
            textDecoration: "none",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(88, 86, 214, 0.5)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(88, 86, 214, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(88, 86, 214, 0.3)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #5856D6 0%, #007AFF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}>
              📝
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: "var(--text)" }}>
                {t("professorTools")}
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>
                {t("professorToolsDesc")}
              </div>
            </div>
            <span className="professorCardArrow" style={{ marginLeft: "auto", fontSize: 20, color: "var(--muted)" }}>→</span>
          </div>
        </Link>
      </div>
    </main>
  );
}
