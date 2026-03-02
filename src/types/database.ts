export type UserRole = "ADMIN" | "CONTRACTOR" | "HOMEOWNER"
export type ProjectStatus = "Lead" | "Proposal" | "Active" | "On Hold" | "Completed" | "Cancelled"
export type VerificationLevel = "VERIFIED" | "VERIFIED_PRO" | "VERIFIED_ELITE"
export type ApplicationStatus = "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "MORE_INFO_NEEDED"
export type DocumentType = "LICENSE" | "INSURANCE" | "REFERENCE" | "CERTIFICATION" | "OTHER"
export type MembershipTier = "FREE" | "NETWORK" | "PERFORMANCE"
export type BidStatus = "DRAFT" | "SUBMITTED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
export type TimelineUrgency = "FLEXIBLE" | "WITHIN_MONTH" | "WITHIN_WEEK" | "EMERGENCY"
export type PropertyType = "SINGLE_FAMILY" | "CONDO" | "TOWNHOUSE" | "MULTI_FAMILY" | "COMMERCIAL"

export type ServiceType = 
  | "GENERAL_CONTRACTING"
  | "PLUMBING"
  | "ELECTRICAL"
  | "HVAC"
  | "ROOFING"
  | "PAINTING"
  | "FLOORING"
  | "LANDSCAPING"
  | "REMODELING"
  | "NEW_CONSTRUCTION"

export type ProjectType =
  | "KITCHEN_REMODEL"
  | "BATHROOM_REMODEL"
  | "FULL_HOME_RENOVATION"
  | "ADDITION"
  | "NEW_CONSTRUCTION"
  | "ROOFING"
  | "PLUMBING"
  | "ELECTRICAL"
  | "HVAC"
  | "PAINTING"
  | "FLOORING"
  | "LANDSCAPING"
  | "OTHER"

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  GENERAL_CONTRACTING: "General Contracting",
  PLUMBING: "Plumbing",
  ELECTRICAL: "Electrical",
  HVAC: "HVAC",
  ROOFING: "Roofing",
  PAINTING: "Painting",
  FLOORING: "Flooring",
  LANDSCAPING: "Landscaping",
  REMODELING: "Remodeling",
  NEW_CONSTRUCTION: "New Construction",
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  KITCHEN_REMODEL: "Kitchen Remodel",
  BATHROOM_REMODEL: "Bathroom Remodel",
  FULL_HOME_RENOVATION: "Full Home Renovation",
  ADDITION: "Home Addition",
  NEW_CONSTRUCTION: "New Construction",
  ROOFING: "Roofing",
  PLUMBING: "Plumbing",
  ELECTRICAL: "Electrical",
  HVAC: "HVAC",
  PAINTING: "Painting",
  FLOORING: "Flooring",
  LANDSCAPING: "Landscaping",
  OTHER: "Other",
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  company: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
  // Joined
  contractor_details?: ContractorDetails
  verification?: ContractorVerification
  membership?: Membership
}

export interface ContractorDetails {
  id: string
  contractor_id: string
  company_name: string
  company_description: string | null
  company_logo_url: string | null
  founded_year: number | null
  employee_count: number | null
  street_address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  services: ServiceType[]
  service_area_radius: number
  service_states: string[]
  languages: string[]
  license_number: string | null
  license_state: string | null
  license_expiry: string | null
  insurance_provider: string | null
  insurance_policy_number: string | null
  insurance_coverage_amount: number | null
  insurance_expiry: string | null
  bonded: boolean
  bond_amount: number | null
  portfolio_images: string[]
  portfolio_descriptions: string[]
  website_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  linkedin_url: string | null
  yelp_url: string | null
  google_business_url: string | null
  total_projects_completed: number
  total_reviews: number
  average_rating: number
  response_rate: number
  on_time_rate: number
  created_at: string
  updated_at: string
}

export interface Membership {
  id: string
  contractor_id: string
  tier: MembershipTier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  status: string
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  status: ProjectStatus
  project_type: ProjectType | null
  property_type: PropertyType | null
  property_age: number | null
  square_footage: number | null
  timeline_urgency: TimelineUrgency
  budget: number | null
  budget_min: number | null
  budget_max: number | null
  start_date: string | null
  end_date: string | null
  photos: string[]
  special_requirements: string | null
  permits_needed: boolean
  is_public: boolean
  bid_deadline: string | null
  max_bids: number
  accepted_bid_id: string | null
  homeowner_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  // Joined
  homeowner?: Profile
  bids?: Bid[]
  assignments?: ProjectAssignment[]
}

export interface ProjectAssignment {
  id: string
  project_id: string
  contractor_id: string
  assigned_at: string
  notes: string | null
  contractor?: Profile
  project?: Project
}

export interface Bid {
  id: string
  project_id: string
  contractor_id: string
  status: BidStatus
  total_amount: number
  labor_cost: number | null
  materials_cost: number | null
  permit_cost: number | null
  contingency_cost: number | null
  estimated_start_date: string | null
  estimated_end_date: string | null
  estimated_duration_days: number | null
  scope_of_work: string
  inclusions: string[]
  exclusions: string[]
  payment_terms: string | null
  warranty_terms: string | null
  attachments: string[]
  cover_letter: string | null
  contractor_notes: string | null
  submitted_at: string | null
  expires_at: string | null
  accepted_at: string | null
  rejected_at: string | null
  created_at: string
  updated_at: string
  // Joined
  contractor?: Profile
  project?: Project
}

