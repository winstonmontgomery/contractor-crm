import { DashboardLayoutClient } from "./layout-client"

// Force dynamic rendering for all dashboard routes
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
