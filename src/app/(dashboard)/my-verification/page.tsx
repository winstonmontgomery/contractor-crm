"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { LoadingPage } from "@/components/loading"
import { VerificationBadgeLarge, VerificationChecks } from "@/components/verification-badge"
import {
  ShieldCheck,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Star,
  Trophy,
  Calendar,
  Loader2,
} from "lucide-react"
import { formatDate, getStatusColor } from "@/lib/utils"
import type {
  ContractorApplication,
  ContractorVerification,
  ContractorDocument,
} from "@/types/database"

export default function MyVerificationPage() {
  const { profile } = useAuth()
  const [application, setApplication] = useState<ContractorApplication | null>(null)
  const [verification, setVerification] = useState<ContractorVerification | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    licenseNumber: "",
    licenseState: "TX",
    licenseExpiry: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceExpiry: "",
    coverageAmount: "",
    yearsInBusiness: "",
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return

      const appRes = await supabase
        .from("contractor_applications")
        .select("*, documents:contractor_documents(*)")
        .eq("contractor_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      const verRes = await supabase
        .from("contractor_verifications")
        .select("*")
        .eq("contractor_id", profile.id)
        .maybeSingle()

      if (appRes.data) setApplication(appRes.data as ContractorApplication)
      if (verRes.data) setVerification(verRes.data as ContractorVerification)
      setLoading(false)
    }

    fetchData()
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSubmitting(true)

    const { data, error } = await supabase
      .from("contractor_applications")
      .insert({
        contractor_id: profile.id,
        status: "PENDING",
        license_number: formData.licenseNumber,
        license_state: formData.licenseState,
        license_expiry: formData.licenseExpiry || null,
        insurance_provider: formData.insuranceProvider,
        insurance_policy_number: formData.insurancePolicyNumber,
        insurance_expiry: formData.insuranceExpiry || null,
        coverage_amount: formData.coverageAmount ? parseFloat(formData.coverageAmount) : null,
        years_in_business: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
      })
      .select()
      .single()

    if (data) {
      setApplication(data)
    }

    setSubmitting(false)
  }

  if (loading) {
    return <LoadingPage message="Loading verification status..." />
  }

  // Already verified
  if (verification) {
    return (
      <div className="min-h-screen">
        <Header title="My Verification" />

        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          {/* Current Status */}
          <VerificationBadgeLarge
            level={verification.verification_level}
            verifiedAt={verification.verified_at}
          />

          {/* Verification Details */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <VerificationChecks
                licenseVerified={verification.license_verified}
                insuranceVerified={verification.insurance_verified}
                referencesVerified={verification.references_verified}
                backgroundCheck={verification.background_check}
              />

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Verified Since</Label>
                  <p className="font-medium">{formatDate(verification.verified_at)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Expires</Label>
                  <p className="font-medium">{formatDate(verification.expires_at)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Projects Completed</Label>
                  <p className="font-medium">{verification.total_projects_completed}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Average Rating</Label>
                  <p className="font-medium">
                    {verification.average_rating > 0 ? (
                      <span className="flex items-center gap-1">
                        {verification.average_rating.toFixed(1)}
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </span>
                    ) : (
                      "No reviews yet"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badge Progression */}
          <Card>
            <CardHeader>
              <CardTitle>Badge Progression</CardTitle>
              <CardDescription>
                Complete more projects and earn higher ratings to unlock advanced badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Verified */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Verified ✓</p>
                        <p className="text-sm text-muted-foreground">
                          License & insurance confirmed
                        </p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">Achieved</Badge>
                    </div>
                  </div>
                </div>

                {/* Verified Pro */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        verification.verification_level === "VERIFIED_PRO" ||
                        verification.verification_level === "VERIFIED_ELITE"
                          ? "bg-amber-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          verification.verification_level === "VERIFIED_PRO" ||
                          verification.verification_level === "VERIFIED_ELITE"
                            ? "text-amber-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Verified Pro ⭐</p>
                        <p className="text-sm text-muted-foreground">
                          10+ projects, 4.5+ rating
                        </p>
                      </div>
                      {verification.verification_level === "VERIFIED_PRO" ||
                      verification.verification_level === "VERIFIED_ELITE" ? (
                        <Badge className="bg-amber-100 text-amber-700">Achieved</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {verification.total_projects_completed}/10 projects
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verified Elite */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        verification.verification_level === "VERIFIED_ELITE"
                          ? "bg-violet-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Trophy
                        className={`h-6 w-6 ${
                          verification.verification_level === "VERIFIED_ELITE"
                            ? "text-violet-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Verified Elite 🏆</p>
                        <p className="text-sm text-muted-foreground">
                          25+ projects, 4.8+ rating, featured
                        </p>
                      </div>
                      {verification.verification_level === "VERIFIED_ELITE" ? (
                        <Badge className="bg-violet-100 text-violet-700">Achieved</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {verification.total_projects_completed}/25 projects
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Has pending application
  if (application) {
    return (
      <div className="min-h-screen">
        <Header title="My Verification" />

        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              {application.status === "PENDING" || application.status === "IN_REVIEW" ? (
                <>
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mx-auto mb-4">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Application Under Review</h2>
                  <p className="text-muted-foreground mb-6">
                    Your verification application is being reviewed by our team.
                    You&apos;ll receive an email once a decision is made.
                  </p>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.replace("_", " ")}
                  </Badge>
                </>
              ) : application.status === "MORE_INFO_NEEDED" ? (
                <>
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Additional Information Needed</h2>
                  <p className="text-muted-foreground mb-4">
                    Please review the notes below and update your application.
                  </p>
                  {application.reviewer_notes && (
                    <div className="bg-orange-50 p-4 rounded-lg text-left mb-6">
                      <p className="text-sm font-medium text-orange-800 mb-1">
                        Reviewer Notes:
                      </p>
                      <p className="text-orange-700">{application.reviewer_notes}</p>
                    </div>
                  )}
                  <Button>
                    Update Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : application.status === "REJECTED" ? (
                <>
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Application Not Approved</h2>
                  <p className="text-muted-foreground mb-4">
                    Unfortunately, your application was not approved at this time.
                  </p>
                  {application.reviewer_notes && (
                    <div className="bg-red-50 p-4 rounded-lg text-left mb-6">
                      <p className="text-sm font-medium text-red-800 mb-1">Reason:</p>
                      <p className="text-red-700">{application.reviewer_notes}</p>
                    </div>
                  )}
                  <Button variant="outline">Contact Support</Button>
                </>
              ) : null}
            </CardContent>
          </Card>

          {/* Submitted Details */}
          <Card>
            <CardHeader>
              <CardTitle>Submitted Information</CardTitle>
              <CardDescription>
                Submitted on {formatDate(application.submitted_at)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">License Number</Label>
                  <p className="font-medium">{application.license_number || "—"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">License State</Label>
                  <p className="font-medium">{application.license_state}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Insurance Provider</Label>
                  <p className="font-medium">{application.insurance_provider || "—"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Years in Business</Label>
                  <p className="font-medium">{application.years_in_business || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // No application - show form
  return (
    <div className="min-h-screen">
      <Header title="Get Verified" />

      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Benefits */}
        <Card className="bg-navy text-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white/10">
                <ShieldCheck className="h-8 w-8 text-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Get Your Verified Badge</h2>
                <p className="text-gray-300">
                  Stand out to homeowners with our trust verification
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>Higher visibility</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>More quality leads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>Build trust instantly</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Application</CardTitle>
            <CardDescription>
              Submit your license and insurance details for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">License Information</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="licenseNumber">License Number *</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, licenseNumber: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseState">State</Label>
                    <Input
                      id="licenseState"
                      value={formData.licenseState}
                      onChange={(e) =>
                        setFormData({ ...formData, licenseState: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseExpiry">Expiry Date</Label>
                    <Input
                      id="licenseExpiry"
                      type="date"
                      value={formData.licenseExpiry}
                      onChange={(e) =>
                        setFormData({ ...formData, licenseExpiry: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Insurance Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) =>
                        setFormData({ ...formData, insuranceProvider: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                    <Input
                      id="insurancePolicyNumber"
                      value={formData.insurancePolicyNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          insurancePolicyNumber: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coverageAmount">Coverage Amount ($)</Label>
                    <Input
                      id="coverageAmount"
                      type="number"
                      placeholder="1000000"
                      value={formData.coverageAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, coverageAmount: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="insuranceExpiry">Expiry Date</Label>
                    <Input
                      id="insuranceExpiry"
                      type="date"
                      value={formData.insuranceExpiry}
                      onChange={(e) =>
                        setFormData({ ...formData, insuranceExpiry: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Business Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearsInBusiness">Years in Business</Label>
                    <Input
                      id="yearsInBusiness"
                      type="number"
                      value={formData.yearsInBusiness}
                      onChange={(e) =>
                        setFormData({ ...formData, yearsInBusiness: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Upload Documents</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload license certificate, insurance certificate, and any other
                    supporting documents
                  </p>
                  <Button variant="outline" type="button">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-navy hover:bg-navy-light"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
