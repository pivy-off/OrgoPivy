"use client";

import Link from "next/link";
import HomeStats, { RecentActivity, AchievementsDisplay } from "./components/HomeStats";
import HomeSearch from "./components/HomeSearch";
import StudyStreak from "./components/StudyStreak";
import QuickReview from "./components/QuickReview";
import ProgressChart from "./components/ProgressChart";
import ProfessorAssignmentCreator from "./components/ProfessorAssignmentCreator";

export default function HomePage() {
  return (
    <main style={{ 
      width: "100%",
      padding: "60px 0",
      minHeight: "calc(100vh - 120px)"
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px"
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: "center",
          marginBottom: 60
        }}>
          {/* Search */}
          <HomeSearch />
        </div>

        {/* Stats */}
        <HomeStats />

        {/* Study Tools Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
          marginBottom: 40,
        }}>
          <StudyStreak />
          <QuickReview />
          <ProgressChart />
        </div>

        {/* Course Cards Grid */}
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
                    OrgoChem I
                  </div>
                </div>

                <div className="courseCardSubtitle" style={{ 
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: "var(--muted)",
                  marginBottom: 24,
                  flex: 1
                }}>
                  Foundations, stereochemistry, and reaction logic. Build your understanding step by step through 
                  alkanes, cycloalkanes, stereochemistry, substitution and elimination reactions, alkenes, and spectroscopy.
                </div>

                <div className="courseCardFooter" style={{ marginTop: "auto" }}>
                  <span className="courseCardCta" style={{ fontSize: 16 }}>
                    View topics
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
                    OrgoChem II
                  </div>
                </div>

                <div className="courseCardSubtitle" style={{ 
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: "var(--muted)",
                  marginBottom: 24,
                  flex: 1
                }}>
                  Carbonyl logic, synthesis, and structure proof. Master advanced transformations including 
                  alcohols, ethers, carbonyls, carboxylic acids, enolates, aromatic chemistry, and amines.
                </div>

                <div className="courseCardFooter" style={{ marginTop: "auto" }}>
                  <span className="courseCardCta" style={{ fontSize: 16, color: "#5856D6" }}>
                    View topics
                  </span>
                  <span className="courseCardArrow" style={{ fontSize: 20, color: "#5856D6" }}>
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity & Achievements */}
        <RecentActivity />
        <AchievementsDisplay />

        {/* Professor Mode */}
        <div style={{ marginTop: 60, maxWidth: 1000, margin: "60px auto 0" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
              Professor Tools
            </div>
            <div className="subtle" style={{ fontSize: 14, marginBottom: 24 }}>
              Create assignments and generate practice problems for your students
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
            <ProfessorAssignmentCreator course="orgochem-1" />
            <ProfessorAssignmentCreator course="orgochem-2" />
          </div>
        </div>
      </div>
    </main>
  );
}
