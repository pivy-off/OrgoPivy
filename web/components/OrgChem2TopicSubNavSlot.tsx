"use client";

import { usePathname } from "next/navigation";
import TopicSubNav from "@/components/TopicSubNav";

/** Sub-nav at top for tool routes; main topic page renders nav below hero instead. */
export default function OrgChem2TopicSubNavSlot() {
  const pathname = usePathname() ?? "";
  const m = pathname.match(/^\/orgochem-2\/([^/]+)\/?$/);
  if (m) return null;
  if (!pathname.startsWith("/orgochem-2/")) return null;
  return <TopicSubNav />;
}
