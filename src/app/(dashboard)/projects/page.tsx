"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LoadingTable } from "@/components/loading"
import { Plus, Search, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import type { Project, ProjectStatus } from "@/types/database"

const PROJECT_STATUSES: ProjectStatus[] = [
  "Lead",
  "Proposal",
  "Active",
  "On Hold",
  "Completed",
  "Cancelled",
]

type SortField = "name" | "status" | "created_at" | "budget"
type SortOrder = "asc" | "desc"

export default function ProjectsPage() {
  const { profile } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all")
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const supabase = createClient()

  useEffect(() => {
    const fetchProjects = async () => {
      if (!profile) return

      let query = supabase
        .from("projects")
        .select("*, homeowner:profiles!projects_homeowner_id_fkey(*)")

      // Role-based filtering is handled by RLS, but we can add explicit filters
      if (profile.role === "HOMEOWNER") {
        query = query.eq("homeowner_id", profile.id)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (!error && data) {
        setProjects(data)
      }
      setLoading(false)
    }

    fetchProjects()
  }, [profile])

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.address?.toLowerCase().includes(searchLower) ||
          p.city?.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "budget":
          comparison = (a.budget || 0) - (b.budget || 0)
          break
        case "created_at":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [projects, search, statusFilter, sortField, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Projects" />

      <div className="p-6 space-y-6">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as ProjectStatus | "all")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {PROJECT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {profile?.role === "ADMIN" && (
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          )}
        </div>

        {/* Projects Table */}
        {loading ? (
          <LoadingTable rows={8} />
        ) : (
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => toggleSort("name")}
                    >
                      Project Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => toggleSort("status")}
                    >
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => toggleSort("budget")}
                    >
                      Budget
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => toggleSort("created_at")}
                    >
                      Created
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Homeowner</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No projects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/projects/${project.id}`}
                          className="hover:underline"
                        >
                          {project.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {project.address && (
                          <span className="text-sm">
                            {project.address}, {project.city}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(project.budget)}</TableCell>
                      <TableCell>{formatDate(project.created_at)}</TableCell>
                      <TableCell>
                        {project.homeowner?.full_name || "—"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/projects/${project.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedProjects.length} of {projects.length} projects
        </div>
      </div>
    </div>
  )
}
