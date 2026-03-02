"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingPage } from "@/components/loading"
import { VerificationBadgeLarge } from "@/components/verification-badge"
import {
  FolderKanban,
  Users,
  ShieldCheck,
  Clock,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import type { Project, ContractorVerification, ContractorApplication } from "@/types/database"

interface DashboardStats {
  totalProjects: number
  activeProjects: number
  totalUsers: number
  pendingVerifications: number
  recentProjects: Project[]
  pendingApplications: ContractorApplication[]
}

export default function DashboardPage() {
  const { profile, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [verification, setVerification] = useState<ContractorVerification | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!profile) return

    const fetchDashboardData = async () => {
      setLoading(true)

      if (profile.role === "ADMIN") {
        // Admin dashboard data
        const [projectsRes, usersRes, applicationsRes, recentProjectsRes] = await Promise.all([
          supabase.from("projects").select("id, status"),
          supabase.from("profiles").select("id"),
          supabase
            .from("contractor_applications")
            .select("*, contractor:profiles(*)")
            .in("status", ["PENDING", "IN_REVIEW"])
            .order("submitted_at", { ascending: false })
            .limit(5),
          supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
        ])

        const projectsList = projectsRes.data || []
        const activeProjects = projectsList.filter(
          (p: { status: string }) => p.status === "Active"
        ).length

        setStats({
          totalProjects: projectsList.length,
          activeProjects,
          totalUsers: (usersRes.data || []).length,
          pendingVerifications: applicationsRes.data?.length || 0,
          recentProjects: recentProjectsRes.data || [],
          pendingApplications: applicationsRes.data || [],
        })
      } else if (profile.role === "CONTRACTOR") {
        // Contractor dashboard - their projects and verification status
        const [projectsRes, verificationRes] = await Promise.all([
          supabase
            .from("project_assignments")
            .select("*, project:projects(*)")
            .eq("contractor_id", profile.id),
          supabase
            .from("contractor_verifications")
            .select("*")
            .eq("contractor_id", profile.id)
            .single(),
        ])

        const assignmentsData = projectsRes.data as Array<{ project: Project }> | null
        const projects = assignmentsData?.map((a) => a.project).filter(Boolean) || []
        const activeProjects = projects.filter((p) => p?.status === "Active").length

        setStats({
          totalProjects: projects.length,
          activeProjects,
          totalUsers: 0,
          pendingVerifications: 0,
          recentProjects: projects.slice(0, 5),
          pendingApplications: [],
        })
        setVerification(verificationRes.data)
      } else {
        // Homeowner dashboard - their projects
        const projectsRes = await supabase
          .from("projects")
          .select("*")
          .eq("homeowner_id", profile.id)
          .order("created_at", { ascending: false })

        const projects = (projectsRes.data || []) as Project[]
        const activeProjects = projects.filter((p) => p.status === "Active").length

        setStats({
          totalProjects: projects.length,
          activeProjects,
          totalUsers: 0,
          pendingVerifications: 0,
          recentProjects: projects.slice(0, 5),
          pendingApplications: [],
        })
      }

      setLoading(false)
    }

    fetchDashboardData()
  }, [profile])

  if (authLoading || loading) {
    return <LoadingPage message="Loading dashboard..." />
  }

  return (
    <div className="min-h-screen">
      <Header title={`Welcome back, ${profile?.full_name?.split(" ")[0] || "User"}`} />

      <div className="p-6 space-y-6">
        {/* Admin Stats Cards */}
        {profile?.role === "ADMIN" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.activeProjects} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Contractors & homeowners</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingVerifications}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeProjects}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contractor Verification Status */}
        {profile?.role === "CONTRACTOR" && (
          <div className="grid gap-4 md:grid-cols-2">
            <VerificationBadgeLarge
              level={verification?.verification_level || null}
              verifiedAt={verification?.verified_at}
            />
            {!verification && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Get Verified</CardTitle>
                  <CardDescription>
                    Stand out to homeowners with a verified badge
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/my-verification">
                      Apply for Verification
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Homeowner/Contractor Stats */}
        {profile?.role !== "ADMIN" && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalProjects}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeProjects}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.recentProjects.filter((p) => p.status === "Completed").length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Latest project activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/projects">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {stats?.recentProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No projects yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats?.recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{project.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {project.address}, {project.city}
                        </p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Verifications (Admin Only) */}
          {profile?.role === "ADMIN" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Verification Queue</CardTitle>
                  <CardDescription>Applications awaiting review</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/verification">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {stats?.pendingApplications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending applications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats?.pendingApplications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {app.contractor?.full_name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {app.contractor?.company}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.replace("_", " ")}
                          </Badge>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/verification/${app.id}`}>
                              Review
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions for non-admins */}
          {profile?.role !== "ADMIN" && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.role === "HOMEOWNER" && (
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/projects/new">
                      <FolderKanban className="mr-2 h-4 w-4" />
                      Create New Project
                    </Link>
                  </Button>
                )}
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/projects">
                    <FolderKanban className="mr-2 h-4 w-4" />
                    View All Projects
                  </Link>
                </Button>
                {profile?.role === "CONTRACTOR" && (
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/my-verification">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Verification Status
                    </Link>
                  </Button>
                )}
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/settings/profile">
                    <Users className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
