"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LoadingTable } from "@/components/loading"
import { VerificationBadge } from "@/components/verification-badge"
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Eye,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { formatDate, formatDateTime, getStatusColor } from "@/lib/utils"
import type { ContractorApplication, ContractorVerification } from "@/types/database"

export default function VerificationPage() {
  const { profile } = useAuth()
  const [applications, setApplications] = useState<ContractorApplication[]>([])
  const [verifications, setVerifications] = useState<ContractorVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const [appsRes, verificationsRes] = await Promise.all([
        supabase
          .from("contractor_applications")
          .select("*, contractor:profiles(*), documents:contractor_documents(*)")
          .order("submitted_at", { ascending: false }),
        supabase
          .from("contractor_verifications")
          .select("*, contractor:profiles(*)")
          .order("verified_at", { ascending: false }),
      ])

      if (appsRes.data) setApplications(appsRes.data)
      if (verificationsRes.data) setVerifications(verificationsRes.data)
      setLoading(false)
    }

    if (profile?.role === "ADMIN") {
      fetchData()
    }
  }, [profile])

  const pendingApps = applications.filter((a) =>
    ["PENDING", "IN_REVIEW"].includes(a.status)
  )
  const approvedApps = applications.filter((a) => a.status === "APPROVED")
  const rejectedApps = applications.filter((a) => a.status === "REJECTED")

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      !search ||
      app.contractor?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.contractor?.company?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = [
    {
      title: "Pending Review",
      value: pendingApps.length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Approved",
      value: approvedApps.length,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Rejected",
      value: rejectedApps.length,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Total Verified",
      value: verifications.length,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ]

  if (profile?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don&apos;t have permission to view this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Verification Management" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">
              Applications
              {pendingApps.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingApps.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="verified">Verified Contractors</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {["all", "PENDING", "IN_REVIEW", "APPROVED", "REJECTED"].map(
                  (status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status === "all" ? "All" : status.replace("_", " ")}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Applications Table */}
            {loading ? (
              <LoadingTable rows={5} />
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Insurance</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">
                            {app.contractor?.full_name || "—"}
                          </TableCell>
                          <TableCell>{app.contractor?.company || "—"}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {app.license_number ? (
                              <span className="text-sm">
                                {app.license_number}
                                <br />
                                <span className="text-muted-foreground">
                                  Exp: {formatDate(app.license_expiry)}
                                </span>
                              </span>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {app.insurance_provider ? (
                              <span className="text-sm">
                                {app.insurance_provider}
                                <br />
                                <span className="text-muted-foreground">
                                  Exp: {formatDate(app.insurance_expiry)}
                                </span>
                              </span>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>{formatDateTime(app.submitted_at)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/verification/${app.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="verified" className="space-y-4">
            {loading ? (
              <LoadingTable rows={5} />
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Badge Level</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Verified Since</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No verified contractors yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      verifications.map((v) => (
                        <TableRow key={v.id}>
                          <TableCell className="font-medium">
                            {v.contractor?.full_name || "—"}
                          </TableCell>
                          <TableCell>{v.contractor?.company || "—"}</TableCell>
                          <TableCell>
                            <VerificationBadge level={v.verification_level} />
                          </TableCell>
                          <TableCell>{v.total_projects_completed}</TableCell>
                          <TableCell>
                            {v.average_rating > 0 ? (
                              <span className="flex items-center gap-1">
                                {v.average_rating.toFixed(1)}
                                <span className="text-yellow-500">★</span>
                              </span>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>{formatDate(v.verified_at)}</TableCell>
                          <TableCell>
                            <span
                              className={
                                new Date(v.expires_at) < new Date()
                                  ? "text-red-600"
                                  : ""
                              }
                            >
                              {formatDate(v.expires_at)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/users/${v.contractor_id}`}>
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
