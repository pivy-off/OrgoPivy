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
      {/* Tab Navigation */}
      <div style={{
        display: "flex",
        gap: 4,
        borderBottom: "2px solid var(--border)",
        marginBottom: 24,
        overflowX: "auto",
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 20px",
              fontSize: 15,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "var(--blue)" : "var(--muted)",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid var(--blue)" : "2px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
              marginBottom: -2,
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = "var(--text)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = "var(--muted)";
              }
            }}
          >
            {tab.icon && <span style={{ marginRight: 6 }}>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeContent}
      </div>
    </div>
  );
}
