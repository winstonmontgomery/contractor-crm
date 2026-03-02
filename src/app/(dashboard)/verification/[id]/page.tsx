"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { LoadingPage } from "@/components/loading"
import { VerificationChecks } from "@/components/verification-badge"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Clock,
  User,
  Building,
  Phone,
  Mail,
  Shield,
  Calendar,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils"
import type { ContractorApplication, ContractorDocument } from "@/types/database"

export default function ApplicationReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  const [application, setApplication] = useState<ContractorApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [reviewerNotes, setReviewerNotes] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchApplication = async () => {
      const { data, error } = await supabase
        .from("contractor_applications")
        .select("*, contractor:profiles(*), documents:contractor_documents(*)")
        .eq("id", params.id)
        .single()

      if (data) {
        setApplication(data)
        setAdminNotes(data.admin_notes || "")
        setReviewerNotes(data.reviewer_notes || "")
      }
      setLoading(false)
    }

    if (profile?.role === "ADMIN" && params.id) {
      fetchApplication()
    }
  }, [profile, params.id])

  const updateStatus = async (newStatus: string) => {
    if (!application) return

    setSaving(true)

    const updates: Record<string, unknown> = {
      status: newStatus,
      admin_notes: adminNotes,
      reviewer_notes: reviewerNotes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: profile?.id,
    }

    const { error } = await supabase
      .from("contractor_applications")
      .update(updates)
      .eq("id", application.id)

    if (!error) {
      // If approved, create verification record
      if (newStatus === "APPROVED") {
        await supabase.from("contractor_verifications").insert({
          contractor_id: application.contractor_id,
          verification_level: "VERIFIED",
          verified_at: new Date().toISOString(),
          expires_at: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1 year
          verified_by: profile?.id,
          license_verified: true,
          insurance_verified: true,
          verification_notes: reviewerNotes,
        })
      }

      router.push("/verification")
    }

    setSaving(false)
  }

  if (loading) {
    return <LoadingPage message="Loading application..." />
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Application Not Found</h2>
          <Button asChild className="mt-4">
            <Link href="/verification">Back to Verification</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isPending = ["PENDING", "IN_REVIEW"].includes(application.status)

  return (
    <div className="min-h-screen">
      <Header title="Review Application" />

      <div className="p-6 space-y-6">
        {/* Back button and status */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/verification">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Verification Queue
            </Link>
          </Button>
          <Badge className={getStatusColor(application.status)}>
            {application.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contractor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contractor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="font-medium">
                      {application.contractor?.full_name || "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Company</Label>
                    <p className="font-medium">
                      {application.contractor?.company || "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{application.contractor?.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">
                      {application.contractor?.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Years in Business</Label>
                    <p className="font-medium">
                      {application.years_in_business || "—"} years
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Specialties</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {application.specialty?.map((s, i) => (
                        <Badge key={i} variant="secondary">
                          {s}
                        </Badge>
                      )) || "—"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* License Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  License Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground">License Number</Label>
                    <p className="font-medium font-mono">
                      {application.license_number || "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">State</Label>
                    <p className="font-medium">{application.license_state}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Expiry Date</Label>
                    <p
                      className={`font-medium ${
                        application.license_expiry &&
                        new Date(application.license_expiry) < new Date()
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {formatDate(application.license_expiry)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Insurance Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Provider</Label>
                    <p className="font-medium">
                      {application.insurance_provider || "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Policy Number</Label>
                    <p className="font-medium font-mono">
                      {application.insurance_policy_number || "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Coverage Amount</Label>
                    <p className="font-medium">
                      {formatCurrency(application.coverage_amount)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Expiry Date</Label>
                    <p
                      className={`font-medium ${
                        application.insurance_expiry &&
                        new Date(application.insurance_expiry) < new Date()
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {formatDate(application.insurance_expiry)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uploaded Documents
                </CardTitle>
                <CardDescription>
                  {application.documents?.length || 0} documents submitted
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!application.documents?.length ? (
                  <p className="text-muted-foreground text-center py-4">
                    No documents uploaded
                  </p>
                ) : (
                  <div className="space-y-2">
                    {application.documents.map((doc: ContractorDocument) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{doc.file_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.document_type} • Uploaded{" "}
                              {formatDate(doc.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.verified && (
                            <Badge variant="success">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            {/* Review Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Review Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reviewerNotes">Reviewer Notes (visible to contractor)</Label>
                  <Textarea
                    id="reviewerNotes"
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    placeholder="Add notes for the contractor..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="adminNotes">Admin Notes (internal only)</Label>
                  <Textarea
                    id="adminNotes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal notes..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {isPending && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => updateStatus("APPROVED")}
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve Application
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => updateStatus("MORE_INFO_NEEDED")}
                        disabled={saving}
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Request More Info
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => updateStatus("REJECTED")}
                        disabled={saving}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Application
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Submitted</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(application.submitted_at)}
                      </p>
                    </div>
                  </div>
                  {application.reviewed_at && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Reviewed</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(application.reviewed_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
