-- Full Platform Schema Extension
-- Contractor Verified ATX - Production Ready

-- Additional enums
CREATE TYPE service_type AS ENUM (
  'GENERAL_CONTRACTING',
  'PLUMBING',
  'ELECTRICAL',
  'HVAC',
  'ROOFING',
  'PAINTING',
  'FLOORING',
  'LANDSCAPING',
  'REMODELING',
  'NEW_CONSTRUCTION'
);

CREATE TYPE membership_tier AS ENUM ('FREE', 'NETWORK', 'PERFORMANCE');
CREATE TYPE bid_status AS ENUM ('DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
CREATE TYPE project_type AS ENUM (
  'KITCHEN_REMODEL',
  'BATHROOM_REMODEL', 
  'FULL_HOME_RENOVATION',
  'ADDITION',
  'NEW_CONSTRUCTION',
  'ROOFING',
  'PLUMBING',
  'ELECTRICAL',
  'HVAC',
  'PAINTING',
  'FLOORING',
  'LANDSCAPING',
  'OTHER'
);
CREATE TYPE property_type AS ENUM ('SINGLE_FAMILY', 'CONDO', 'TOWNHOUSE', 'MULTI_FAMILY', 'COMMERCIAL');
CREATE TYPE timeline_urgency AS ENUM ('FLEXIBLE', 'WITHIN_MONTH', 'WITHIN_WEEK', 'EMERGENCY');

-- Contractor Details (extended profile for contractors)
CREATE TABLE contractor_details (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_description TEXT,
  company_logo_url TEXT,
  founded_year INTEGER,
  employee_count INTEGER,
  
  -- Address
  street_address TEXT,
  city TEXT DEFAULT 'Austin',
  state TEXT DEFAULT 'TX',
  zip_code TEXT,
  
  -- Services
  services service_type[] DEFAULT '{}',
  service_area_radius INTEGER DEFAULT 50, -- miles
  service_states TEXT[] DEFAULT ARRAY['TX'],
  
  -- Languages
  languages TEXT[] DEFAULT ARRAY['English'],
  
  -- License & Insurance
  license_number TEXT,
  license_state TEXT DEFAULT 'TX',
  license_expiry DATE,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  insurance_coverage_amount DECIMAL(12, 2),
  insurance_expiry DATE,
  bonded BOOLEAN DEFAULT false,
  bond_amount DECIMAL(12, 2),
  
  -- Portfolio
  portfolio_images TEXT[] DEFAULT '{}',
  portfolio_descriptions TEXT[] DEFAULT '{}',
  website_url TEXT,
  
  -- Social
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  yelp_url TEXT,
  google_business_url TEXT,
  
  -- Stats (updated by triggers)
  total_projects_completed INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  response_rate DECIMAL(5, 2) DEFAULT 0,
  on_time_rate DECIMAL(5, 2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Memberships (Stripe integration)
CREATE TABLE memberships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier membership_tier DEFAULT 'FREE' NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  status TEXT DEFAULT 'active', -- active, canceled, past_due, trialing
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Update projects table with more fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type project_type;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS property_type property_type;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS property_age INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS square_footage INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS timeline_urgency timeline_urgency DEFAULT 'FLEXIBLE';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_min DECIMAL(12, 2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_max DECIMAL(12, 2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS special_requirements TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS permits_needed BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS bid_deadline TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS max_bids INTEGER DEFAULT 5;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS accepted_bid_id UUID;

-- Bids table
CREATE TABLE bids (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status bid_status DEFAULT 'DRAFT' NOT NULL,
  
  -- Pricing
  total_amount DECIMAL(12, 2) NOT NULL,
  labor_cost DECIMAL(12, 2),
  materials_cost DECIMAL(12, 2),
  permit_cost DECIMAL(12, 2),
  contingency_cost DECIMAL(12, 2),
  
  -- Timeline
  estimated_start_date DATE,
  estimated_end_date DATE,
  estimated_duration_days INTEGER,
  
  -- Scope
  scope_of_work TEXT NOT NULL,
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  payment_terms TEXT,
  warranty_terms TEXT,
  
  -- Attachments
  attachments TEXT[] DEFAULT '{}',
  
  -- Communication
  cover_letter TEXT,
  contractor_notes TEXT,
  
  submitted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(project_id, contractor_id)
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  homeowner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Ratings (1-5)
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  
  -- Review content
  title TEXT,
  content TEXT NOT NULL,
  pros TEXT,
  cons TEXT,
  
  -- Photos
  photos TEXT[] DEFAULT '{}',
  
  -- Verification
  verified_project BOOLEAN DEFAULT true,
  
  -- Contractor response
  contractor_response TEXT,
  contractor_responded_at TIMESTAMPTZ,
  
  -- Moderation
  is_public BOOLEAN DEFAULT true,
  flagged BOOLEAN DEFAULT false,
  flagged_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(project_id, homeowner_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  subject TEXT,
  content TEXT NOT NULL,
  
  -- Attachments
  attachments TEXT[] DEFAULT '{}',
  
  -- Status
  read_at TIMESTAMPTZ,
  archived_by_sender BOOLEAN DEFAULT false,
  archived_by_recipient BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Bid invitations (for Performance-Qualified members)
CREATE TABLE bid_invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  invited_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  response TEXT, -- 'accepted', 'declined', 'expired'
  decline_reason TEXT,
  
  expires_at TIMESTAMPTZ NOT NULL,
  
  UNIQUE(project_id, contractor_id)
);

-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  source TEXT, -- 'contact_page', 'footer', etc.
  responded BOOLEAN DEFAULT false,
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Testimonials (for homepage)
CREATE TABLE testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  homeowner_name TEXT NOT NULL,
  homeowner_location TEXT,
  homeowner_avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  project_type project_type,
  contractor_name TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX idx_contractor_details_contractor ON contractor_details(contractor_id);
CREATE INDEX idx_contractor_details_services ON contractor_details USING GIN(services);
CREATE INDEX idx_memberships_contractor ON memberships(contractor_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_bids_project ON bids(project_id);
CREATE INDEX idx_bids_contractor ON bids(contractor_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_reviews_contractor ON reviews(contractor_id);
CREATE INDEX idx_reviews_project ON reviews(project_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_project ON messages(project_id);
CREATE INDEX idx_bid_invitations_contractor ON bid_invitations(contractor_id);
CREATE INDEX idx_bid_invitations_project ON bid_invitations(project_id);

-- Enable RLS
ALTER TABLE contractor_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Contractor Details
CREATE POLICY "Public can view contractor details" ON contractor_details
  FOR SELECT USING (true);

CREATE POLICY "Contractors can update own details" ON contractor_details
  FOR UPDATE TO authenticated USING (contractor_id = auth.uid());

CREATE POLICY "Contractors can insert own details" ON contractor_details
  FOR INSERT TO authenticated WITH CHECK (contractor_id = auth.uid());

-- Memberships
CREATE POLICY "Contractors can view own membership" ON memberships
  FOR SELECT TO authenticated USING (contractor_id = auth.uid());

CREATE POLICY "Admins can manage all memberships" ON memberships
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Bids
CREATE POLICY "Contractors can view own bids" ON bids
  FOR SELECT TO authenticated USING (contractor_id = auth.uid());

CREATE POLICY "Homeowners can view bids on their projects" ON bids
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND homeowner_id = auth.uid()));

CREATE POLICY "Contractors can manage own bids" ON bids
  FOR ALL TO authenticated USING (contractor_id = auth.uid());

CREATE POLICY "Admins can manage all bids" ON bids
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Reviews
CREATE POLICY "Public can view reviews" ON reviews
  FOR SELECT USING (is_public = true);

CREATE POLICY "Homeowners can create reviews" ON reviews
  FOR INSERT TO authenticated WITH CHECK (homeowner_id = auth.uid());

CREATE POLICY "Contractors can respond to reviews" ON reviews
  FOR UPDATE TO authenticated
  USING (contractor_id = auth.uid())
  WITH CHECK (contractor_id = auth.uid());

-- Messages
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Bid Invitations
CREATE POLICY "Contractors can view own invitations" ON bid_invitations
  FOR SELECT TO authenticated USING (contractor_id = auth.uid());

CREATE POLICY "Contractors can update own invitations" ON bid_invitations
  FOR UPDATE TO authenticated USING (contractor_id = auth.uid());

CREATE POLICY "Admins can manage invitations" ON bid_invitations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Contact Submissions
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view submissions" ON contact_submissions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Testimonials
CREATE POLICY "Public can view active testimonials" ON testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Functions

-- Update contractor stats after review
CREATE OR REPLACE FUNCTION update_contractor_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contractor_details
  SET 
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE contractor_id = NEW.contractor_id AND is_public = true),
    average_rating = (SELECT COALESCE(AVG(overall_rating), 0) FROM reviews WHERE contractor_id = NEW.contractor_id AND is_public = true)
  WHERE contractor_id = NEW.contractor_id;
  
  -- Also update verification level
  UPDATE contractor_verifications
  SET 
    average_rating = (SELECT COALESCE(AVG(overall_rating), 0) FROM reviews WHERE contractor_id = NEW.contractor_id AND is_public = true)
  WHERE contractor_id = NEW.contractor_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stats_on_review
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_contractor_stats();

-- Update project completed count
CREATE OR REPLACE FUNCTION update_completed_projects()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
    -- Update contractor stats
    UPDATE contractor_details cd
    SET total_projects_completed = total_projects_completed + 1
    FROM project_assignments pa
    WHERE pa.project_id = NEW.id AND cd.contractor_id = pa.contractor_id;
    
    -- Update verification stats
    UPDATE contractor_verifications cv
    SET total_projects_completed = total_projects_completed + 1
    FROM project_assignments pa
    WHERE pa.project_id = NEW.id AND cv.contractor_id = pa.contractor_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_completed_on_project_status
  AFTER UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_completed_projects();

-- Updated_at triggers
CREATE TRIGGER update_contractor_details_updated_at
  BEFORE UPDATE ON contractor_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bids_updated_at
  BEFORE UPDATE ON bids
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed testimonials
INSERT INTO testimonials (homeowner_name, homeowner_location, content, rating, project_type, contractor_name, is_featured, display_order) VALUES
('Sarah M.', 'Austin, TX', 'Contractor Verified made finding a reliable contractor so easy. The verification badges gave me confidence, and the bidding process was transparent. Our kitchen remodel turned out amazing!', 5, 'KITCHEN_REMODEL', 'Austin Premier Remodeling', true, 1),
('Michael R.', 'Round Rock, TX', 'After a bad experience with an unverified contractor, I discovered Contractor Verified. The difference is night and day. Professional, insured, and they delivered exactly what they promised.', 5, 'BATHROOM_REMODEL', 'Hill Country Builders', true, 2),
('Jennifer L.', 'Cedar Park, TX', 'The side-by-side bid comparison saved us thousands. We could clearly see what each contractor offered and make an informed decision. Highly recommend this platform!', 5, 'FULL_HOME_RENOVATION', 'Texas Elite Construction', true, 3),
('David K.', 'Lakeway, TX', 'As someone who knows nothing about construction, having pre-verified contractors with clear pricing was invaluable. No surprises, no hidden fees, just quality work.', 5, 'ROOFING', 'Lone Star Roofing', true, 4);
