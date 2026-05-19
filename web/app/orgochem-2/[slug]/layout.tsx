import type { ReactNode } from "react";
import "../../../styles/orgopivy-design-system.css";
import OrgChem2TopicSubNavSlot from "@/components/OrgChem2TopicSubNavSlot";
import ToastHost from "@/components/Toast";

export default function OrgChem2TopicSlugLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <OrgChem2TopicSubNavSlot />
      {children}
      <ToastHost />
    </>
  );
}
