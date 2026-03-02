"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Home,
  Paintbrush,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Hammer,
  TreePine,
  Upload,
  X,
  Loader2,
  Building2,
  Calendar,
  DollarSign,
  Camera,
  FileCheck,
} from "lucide-react"
import { PROJECT_TYPE_LABELS, type ProjectType, type PropertyType, type TimelineUrgency } from "@/types/database"

const projectTypes = [
  { value: "KITCHEN_REMODEL", label: "Kitchen Remodel", icon: Paintbrush },
  { value: "BATHROOM_REMODEL", label: "Bathroom Remodel", icon: Droplets },
  { value: "FULL_HOME_RENOVATION", label: "Full Home Renovation", icon: Home },
  { value: "ADDITION", label: "Home Addition", icon: Building2 },
  { value: "NEW_CONSTRUCTION", label: "New Construction", icon: Hammer },
  { value: "ROOFING", label: "Roofing", icon: Home },
  { value: "PLUMBING", label: "Plumbing", icon: Droplets },
  { value: "ELECTRICAL", label: "Electrical", icon: Zap },
  { value: "HVAC", label: "HVAC", icon: Wind },
  { value: "PAINTING", label: "Painting", icon: Paintbrush },
  { value: "FLOORING", label: "Flooring", icon: Wrench },
  { value: "LANDSCAPING", label: "Landscaping", icon: TreePine },
  { value: "OTHER", label: "Other", icon: Wrench },
]

const propertyTypes = [
  { value: "SINGLE_FAMILY", label: "Single Family Home" },
  { value: "CONDO", label: "Condo/Apartment" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "MULTI_FAMILY", label: "Multi-Family" },
  { value: "COMMERCIAL", label: "Commercial" },
]

const timelineOptions = [
  { value: "FLEXIBLE", label: "Flexible - No rush" },
  { value: "WITHIN_MONTH", label: "Within 1-2 months" },
  { value: "WITHIN_WEEK", label: "Within 1-2 weeks" },
  { value: "EMERGENCY", label: "Emergency - ASAP" },
]

const budgetRanges = [
  { min: 0, max: 5000, label: "Under $5,000" },
  { min: 5000, max: 15000, label: "$5,000 - $15,000" },
  { min: 15000, max: 30000, label: "$15,000 - $30,000" },
  { min: 30000, max: 50000, label: "$30,000 - $50,000" },
  { min: 50000, max: 100000, label: "$50,000 - $100,000" },
  { min: 100000, max: 250000, label: "$100,000 - $250,000" },
  { min: 250000, max: 999999, label: "$250,000+" },
]

const steps = [
  { number: 1, title: "Project Type", icon: Wrench },
  { number: 2, title: "Property Details", icon: Home },
  { number: 3, title: "Timeline & Budget", icon: Calendar },
  { number: 4, title: "Photos", icon: Camera },
  { number: 5, title: "Review", icon: FileCheck },
]

interface FormData {
  projectType: ProjectType | ""
  projectName: string
  description: string
  propertyType: PropertyType | ""
  propertyAge: string
  squareFootage: string
  address: string
  city: string
  state: string
  zipCode: string
  timeline: TimelineUrgency | ""
  budgetMin: number
  budgetMax: number
  specialRequirements: string
  permitsNeeded: boolean
  photos: string[]
  contactName: string
  contactEmail: string
  contactPhone: string
}

