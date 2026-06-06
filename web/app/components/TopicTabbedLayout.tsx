"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type TopicTabId = "overview" | "study" | "practice" | "resources";

const TABS: { id: TopicTabId; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "📋" },
  { id: "study", label: "Study", icon: "📚" },
  { id: "practice", label: "Practice", icon: "✏️" },
  { id: "resources", label: "Resources", icon: "🔧" },
];

const TabContext = createContext<{
  tab: TopicTabId;
  setTab: (id: TopicTabId) => void;
} | null>(null);

export function TopicTabbedLayout({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<TopicTabId>("overview");

  return (
    <TabContext.Provider value={{ tab, setTab }}>
      <nav className="topicPageTabs" aria-label="Topic sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? "topicPageTab topicPageTabActive" : "topicPageTab"}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
          >
            <span aria-hidden>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
      {children}
    </TabContext.Provider>
  );
}

export function TopicTabPanel({ id, children }: { id: TopicTabId; children: ReactNode }) {
  const ctx = useContext(TabContext);
  if (!ctx || ctx.tab !== id) return null;
  return (
    <div className="stack topicTabPanel" role="tabpanel">
      {children}
    </div>
  );
}
