-- ==========================================================
-- Lion Track Safari - Call to Action (CTA) & Lead Generation Schema
-- Compatible with PostgreSQL 13+ (cPanel, Cloud SQL, AWS RDS)
-- UUIDs are generated in Node.js via crypto.randomUUID()
-- Do not require pgcrypto or gen_random_uuid()
-- ==========================================================

-- ----------------------------------------------------------
-- CTA 1: Direct Safari & Route Enquiries (From SafariModal)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS safari_enquiries (
    id UUID PRIMARY KEY,
    reference_code VARCHAR(30) UNIQUE NOT NULL,
    package_title VARCHAR(255) NOT NULL,
    package_id VARCHAR(100),
    traveler_name VARCHAR(150) NOT NULL,
    traveler_email VARCHAR(150) NOT NULL,
    traveler_phone VARCHAR(50) NOT NULL,
    guest_count INT DEFAULT 2,
    travel_month VARCHAR(50),
    safari_style VARCHAR(100),
    special_notes TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    estimated_price NUMERIC(10, 2),
    lead_source VARCHAR(100) DEFAULT 'SafariModal_EnquiryTab',
    status VARCHAR(50) DEFAULT 'New Lead',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safari_enquiries_ref ON safari_enquiries(reference_code);
CREATE INDEX IF NOT EXISTS idx_safari_enquiries_email ON safari_enquiries(traveler_email);
CREATE INDEX IF NOT EXISTS idx_safari_enquiries_status ON safari_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_safari_enquiries_created ON safari_enquiries(created_at DESC);

-- ----------------------------------------------------------
-- CTA 2: Bespoke Tailor-Made Safari Quotes (From /contact Builder)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS custom_safari_requests (
    id UUID PRIMARY KEY,
    reference_code VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country_of_residence VARCHAR(100),
    travel_style VARCHAR(100),
    destinations JSONB NOT NULL,
    duration VARCHAR(50),
    travelers VARCHAR(50),
    travel_date_window VARCHAR(100),
    budget_preference VARCHAR(100),
    accommodation_type VARCHAR(100),
    special_requests TEXT,
    referral_source VARCHAR(100),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'Pending Review',
    assigned_director VARCHAR(100) DEFAULT 'Arusha Head Specialist',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_safari_ref ON custom_safari_requests(reference_code);
CREATE INDEX IF NOT EXISTS idx_custom_safari_email ON custom_safari_requests(email);
CREATE INDEX IF NOT EXISTS idx_custom_safari_status ON custom_safari_requests(status);
CREATE INDEX IF NOT EXISTS idx_custom_safari_created ON custom_safari_requests(created_at DESC);

-- ----------------------------------------------------------
-- CTA 3: B2B Travel Agent Partnership Applications
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS b2b_agent_applications (
    id UUID PRIMARY KEY,
    reference_code VARCHAR(30) UNIQUE NOT NULL,
    agency_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    annual_clients VARCHAR(100),
    message TEXT,
    wholesale_rate_sent BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Under Review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_agent_ref ON b2b_agent_applications(reference_code);
CREATE INDEX IF NOT EXISTS idx_b2b_agent_email ON b2b_agent_applications(email);
CREATE INDEX IF NOT EXISTS idx_b2b_agent_status ON b2b_agent_applications(status);
CREATE INDEX IF NOT EXISTS idx_b2b_agent_created ON b2b_agent_applications(created_at DESC);

-- ----------------------------------------------------------
-- CTA 4: Savannah Journal Newsletter Opt-Ins
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    source VARCHAR(100) DEFAULT 'Footer_Savannah_Journal',
    tags TEXT[] DEFAULT ARRAY['Bush Journal', 'Great Migration Updates'],
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);

-- ----------------------------------------------------------
-- CTA 5: Quick Contact & WhatsApp Call Clicks
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS quick_contact_leads (
    id UUID PRIMARY KEY,
    channel VARCHAR(50) NOT NULL,
    phone_number_dialed VARCHAR(50) DEFAULT '+255682801818',
    page_origin VARCHAR(255),
    user_location_hint VARCHAR(100),
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quick_contact_channel ON quick_contact_leads(channel);
CREATE INDEX IF NOT EXISTS idx_quick_contact_clicked ON quick_contact_leads(clicked_at DESC);

-- ----------------------------------------------------------
-- CTA 6: Blog Reader Helpful Upvotes & Social Shares
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_feedbacks (
    id SERIAL PRIMARY KEY,
    article_slug VARCHAR(150) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_feedbacks_slug ON blog_feedbacks(article_slug);
CREATE INDEX IF NOT EXISTS idx_blog_feedbacks_type ON blog_feedbacks(interaction_type);
CREATE INDEX IF NOT EXISTS idx_blog_feedbacks_created ON blog_feedbacks(created_at DESC);
