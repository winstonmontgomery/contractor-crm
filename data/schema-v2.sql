-- Document management tables
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contractor_id INTEGER NOT NULL,
    doc_type TEXT NOT NULL, -- 'insurance', 'license', 'certification', 'w9', 'bond'
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATE,
    verified_at DATETIME,
    verified_by TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'expired'
    rejection_reason TEXT,
    notes TEXT,
    FOREIGN KEY (contractor_id) REFERENCES contractors(id)
);

-- Verification audit log
CREATE TABLE IF NOT EXISTS verification_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contractor_id INTEGER NOT NULL,
    document_id INTEGER,
    action TEXT NOT NULL, -- 'uploaded', 'approved', 'rejected', 'expired', 'reminder_sent'
    performed_by TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contractor_id) REFERENCES contractors(id),
    FOREIGN KEY (document_id) REFERENCES documents(id)
);

-- Prospects table for scraped leads (potential contractors to market to)
CREATE TABLE IF NOT EXISTS prospects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company_name TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    source TEXT NOT NULL, -- 'angi', 'thumbtack', 'yelp', 'google', 'manual'
    source_url TEXT,
    source_id TEXT, -- ID from the source platform
    service_categories TEXT,
    location TEXT,
    rating REAL,
    review_count INTEGER,
    years_in_business INTEGER,
    license_number TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'interested', 'signed_up', 'declined', 'unresponsive'
    outreach_count INTEGER DEFAULT 0,
    last_contacted_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source, source_id)
);

-- Outreach campaigns
CREATE TABLE IF NOT EXISTS outreach (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prospect_id INTEGER NOT NULL,
    channel TEXT NOT NULL, -- 'email', 'sms', 'phone', 'facebook'
    template_name TEXT,
    message TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    opened_at DATETIME,
    clicked_at DATETIME,
    replied_at DATETIME,
    response TEXT,
    FOREIGN KEY (prospect_id) REFERENCES prospects(id)
);

CREATE INDEX IF NOT EXISTS idx_documents_contractor ON documents(contractor_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_expires ON documents(expires_at);
CREATE INDEX IF NOT EXISTS idx_prospects_source ON prospects(source);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
