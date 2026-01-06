// web/app/components/TopNavClient.tsx
// Full replacement file

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNavClient() {
  const path = usePathname() || "/";

  function pillClass(href: string) {
    const active = path === href || (href !== "/" && path.startsWith(href));
    return active ? "pill pillActive" : "pill";
  }

  return (
    <div className="topNav">
      <Link className={pillClass("/")} href="/">
        Home
      </Link>

      <Link className={pillClass("/orgochem-1")} href="/orgochem-1">
        OrgoChem I
      </Link>

      <Link className={pillClass("/orgochem-2")} href="/orgochem-2">
        OrgoChem II
      </Link>

      <Link className={pillClass("/uploads")} href="/uploads">
        Upload
      </Link>

      <Link className={pillClass("/search")} href="/search">
        Search
      </Link>

      <Link className={pillClass("/ask")} href="/ask">
        Ask
      </Link>

      <Link className={pillClass("/practice")} href="/practice">
        Practice
      </Link>
    </div>
  );
}
