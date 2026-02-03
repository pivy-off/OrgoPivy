"use client";

import { useState } from "react";

type Tab = {
  id: string;
  label: string;
  icon?: string;
};

type TabContent = {
  id: string;
  content: React.ReactNode;
};

type Props = {
  tabs: Tab[];
  defaultTab?: string;
  children: TabContent[];
};

export default function TabbedInterface({ tabs, defaultTab, children }: Props) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const activeContent = children.find((tab) => tab.id === activeTab)?.content || null;

  return (
    <div>
      {/* Tab Navigation - prominent pill-style tabs */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 28,
        overflowX: "auto",
        padding: 6,
        background: "var(--panel-2)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "14px 24px",
                fontSize: 16,
                fontWeight: isActive ? 700 : 600,
                color: isActive ? "#fff" : "var(--muted)",
                background: isActive ? "var(--blue)" : "transparent",
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                boxShadow: isActive ? "0 2px 8px rgba(0,122,255,0.35)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--panel)";
                  e.currentTarget.style.color = "var(--text)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--muted)";
                }
              }}
            >
              {tab.icon && <span style={{ marginRight: 8, fontSize: 18 }}>{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeContent}
      </div>
    </div>
  );
}