export default function StartProjectPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    projectType: "",
    projectName: "",
    description: "",
    propertyType: "",
    propertyAge: "",
    squareFootage: "",
    address: "",
    city: "Austin",
    state: "TX",
    zipCode: "",
    timeline: "",
    budgetMin: 0,
    budgetMax: 0,
    specialRequirements: "",
    permitsNeeded: false,
    photos: [],
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  })

  const updateFormData = (field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectBudget = (min: number, max: number) => {
    updateFormData("budgetMin", min)
    updateFormData("budgetMax", max)
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/signup?role=HOMEOWNER&redirect=/dashboard")
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.projectType !== ""
      case 2:
        return formData.propertyType !== "" && formData.city && formData.zipCode
      case 3:
        return formData.timeline !== "" && formData.budgetMax > 0
      case 4:
        return true // Photos are optional
      case 5:
        return formData.contactName && formData.contactEmail
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Start Your Project</h1>
          <p className="text-gray-600">Get free quotes from verified contractors in minutes</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "step-indicator",
                      currentStep === step.number && "active",
                      currentStep > step.number && "completed"
                    )}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-1 w-12 sm:w-20 mx-2",
                      currentStep > step.number ? "bg-emerald-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Step 1: Project Type */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-navy mb-2">
                  What type of project do you need help with?
                </h2>
                <p className="text-gray-600 mb-8">
                  Select the category that best describes your project
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {projectTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateFormData("projectType", type.value as ProjectType)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                        formData.projectType === type.value
                          ? "border-navy bg-navy/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <type.icon
                        className={cn(
                          "h-8 w-8",
                          formData.projectType === type.value ? "text-navy" : "text-gray-400"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium text-center",
                          formData.projectType === type.value ? "text-navy" : "text-gray-600"
                        )}
                      >
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>

                {formData.projectType && (
                  <div className="mt-8 space-y-4">
                    <div>
                      <Label htmlFor="projectName">Project Name (optional)</Label>
                      <Input
                        id="projectName"
                        placeholder="e.g., Master Bathroom Renovation"
                        value={formData.projectName}
                        onChange={(e) => updateFormData("projectName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Describe your project</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell us more about what you're looking to accomplish..."
                        value={formData.description}
                        onChange={(e) => updateFormData("description", e.target.value)}
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Property Details */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-navy mb-2">
                  Tell us about your property
                </h2>
                <p className="text-gray-600 mb-8">
                  This helps contractors provide accurate quotes
                </p>

                <div className="space-y-6">
                  <div>
                    <Label>Property Type</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                      {propertyTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => updateFormData("propertyType", type.value as PropertyType)}
                          className={cn(
                            "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                            formData.propertyType === type.value
                              ? "border-navy bg-navy/5 text-navy"
                              : "border-gray-200 hover:border-gray-300 text-gray-600"
                          )}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="propertyAge">Property Age (years)</Label>
                      <Input
                        id="propertyAge"
                        type="number"
                        placeholder="e.g., 15"
                        value={formData.propertyAge}
                        onChange={(e) => updateFormData("propertyAge", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="squareFootage">Square Footage</Label>
                      <Input
                        id="squareFootage"
                        type="number"
                        placeholder="e.g., 2500"
                        value={formData.squareFootage}
                        onChange={(e) => updateFormData("squareFootage", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => updateFormData("state", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="78701"
                        value={formData.zipCode}
                        onChange={(e) => updateFormData("zipCode", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Timeline & Budget */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-navy mb-2">
                  Timeline & Budget
                </h2>
                <p className="text-gray-600 mb-8">
                  Help contractors understand your expectations
                </p>

                <div className="space-y-8">
                  <div>
                    <Label className="text-lg">When do you want to start?</Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {timelineOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateFormData("timeline", option.value as TimelineUrgency)}
                          className={cn(
                            "p-4 rounded-lg border-2 text-left transition-all",
                            formData.timeline === option.value
                              ? "border-navy bg-navy/5"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <span
                            className={cn(
                              "font-medium",
                              formData.timeline === option.value ? "text-navy" : "text-gray-700"
                            )}
                          >
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg">What&apos;s your budget range?</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                      {budgetRanges.map((range) => (
                        <button
                          key={range.label}
                          onClick={() => selectBudget(range.min, range.max)}
                          className={cn(
                            "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                            formData.budgetMin === range.min && formData.budgetMax === range.max
                              ? "border-navy bg-navy/5 text-navy"
                              : "border-gray-200 hover:border-gray-300 text-gray-600"
                          )}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialRequirements">Special Requirements (optional)</Label>
                    <Textarea
                      id="specialRequirements"
                      placeholder="Any specific materials, accessibility needs, or other requirements..."
                      value={formData.specialRequirements}
                      onChange={(e) => updateFormData("specialRequirements", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="permitsNeeded"
                      checked={formData.permitsNeeded}
                      onChange={(e) => updateFormData("permitsNeeded", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="permitsNeeded" className="font-normal">
                      I believe this project may require permits
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Photos */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-navy mb-2">
                  Add Photos (Optional)
                </h2>
                <p className="text-gray-600 mb-8">
                  Photos help contractors provide more accurate quotes
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop photos here, or click to browse
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    PNG, JPG up to 10MB each
                  </p>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  You can skip this step and add photos later from your dashboard.
                </p>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-navy mb-2">
                  Review Your Project
                </h2>
                <p className="text-gray-600 mb-8">
                  Confirm the details and create your account to receive quotes
                </p>

                <div className="space-y-6">
                  {/* Project Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-navy mb-4">Project Summary</h3>
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-gray-500">Project Type</dt>
                        <dd className="font-medium">{PROJECT_TYPE_LABELS[formData.projectType as ProjectType] || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Property Type</dt>
                        <dd className="font-medium">{propertyTypes.find(p => p.value === formData.propertyType)?.label || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Location</dt>
                        <dd className="font-medium">{formData.city}, {formData.state} {formData.zipCode}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Timeline</dt>
                        <dd className="font-medium">{timelineOptions.find(t => t.value === formData.timeline)?.label || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Budget</dt>
                        <dd className="font-medium">{budgetRanges.find(b => b.min === formData.budgetMin)?.label || "—"}</dd>
                      </div>
                    </dl>
                    {formData.description && (
                      <div className="mt-4 pt-4 border-t">
                        <dt className="text-gray-500 text-sm mb-1">Description</dt>
                        <dd className="text-sm">{formData.description}</dd>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold text-navy mb-4">Your Contact Information</h3>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="contactName">Full Name *</Label>
                        <Input
                          id="contactName"
                          placeholder="John Doe"
                          value={formData.contactName}
                          onChange={(e) => updateFormData("contactName", e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactEmail">Email *</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.contactEmail}
                          onChange={(e) => updateFormData("contactEmail", e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone">Phone (optional)</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          placeholder="(512) 555-1234"
                          value={formData.contactPhone}
                          onChange={(e) => updateFormData("contactPhone", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    By submitting, you agree to our{" "}
                    <a href="/terms" className="text-navy hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" className="text-navy hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-navy hover:bg-navy-light"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className="bg-gold hover:bg-gold-light text-navy font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit & Get Quotes
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
