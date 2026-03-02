"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LoadingTable } from "@/components/loading"
import { VerificationBadge } from "@/components/verification-badge"
import {
  Search,
  Users,
  HardHat,
  Home,
  Shield,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { formatDate, getInitials } from "@/lib/utils"
import type { Profile, ContractorVerification } from "@/types/database"

interface UserWithVerification extends Profile {
  verification?: ContractorVerification
}

export default function UsersPage() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<UserWithVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const supabase = createClient()

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (profiles) {
        // Fetch verifications for contractors
        const contractorIds = profiles
          .filter((p) => p.role === "CONTRACTOR")
          .map((p) => p.id)

        if (contractorIds.length > 0) {
          const { data: verifications } = await supabase
            .from("contractor_verifications")
            .select("*")
            .in("contractor_id", contractorIds)

          const verificationsMap = new Map(
            verifications?.map((v) => [v.contractor_id, v]) || []
          )

          const usersWithVerifications = profiles.map((p) => ({
            ...p,
            verification: verificationsMap.get(p.id),
          }))

          setUsers(usersWithVerifications)
        } else {
          setUsers(profiles)
        }
      }

      setLoading(false)
    }

    if (profile?.role === "ADMIN") {
      fetchUsers()
    }
  }, [profile])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !search ||
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.company?.toLowerCase().includes(search.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const stats = {
    total: users.length,
    contractors: users.filter((u) => u.role === "CONTRACTOR").length,
    homeowners: users.filter((u) => u.role === "HOMEOWNER").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "CONTRACTOR":
        return <HardHat className="h-4 w-4" />
      case "HOMEOWNER":
        return <Home className="h-4 w-4" />
      case "ADMIN":
        return <Shield className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "CONTRACTOR":
        return "bg-blue-100 text-blue-700"
      case "HOMEOWNER":
        return "bg-green-100 text-green-700"
      case "ADMIN":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (profile?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
      <Header title="User Management" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-100">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <HardHat className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contractors</p>
                <p className="text-2xl font-bold">{stats.contractors}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Home className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Homeowners</p>
                <p className="text-2xl font-bold">{stats.homeowners}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">{stats.admins}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="CONTRACTOR">Contractors</SelectItem>
              <SelectItem value="HOMEOWNER">Homeowners</SelectItem>
              <SelectItem value="ADMIN">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        {loading ? (
          <LoadingTable rows={8} />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>
                              {getInitials(user.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.full_name || "Unnamed User"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          <span className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>{user.company || "—"}</TableCell>
                      <TableCell>
                        {user.role === "CONTRACTOR" ? (
                          user.verification ? (
                            <VerificationBadge
                              level={user.verification.verification_level}
                              size="sm"
                            />
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Not verified
                            </span>
                          )
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/users/${user.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
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

        {/* Summary */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </div>
  )
}
