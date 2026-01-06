import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function PageShell({ children }: Props) {
  return <div className="pageShell">{children}</div>
}
