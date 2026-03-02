-- Batch import from Facebook mining session 2026-02-27
-- Run with: sqlite3 cv.db < batch_import.sql

-- New Leads (7 days worth)
INSERT OR IGNORE INTO leads (name, details, service_needed, location, lead_temperature, urgency, posted_at) VALUES
('Madeline Parker', 'Looking for someone to Limewash a powder bathroom.', 'Painting', 'Austin, TX', 'warm', 'normal', datetime('now', '-2 days')),
('Travis Smith', 'NE Austin listing - driveway replacement, new floors, front yard landscaping. Verified members only.', 'Multiple', 'NE Austin, TX', 'hot', 'normal', datetime('now', '-2 days')),
('Jeffery Keith Davis', 'Bar sink install in butcher block + cedar stands for 36x15 planter boxes. Had 2 no-shows.', 'Plumbing/Carpentry', 'Austin, TX', 'hot', 'urgent', datetime('now', '-1 day')),
('Anonymous Boring', 'Need boring company - 30ft underneath residential driveway.', 'Boring/Drilling', 'Austin, TX', 'warm', 'normal', datetime('now', '-2 days')),
('Sudipta Sen', 'Drywall settlement crack on high ceiling. Paint/brush available, need filler and ladder.', 'Drywall', 'Austin, TX', 'warm', 'normal', datetime('now', '-2 days'));

-- New Contractors
INSERT OR IGNORE INTO contractors (name, company_name, phone, services, location, verification_level) VALUES
-- From direct posts/comments
('Mystik Cleaning', 'Mystik Cleaning Service LLC', '512-988-9683', 'Cleaning, Move-in/out, Listing Prep', 'Austin, TX', 'verified'),
('Bryson Jones', NULL, NULL, 'Pool Building, Resort Pools', 'Lago Vista, TX', 'basic'),
('Loma Verde ATX', 'Loma Verde ATX', '512-952-9906', 'Landscaping, Turf, Pavers, Outdoor Kitchens', 'Austin, TX', 'verified'),
('MaddisonHomes', 'MaddisonHomes', NULL, 'Luxury Home Building', 'Austin, TX', 'verified'),
('Louis Ybarra', NULL, NULL, 'Plumbing', 'Austin, TX', 'basic'),
('Edson Nava', NULL, NULL, 'Painting, Limewash', 'Austin, TX', 'basic'),
('Harry Hemp', NULL, NULL, 'Hempcrete, Roman Hemp Shields', 'Austin, TX', 'basic'),
('Irvin Orosco', NULL, NULL, 'HVAC Inspection', 'Austin, TX', 'verified'),
('Omar Fernandez', NULL, NULL, 'Turf, Landscaping', 'Austin, TX', 'verified'),
('Klayton Gage', NULL, NULL, 'Concrete, Flooring', 'Austin, TX', 'basic'),
('Tamberyne McCutcheon', 'Conventus', NULL, 'Hard Money Lending, Bridge Loans, DSCR', 'Austin, TX', 'verified'),
('Martin Villagran', NULL, NULL, 'Handyman, General Contractor', 'Austin, TX', 'basic');

-- Output final counts
SELECT 'Total Leads: ' || COUNT(*) FROM leads;
SELECT 'Total Contractors: ' || COUNT(*) FROM contractors;
