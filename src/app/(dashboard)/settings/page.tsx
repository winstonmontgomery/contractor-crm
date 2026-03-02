"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Building,
  Bell,
  Lock,
  CreditCard,
  Save,
  Loader2,
  Upload,
  CheckCircle,
} from "lucide-react"
import { getInitials } from "@/lib/utils"

export default function SettingsPage() {
  const { profile, refreshProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    phone: profile?.phone || "",
    company: profile?.company || "",
  })
  const supabase = createClient()

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.fullName,
        phone: formData.phone,
        company: formData.company,
      })
      .eq("id", profile.id)

    if (!error) {
      await refreshProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }

    setSaving(false)
  }

  return (
    <div className="min-h-screen">
      <Header title="Settings" />

      <div className="p-6 max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            {profile?.role === "CONTRACTOR" && (
              <TabsTrigger value="company">
                <Building className="h-4 w-4 mr-2" />
                Company
              </TabsTrigger>
            )}
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            {profile?.role === "CONTRACTOR" && (
              <TabsTrigger value="billing">
                <CreditCard className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
            )}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-lg">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profile?.email || ""}
                        disabled
                        className="mt-1 bg-muted"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(512) 555-1234"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                    {profile?.role !== "HOMEOWNER" && (
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  {saved && (
                    <span className="flex items-center gap-1 text-emerald-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Saved successfully
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Tab (Contractors only) */}
          {profile?.role === "CONTRACTOR" && (
            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Update your company details and business information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    Company settings coming soon. You can update basic company info from
                    your profile for now.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      title: "New bid invitations",
                      description: "Get notified when you receive a new bid invitation",
                    },
                    {
                      title: "Bid updates",
                      description: "Get notified when there are updates to your bids",
                    },
                    {
                      title: "Project messages",
                      description: "Get notified when you receive new messages",
                    },
                    {
                      title: "Review requests",
                      description: "Get notified when homeowners request reviews",
                    },
                    {
                      title: "Platform updates",
                      description: "Stay informed about new features and updates",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                          />
                          <span className="text-sm">Email</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                          />
                          <span className="text-sm">Push</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="mt-1"
                      />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                  <p className="text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab (Contractors only) */}
          {profile?.role === "CONTRACTOR" && (
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>
                    Manage your subscription and payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-navy/5 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold text-lg">Current Plan</p>
                        <p className="text-muted-foreground">Network Member</p>
                      </div>
                      <p className="text-2xl font-bold text-navy">$35/mo</p>
                    </div>
                    <Button>Upgrade to Performance</Button>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-4">Payment Method</h3>
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">
                          Expires 12/26
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-4">Billing History</h3>
                    <div className="text-muted-foreground text-sm">
                      No billing history available.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
