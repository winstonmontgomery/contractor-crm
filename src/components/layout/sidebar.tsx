"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ShieldCheck,
  Settings,
  FileCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Receipt,
  Star,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { VerificationBadge } from "@/components/verification-badge"
import { useState, useEffect } from "react"
import type { ContractorVerification } from "@/types/database"
import { createClient } from "@/lib/supabase/client"

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
  roles?: ("ADMIN" | "CONTRACTOR" | "HOMEOWNER")[]
  badge?: string
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    href: "/bids",
    label: "My Bids",
    icon: Receipt,
    roles: ["CONTRACTOR"],
  },
  {
    href: "/invitations",
    label: "Bid Invitations",
    icon: Briefcase,
    roles: ["CONTRACTOR"],
  },
  {
    href: "/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    href: "/reviews",
    label: "Reviews",
    icon: Star,
    roles: ["CONTRACTOR"],
  },
  {
    href: "/users",
    label: "Users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    href: "/verification",
    label: "Verification Queue",
    icon: ShieldCheck,
    roles: ["ADMIN"],
  },
  {
    href: "/my-verification",
    label: "My Verification",
    icon: FileCheck,
    roles: ["CONTRACTOR"],
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [verification, setVerification] = useState<ContractorVerification | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchVerification = async () => {
      if (profile?.role === "CONTRACTOR") {
        const { data } = await supabase
          .from("contractor_verifications")
          .select("*")
          .eq("contractor_id", profile.id)
          .single()
        if (data) setVerification(data)
      }
    }
    fetchVerification()
  }, [profile])

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    return profile?.role && item.roles.includes(profile.role)
  })

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-navy text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gold shrink-0">
          <ShieldCheck className="h-6 w-6 text-navy" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg leading-tight">Contractor</h1>
            <p className="text-xs text-gold">Verified ATX</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-gold text-navy font-medium"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-2 mx-2 mb-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>

      {/* User section */}
      <div className="p-4 border-t border-white/10">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="h-10 w-10 shrink-0 border-2 border-white/20">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-gold text-navy font-semibold">
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{profile?.full_name || "User"}</p>
              <div className="flex items-center gap-2">
                {profile?.role === "CONTRACTOR" && verification ? (
                  <VerificationBadge level={verification.verification_level} size="sm" showLabel={false} />
                ) : (
                  <p className="text-xs text-gray-400">{profile?.role}</p>
                )}
              </div>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-gray-300 hover:text-white hover:bg-white/10"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        )}
      </div>
    </aside>
  )
}