export interface Review {
  id: string
  project_id: string
  contractor_id: string
  homeowner_id: string
  overall_rating: number
  quality_rating: number | null
  communication_rating: number | null
  timeliness_rating: number | null
  value_rating: number | null
  title: string | null
  content: string
  pros: string | null
  cons: string | null
  photos: string[]
  verified_project: boolean
  contractor_response: string | null
  contractor_responded_at: string | null
  is_public: boolean
  flagged: boolean
  flagged_reason: string | null
  created_at: string
  updated_at: string
  // Joined
  contractor?: Profile
  homeowner?: Profile
  project?: Project
}

export interface Message {
  id: string
  project_id: string | null
  sender_id: string
  recipient_id: string
  subject: string | null
  content: string
  attachments: string[]
  read_at: string | null
  archived_by_sender: boolean
  archived_by_recipient: boolean
  created_at: string
  // Joined
  sender?: Profile
  recipient?: Profile
  project?: Project
}

export interface BidInvitation {
  id: string
  project_id: string
  contractor_id: string
  invited_at: string
  viewed_at: string | null
  responded_at: string | null
  response: string | null
  decline_reason: string | null
  expires_at: string
  // Joined
  project?: Project
  contractor?: Profile
}

export interface Testimonial {
  id: string
  homeowner_name: string
  homeowner_location: string | null
  homeowner_avatar_url: string | null
  content: string
  rating: number
  project_type: ProjectType | null
  contractor_name: string | null
  is_featured: boolean
  is_active: boolean
  display_order: number
  created_at: string
}

export interface ContractorApplication {
  id: string
  contractor_id: string
  status: ApplicationStatus
  license_number: string | null
  license_state: string | null
  license_expiry: string | null
  insurance_provider: string | null
  insurance_policy_number: string | null
  insurance_expiry: string | null
  coverage_amount: number | null
  years_in_business: number | null
  specialty: string[] | null
  references_provided: number
  reviewer_notes: string | null
  admin_notes: string | null
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  created_at: string
  updated_at: string
  contractor?: Profile
  documents?: ContractorDocument[]
}

export interface ContractorVerification {
  id: string
  contractor_id: string
  verification_level: VerificationLevel
  verified_at: string
  expires_at: string
  verified_by: string | null
  license_verified: boolean
  insurance_verified: boolean
  references_verified: boolean
  background_check: boolean
  featured: boolean
  total_projects_completed: number
  average_rating: number
  verification_notes: string | null
  created_at: string
  updated_at: string
  contractor?: Profile
}

export interface ContractorDocument {
  id: string
  contractor_id: string
  application_id: string | null
  document_type: DocumentType
  file_name: string
  file_url: string
  file_size: number | null
  mime_type: string | null
  verified: boolean
  verified_at: string | null
  verified_by: string | null
  expiry_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  source: string | null
  responded: boolean
  responded_at: string | null
  responded_by: string | null
  created_at: string
}

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, "created_at" | "updated_at">
        Update: Partial<Omit<Profile, "id" | "created_at">>
      }
      contractor_details: {
        Row: ContractorDetails
        Insert: Omit<ContractorDetails, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<ContractorDetails, "id" | "created_at">>
      }
      memberships: {
        Row: Membership
        Insert: Omit<Membership, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Membership, "id" | "created_at">>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Project, "id" | "created_at">>
      }
      bids: {
        Row: Bid
        Insert: Omit<Bid, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Bid, "id" | "created_at">>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Review, "id" | "created_at">>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, "id" | "created_at">
        Update: Partial<Omit<Message, "id" | "created_at">>
      }
      bid_invitations: {
        Row: BidInvitation
        Insert: Omit<BidInvitation, "id">
        Update: Partial<Omit<BidInvitation, "id">>
      }
      testimonials: {
        Row: Testimonial
        Insert: Omit<Testimonial, "id" | "created_at">
        Update: Partial<Omit<Testimonial, "id" | "created_at">>
      }
      contractor_applications: {
        Row: ContractorApplication
        Insert: Omit<ContractorApplication, "id" | "created_at" | "updated_at" | "submitted_at">
        Update: Partial<Omit<ContractorApplication, "id" | "created_at" | "submitted_at">>
      }
      contractor_verifications: {
        Row: ContractorVerification
        Insert: Omit<ContractorVerification, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<ContractorVerification, "id" | "created_at">>
      }
      contractor_documents: {
        Row: ContractorDocument
        Insert: Omit<ContractorDocument, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<ContractorDocument, "id" | "created_at">>
      }
      contact_submissions: {
        Row: ContactSubmission
        Insert: Omit<ContactSubmission, "id" | "created_at">
        Update: Partial<Omit<ContactSubmission, "id" | "created_at">>
      }
    }
    Enums: {
      user_role: UserRole
      project_status: ProjectStatus
      verification_level: VerificationLevel
      application_status: ApplicationStatus
      document_type: DocumentType
      membership_tier: MembershipTier
      bid_status: BidStatus
      service_type: ServiceType
      project_type: ProjectType
      property_type: PropertyType
      timeline_urgency: TimelineUrgency
    }
  }
}
