"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SideNavTheme from "./SideNavTheme";

const ITEMS: { href: string; label: string; tag: string }[] = [
  { href: "/", label: "Home", tag: "Overview" },
  { href: "/uploads", label: "Uploads", tag: "Files" },
  { href: "/ask", label: "Ask", tag: "QA" },
  { href: "/mechanisms", label: "Mechanisms", tag: "Steps" },
  { href: "/spectra", label: "Spectra", tag: "NMR" },
  { href: "/studio", label: "Assignments", tag: "Graded" },
  { href: "/studio", label: "Professor", tag: "Tools" },
];

function isActive(path: string, href: string) {
  if (href === "/") return path === "/" || path === "";
  return path === href || path.startsWith(`${href}/`);
}

export default function WorkspaceSidebar() {
  const path = usePathname() || "/";

  if (path === "/" || path === "") {
    return null;
  }

  return (
    <aside className="workspaceSidebar">
      <div className="workspaceSidebarCard card">
        <div className="cardInner workspaceSidebarInner">
          <header className="workspaceSidebarHeader">
            <div className="workspaceSidebarTitle">Workspace</div>
            <div className="subtle workspaceSidebarSubtitle">Pick a tool and stay in flow</div>
          </header>

          <nav className="workspaceNav" aria-label="Workspace">
            {ITEMS.map((item) => {
              const active = isActive(path, item.href);
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={active ? "workspaceNavPill workspaceNavPillActive" : "workspaceNavPill"}
                >
                  <span className="workspaceNavLabel">{item.label}</span>
                  <span className="workspaceNavTag">{item.tag}</span>
                </Link>
              );
            })}
          </nav>

          <SideNavTheme />
        </div>
      </div>
    </aside>
  );
}
