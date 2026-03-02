-- Contractor Verified CRM - Supabase Migration
-- Security-first schema with Row Level Security (RLS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    facebook_id TEXT,
    facebook_url TEXT,
    phone TEXT,
    email TEXT,
    location TEXT,
    service_needed TEXT,
    service_category TEXT,
    details TEXT,
    budget_min NUMERIC,
    budget_max NUMERIC,
    urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('urgent', 'normal', 'flexible')),
    posted_at TIMESTAMPTZ,
    hours_since_post INTEGER,
    engagement_likes INTEGER DEFAULT 0,
    engagement_comments INTEGER DEFAULT 0,
    lead_score INTEGER DEFAULT 0,
    lead_temperature TEXT DEFAULT 'warm' CHECK (lead_temperature IN ('hot', 'warm', 'cold')),
    source TEXT DEFAULT 'facebook_group',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'matched', 'converted', 'lost')),
    assigned_to TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contractors table
CREATE TABLE IF NOT EXISTS contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    facebook_id TEXT,
    facebook_url TEXT,
    phone TEXT,
    email TEXT,
    company_name TEXT,
    services TEXT,
    service_categories TEXT,
    location TEXT,
    service_radius_miles INTEGER DEFAULT 50,
    license_number TEXT,
    insurance_verified BOOLEAN DEFAULT FALSE,
    insurance_expires DATE,
    license_expires DATE,
    last_verified_at TIMESTAMPTZ,
    verification_level TEXT DEFAULT 'basic' CHECK (verification_level IN ('basic', 'verified', 'pro', 'elite')),
    verification_notes TEXT,
    membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'basic', 'pro', 'elite')),
    avg_rating NUMERIC DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    recommendation_count INTEGER DEFAULT 0,
    response_time_hours NUMERIC,
    win_rate NUMERIC DEFAULT 0,
    total_leads_received INTEGER DEFAULT 0,
    total_jobs_won INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    ayrshare_profile_key TEXT,
    social_connected BOOLEAN DEFAULT FALSE,
    social_platforms TEXT,
    bio TEXT,
    website TEXT,
    years_in_business INTEGER,
    slug TEXT UNIQUE,
    logo_url TEXT,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prospects table (leads for recruiting contractors)
CREATE TABLE IF NOT EXISTS prospects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company_name TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    source TEXT NOT NULL CHECK (source IN ('angi', 'thumbtack', 'yelp', 'google', 'facebook', 'manual')),
    source_url TEXT,
    source_id TEXT,
    service_categories TEXT,
    location TEXT,
    rating NUMERIC,
    review_count INTEGER,
    years_in_business INTEGER,
    license_number TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'signed_up', 'declined', 'unresponsive')),
    outreach_count INTEGER DEFAULT 0,
    last_contacted_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source, source_id)
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL CHECK (doc_type IN ('insurance', 'license', 'certification', 'w9', 'bond')),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at DATE,
    verified_at TIMESTAMPTZ,
    verified_by TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    rejection_reason TEXT,
    notes TEXT
);

-- Verification log (audit trail)
CREATE TABLE IF NOT EXISTS verification_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    performed_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    match_score INTEGER DEFAULT 0,
    match_reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'viewed', 'responded', 'won', 'lost')),
    sent_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,
    response_time_hours NUMERIC,
    contractor_bid NUMERIC,
    outcome TEXT CHECK (outcome IN ('won', 'lost', 'no_response', 'declined')),
    outcome_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Outreach tracking
CREATE TABLE IF NOT EXISTS outreach (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'phone', 'facebook')),
    template_name TEXT,
    message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    response TEXT
);

-- ============================================
-- INDEXES (Performance)
-- ============================================

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_temperature ON leads(lead_temperature);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

CREATE INDEX idx_contractors_phone ON contractors(phone);
CREATE INDEX idx_contractors_slug ON contractors(slug);
CREATE INDEX idx_contractors_verification ON contractors(verification_level);
CREATE INDEX idx_contractors_active ON contractors(active);

CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_source ON prospects(source);

CREATE INDEX idx_documents_contractor ON documents(contractor_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_expires ON documents(expires_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;

-- Admin policy: Full access for authenticated admin users
-- (You'll need to set up auth.users and check for admin role)

-- For now, create service role policies (backend access only)
-- These allow the app's service role to access everything

CREATE POLICY "Service role full access" ON leads
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON contractors
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON prospects
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON documents
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON verification_log
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON matches
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON outreach
    FOR ALL USING (auth.role() = 'service_role');

-- Public read access for contractor profiles (mini-sites)
CREATE POLICY "Public can view active contractors" ON contractors
    FOR SELECT USING (active = TRUE AND verification_level != 'basic');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contractors_updated_at
    BEFORE UPDATE ON contractors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_prospects_updated_at
    BEFORE UPDATE ON prospects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate slug from company name
CREATE OR REPLACE FUNCTION generate_contractor_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL THEN
        NEW.slug = LOWER(REGEXP_REPLACE(COALESCE(NEW.company_name, NEW.name), '[^a-zA-Z0-9]+', '-', 'g'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_slug_on_insert
    BEFORE INSERT ON contractors
    FOR EACH ROW EXECUTE FUNCTION generate_contractor_slug();
