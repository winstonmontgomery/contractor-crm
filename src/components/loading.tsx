import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  )
}

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = "Loading..." }: LoadingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoadingSpinner size="lg" className="text-primary" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="rounded-lg border bg-card p-6 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-4" />
      <div className="h-4 bg-muted rounded w-1/2 mb-2" />
      <div className="h-4 bg-muted rounded w-2/3" />
    </div>
  )
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b last:border-0 animate-pulse">
          <div className="flex gap-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/6" />
          </div>
        </div>
      ))}
    </div>
  )
}
