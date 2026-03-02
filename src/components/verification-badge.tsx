"use client"

import { cn } from "@/lib/utils"
import type { VerificationLevel } from "@/types/database"
import { CheckCircle, Star, Trophy, Shield } from "lucide-react"

interface VerificationBadgeProps {
  level: VerificationLevel | null
  size?: "sm" | "md" | "lg" | "xl"
  showLabel?: boolean
  className?: string
}

const badgeConfig: Record<
  VerificationLevel,
  {
    icon: typeof CheckCircle
    label: string
    shortLabel: string
    colors: string
    iconColor: string
    description: string
  }
> = {
  VERIFIED: {
    icon: CheckCircle,
    label: "Verified Contractor",
    shortLabel: "Verified",
    colors: "bg-emerald-100 text-emerald-800 border-emerald-300",
    iconColor: "text-emerald-600",
    description: "License & insurance confirmed",
  },
  VERIFIED_PRO: {
    icon: Star,
    label: "Verified Pro",
    shortLabel: "Pro",
    colors: "bg-amber-100 text-amber-800 border-amber-300",
    iconColor: "text-amber-500",
    description: "10+ projects, 4.5+ rating",
  },
  VERIFIED_ELITE: {
    icon: Trophy,
    label: "Verified Elite",
    shortLabel: "Elite",
    colors: "bg-violet-100 text-violet-800 border-violet-300",
    iconColor: "text-violet-600",
    description: "25+ projects, 4.8+ rating, featured",
  },
}

const sizeConfig = {
  sm: {
    badge: "px-2 py-0.5 text-xs gap-1",
    icon: "h-3 w-3",
  },
  md: {
    badge: "px-2.5 py-1 text-sm gap-1.5",
    icon: "h-4 w-4",
  },
  lg: {
    badge: "px-3 py-1.5 text-base gap-2",
    icon: "h-5 w-5",
  },
  xl: {
    badge: "px-4 py-2 text-lg gap-2.5",
    icon: "h-6 w-6",
  },
}

export function VerificationBadge({
  level,
  size = "md",
  showLabel = true,
  className,
}: VerificationBadgeProps) {
  if (!level) return null

  const config = badgeConfig[level]
  const sizeStyles = sizeConfig[size]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border",
        config.colors,
        sizeStyles.badge,
        className
      )}
      title={config.description}
    >
      <Icon className={cn(sizeStyles.icon, config.iconColor)} />
      {showLabel && <span>{config.shortLabel}</span>}
    </span>
  )
}

// Large badge for profile pages
interface VerificationBadgeLargeProps {
  level: VerificationLevel | null
  verifiedAt?: string | null
  className?: string
}

export function VerificationBadgeLarge({
  level,
  verifiedAt,
  className,
}: VerificationBadgeLargeProps) {
  if (!level) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200",
          className
        )}
      >
        <Shield className="h-10 w-10 text-gray-400" />
        <div>
          <p className="font-medium text-gray-700">Not Yet Verified</p>
          <p className="text-sm text-gray-500">
            Apply for verification to earn trust badges
          </p>
        </div>
      </div>
    )
  }

  const config = badgeConfig[level]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border-2",
        config.colors,
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center h-14 w-14 rounded-full bg-white shadow-sm",
          config.iconColor
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
      <div>
        <p className="font-bold text-lg">{config.label}</p>
        <p className="text-sm opacity-80">{config.description}</p>
        {verifiedAt && (
          <p className="text-xs mt-1 opacity-60">
            Verified since{" "}
            {new Date(verifiedAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  )
}

// Badge stack showing all verification checks
interface VerificationChecksProps {
  licenseVerified?: boolean
  insuranceVerified?: boolean
  referencesVerified?: boolean
  backgroundCheck?: boolean
  className?: string
}

export function VerificationChecks({
  licenseVerified,
  insuranceVerified,
  referencesVerified,
  backgroundCheck,
  className,
}: VerificationChecksProps) {
  const checks = [
    { label: "License", verified: licenseVerified },
    { label: "Insurance", verified: insuranceVerified },
    { label: "References", verified: referencesVerified },
    { label: "Background", verified: backgroundCheck },
  ]

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {checks.map((check) => (
        <span
          key={check.label}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
            check.verified
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          )}
        >
          {check.verified ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <div className="h-3 w-3 rounded-full border-2 border-current" />
          )}
          {check.label}
        </span>
      ))}
    </div>
  )
}
