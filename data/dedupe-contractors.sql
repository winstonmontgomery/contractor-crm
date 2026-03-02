-- Deduplication migration: merge duplicate contractors and combine service_categories
-- Backup first, then replace

-- Step 1: Create deduplicated table
DROP TABLE IF EXISTS contractors_clean;

CREATE TABLE contractors_clean (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    insurance_verified INTEGER DEFAULT 0,
    verification_level TEXT DEFAULT 'basic',
    membership_tier TEXT DEFAULT 'free',
    avg_rating REAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    recommendation_count INTEGER DEFAULT 0,
    response_time_hours REAL,
    win_rate REAL DEFAULT 0,
    total_leads_received INTEGER DEFAULT 0,
    total_jobs_won INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ayrshare_profile_key TEXT,
    social_connected INTEGER DEFAULT 0,
    social_platforms TEXT,
    bio TEXT,
    website TEXT,
    years_in_business INTEGER,
    slug TEXT,
    logo_url TEXT,
    source TEXT
);

-- Step 2: Insert deduplicated data with merged service_categories
INSERT INTO contractors_clean (
    name, facebook_id, facebook_url, phone, email, company_name, services,
    service_categories, location, service_radius_miles, license_number,
    insurance_verified, verification_level, membership_tier, avg_rating,
    total_reviews, recommendation_count, response_time_hours, win_rate,
    total_leads_received, total_jobs_won, active, notes, created_at, updated_at,
    ayrshare_profile_key, social_connected, social_platforms, bio, website,
    years_in_business, slug, logo_url, source
)
SELECT 
    name,
    MIN(facebook_id),
    MIN(facebook_url),
    phone,
    MIN(email),
    MIN(company_name),
    MIN(services),
    GROUP_CONCAT(DISTINCT service_categories) as service_categories,
    COALESCE(MIN(NULLIF(location, '')), 'Austin, TX') as location,
    MAX(service_radius_miles),
    MIN(license_number),
    MAX(insurance_verified),
    CASE 
        WHEN MAX(CASE WHEN verification_level = 'elite' THEN 3 WHEN verification_level = 'pro' THEN 2 WHEN verification_level = 'verified' THEN 1 ELSE 0 END) >= 1 THEN 'verified'
        ELSE 'basic'
    END as verification_level,
    MIN(membership_tier),
    MAX(avg_rating),
    SUM(total_reviews),
    SUM(recommendation_count),
    MIN(response_time_hours),
    MAX(win_rate),
    SUM(total_leads_received),
    SUM(total_jobs_won),
    MAX(active),
    MIN(notes),
    MIN(created_at),
    MAX(updated_at),
    MIN(ayrshare_profile_key),
    MAX(social_connected),
    MIN(social_platforms),
    MIN(bio),
    COALESCE(MIN(NULLIF(website, '')), NULL) as website,
    MAX(years_in_business),
    MIN(slug),
    COALESCE(MIN(NULLIF(logo_url, '')), NULL) as logo_url,
    MIN(source)
FROM contractors
GROUP BY COALESCE(phone, name || '_no_phone'), name;

-- Step 3: Swap tables
DROP TABLE contractors;
ALTER TABLE contractors_clean RENAME TO contractors;

-- Step 4: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contractors_phone ON contractors(phone);
CREATE INDEX IF NOT EXISTS idx_contractors_name ON contractors(name);
CREATE INDEX IF NOT EXISTS idx_contractors_service_categories ON contractors(service_categories);
