-- Verification system enums
CREATE TYPE verification_level AS ENUM ('VERIFIED', 'VERIFIED_PRO', 'VERIFIED_ELITE');
CREATE TYPE application_status AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'MORE_INFO_NEEDED');
CREATE TYPE document_type AS ENUM ('LICENSE', 'INSURANCE', 'REFERENCE', 'CERTIFICATION', 'OTHER');

-- Contractor applications table
CREATE TABLE contractor_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status application_status DEFAULT 'PENDING' NOT NULL,
  license_number TEXT,
  license_state TEXT DEFAULT 'TX',
  license_expiry DATE,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  insurance_expiry DATE,
  coverage_amount DECIMAL(12, 2),
  years_in_business INTEGER,
  specialty TEXT[],
  references_provided INTEGER DEFAULT 0,
  reviewer_notes TEXT,
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Contractor verifications table
CREATE TABLE contractor_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  verification_level verification_level DEFAULT 'VERIFIED' NOT NULL,
  verified_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  license_verified BOOLEAN DEFAULT false,
  insurance_verified BOOLEAN DEFAULT false,
  references_verified BOOLEAN DEFAULT false,
  background_check BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  total_projects_completed INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Contractor documents table
CREATE TABLE contractor_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES contractor_applications(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Verification history for audit trail
CREATE TABLE verification_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  previous_level verification_level,
  new_level verification_level,
  performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX idx_applications_contractor ON contractor_applications(contractor_id);
CREATE INDEX idx_applications_status ON contractor_applications(status);
CREATE INDEX idx_applications_submitted ON contractor_applications(submitted_at DESC);
CREATE INDEX idx_verifications_contractor ON contractor_verifications(contractor_id);
CREATE INDEX idx_verifications_level ON contractor_verifications(verification_level);
CREATE INDEX idx_verifications_expires ON contractor_verifications(expires_at);
CREATE INDEX idx_documents_contractor ON contractor_documents(contractor_id);
CREATE INDEX idx_documents_application ON contractor_documents(application_id);

-- Enable RLS
ALTER TABLE contractor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contractor_applications
CREATE POLICY "Contractors can view own applications" ON contractor_applications
  FOR SELECT TO authenticated USING (contractor_id = auth.uid());

CREATE POLICY "Contractors can insert own applications" ON contractor_applications
  FOR INSERT TO authenticated WITH CHECK (contractor_id = auth.uid());

CREATE POLICY "Contractors can update pending applications" ON contractor_applications
  FOR UPDATE TO authenticated 
  USING (contractor_id = auth.uid() AND status IN ('PENDING', 'MORE_INFO_NEEDED'));

CREATE POLICY "Admins can manage all applications" ON contractor_applications
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- RLS Policies for contractor_verifications (public read for badges)
CREATE POLICY "Anyone can view verifications" ON contractor_verifications
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage verifications" ON contractor_verifications
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- RLS Policies for contractor_documents
CREATE POLICY "Contractors can view own documents" ON contractor_documents
  FOR SELECT TO authenticated USING (contractor_id = auth.uid());

CREATE POLICY "Contractors can upload own documents" ON contractor_documents
  FOR INSERT TO authenticated WITH CHECK (contractor_id = auth.uid());

CREATE POLICY "Contractors can delete own unverified documents" ON contractor_documents
  FOR DELETE TO authenticated USING (contractor_id = auth.uid() AND verified = false);

CREATE POLICY "Admins can manage all documents" ON contractor_documents
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- RLS for verification history
CREATE POLICY "Contractors can view own history" ON verification_history
  FOR SELECT TO authenticated USING (contractor_id = auth.uid());

CREATE POLICY "Admins can manage history" ON verification_history
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Function to auto-upgrade verification level based on metrics
CREATE OR REPLACE FUNCTION check_verification_upgrade()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for Verified Elite (25+ projects, 4.8+ rating)
  IF NEW.total_projects_completed >= 25 AND NEW.average_rating >= 4.8 THEN
    NEW.verification_level = 'VERIFIED_ELITE';
  -- Check for Verified Pro (10+ projects, 4.5+ rating)
  ELSIF NEW.total_projects_completed >= 10 AND NEW.average_rating >= 4.5 THEN
    NEW.verification_level = 'VERIFIED_PRO';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_upgrade_verification
  BEFORE UPDATE ON contractor_verifications
  FOR EACH ROW EXECUTE FUNCTION check_verification_upgrade();

-- Function to send re-verification reminder (placeholder - integrate with edge function)
CREATE OR REPLACE FUNCTION check_expiring_verifications()
RETURNS TABLE (
  contractor_id UUID,
  email TEXT,
  full_name TEXT,
  expires_at TIMESTAMPTZ,
  days_until_expiry INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cv.contractor_id,
    p.email,
    p.full_name,
    cv.expires_at,
    EXTRACT(DAY FROM cv.expires_at - NOW())::INTEGER as days_until_expiry
  FROM contractor_verifications cv
  JOIN profiles p ON p.id = cv.contractor_id
  WHERE cv.expires_at <= NOW() + INTERVAL '30 days'
  AND cv.expires_at > NOW();
END;
$$ LANGUAGE plpgsql;

-- Updated_at triggers
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON contractor_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_verifications_updated_at
  BEFORE UPDATE ON contractor_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON contractor_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
