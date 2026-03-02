import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'cv.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

// Lead types
export interface Lead {
  id: number;
  name: string;
  details: string | null;
  service_needed: string | null;
  location: string | null;
  source: string | null;
  source_url: string | null;
  lead_temperature: string;
  urgency: string;
  status: string;
  assigned_contractor_id: number | null;
  posted_at: string | null;
  created_at: string;
}

// Contractor types
export interface Contractor {
  id: number;
  name: string;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  services: string | null;
  location: string | null;
  verification_level: string;
  rating: number;
  notes: string | null;
  created_at: string;
}

// Lead operations
export function getAllLeads(): Lead[] {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM leads 
    ORDER BY 
      CASE lead_temperature 
        WHEN 'hot' THEN 1 
        WHEN 'warm' THEN 2 
        ELSE 3 
      END,
      created_at DESC
  `).all() as Lead[];
}

export function getLeadById(id: number): Lead | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as Lead | undefined;
}

export function createLead(lead: Omit<Lead, 'id' | 'created_at'>): Lead {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO leads (name, details, service_needed, location, source, source_url, lead_temperature, urgency, status, posted_at)
    VALUES (@name, @details, @service_needed, @location, @source, @source_url, @lead_temperature, @urgency, @status, @posted_at)
  `);
  const result = stmt.run(lead);
  return getLeadById(result.lastInsertRowid as number)!;
}

export function updateLead(id: number, updates: Partial<Lead>): Lead | undefined {
  const db = getDb();
  const fields = Object.keys(updates)
    .filter(k => k !== 'id' && k !== 'created_at')
    .map(k => `${k} = @${k}`)
    .join(', ');
  
  if (!fields) return getLeadById(id);
  
  const stmt = db.prepare(`UPDATE leads SET ${fields} WHERE id = @id`);
  stmt.run({ ...updates, id });
  return getLeadById(id);
}

export function deleteLead(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM leads WHERE id = ?').run(id);
  return result.changes > 0;
}

export function matchLeadToContractor(leadId: number, contractorId: number): Lead | undefined {
  const db = getDb();
  db.prepare(`
    UPDATE leads 
    SET assigned_contractor_id = ?, status = 'matched' 
    WHERE id = ?
  `).run(contractorId, leadId);
  return getLeadById(leadId);
}

// Contractor operations
export function getAllContractors(): Contractor[] {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM contractors 
    ORDER BY 
      CASE verification_level 
        WHEN 'elite' THEN 1 
        WHEN 'pro' THEN 2 
        WHEN 'verified' THEN 3 
        ELSE 4 
      END,
      name ASC
  `).all() as Contractor[];
}

export function getContractorById(id: number): Contractor | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM contractors WHERE id = ?').get(id) as Contractor | undefined;
}

export function createContractor(contractor: Omit<Contractor, 'id' | 'created_at'>): Contractor {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO contractors (name, company_name, phone, email, services, location, verification_level, rating, notes)
    VALUES (@name, @company_name, @phone, @email, @services, @location, @verification_level, @rating, @notes)
  `);
  const result = stmt.run(contractor);
  return getContractorById(result.lastInsertRowid as number)!;
}

export function updateContractor(id: number, updates: Partial<Contractor>): Contractor | undefined {
  const db = getDb();
  const fields = Object.keys(updates)
    .filter(k => k !== 'id' && k !== 'created_at')
    .map(k => `${k} = @${k}`)
    .join(', ');
  
  if (!fields) return getContractorById(id);
  
  const stmt = db.prepare(`UPDATE contractors SET ${fields} WHERE id = @id`);
  stmt.run({ ...updates, id });
  return getContractorById(id);
}

export function deleteContractor(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM contractors WHERE id = ?').run(id);
  return result.changes > 0;
}

// Get contractors that match a lead's service
export function getMatchingContractors(leadId: number): Contractor[] {
  const db = getDb();
  const lead = getLeadById(leadId);
  if (!lead || !lead.service_needed) return getAllContractors();
  
  // Simple matching: check if contractor services contain the lead's service need
  const keyword = lead.service_needed.toLowerCase().split(' ')[0];
  return db.prepare(`
    SELECT * FROM contractors 
    WHERE LOWER(services) LIKE ? 
    ORDER BY verification_level DESC, rating DESC
  `).all(`%${keyword}%`) as Contractor[];
}

// Stats
export function getStats() {
  const db = getDb();
  const leadStats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN lead_temperature = 'hot' THEN 1 ELSE 0 END) as hot,
      SUM(CASE WHEN lead_temperature = 'warm' THEN 1 ELSE 0 END) as warm,
      SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
      SUM(CASE WHEN status = 'matched' THEN 1 ELSE 0 END) as matched,
      SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted
    FROM leads
  `).get() as any;
  
  const contractorStats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN verification_level != 'basic' THEN 1 ELSE 0 END) as verified,
      SUM(CASE WHEN phone IS NOT NULL AND phone != '' THEN 1 ELSE 0 END) as withPhone
    FROM contractors
  `).get() as any;
  
  return { leads: leadStats, contractors: contractorStats };
}
