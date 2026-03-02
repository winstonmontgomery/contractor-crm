"use client"

import { AuthProvider } from "@/components/providers/auth-provider"
import { Sidebar } from "@/components/layout/sidebar"

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </AuthProvider>
  )
}
