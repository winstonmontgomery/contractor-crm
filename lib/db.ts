/**
 * CONTRACTOR VERIFIED - SQLite Database Interface
 */

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'cv.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

// Lead queries
export function getLeads(status?: string, limit: number = 50) {
  const db = getDb();
  if (status) {
    return db.prepare(`
      SELECT * FROM leads 
      WHERE status = ? 
      ORDER BY lead_score DESC, created_at DESC 
      LIMIT ?
    `).all(status, limit);
  }
  return db.prepare(`
    SELECT * FROM leads 
    ORDER BY lead_score DESC, created_at DESC 
    LIMIT ?
  `).all(limit);
}

export function getLeadById(id: number) {
  const db = getDb();
  return db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
}

export function insertLead(lead: {
  name: string;
  location: string;
  service_needed: string;
  service_category: string;
  details?: string;
  hours_since_post: number;
  engagement_likes?: number;
  engagement_comments?: number;
  lead_score: number;
  lead_temperature: string;
  source?: string;
  facebook_url?: string;
}) {
  const db = getDb();
  return db.prepare(`
    INSERT INTO leads (name, location, service_needed, service_category, details, 
      hours_since_post, engagement_likes, engagement_comments, lead_score, 
      lead_temperature, source, facebook_url)
    VALUES (@name, @location, @service_needed, @service_category, @details,
      @hours_since_post, @engagement_likes, @engagement_comments, @lead_score,
      @lead_temperature, @source, @facebook_url)
  `).run(lead);
}

export function updateLeadStatus(id: number, status: string) {
  const db = getDb();
  return db.prepare(`
    UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(status, id);
}

// Contractor queries
export function getContractors(activeOnly: boolean = true, limit: number = 100) {
  const db = getDb();
  if (activeOnly) {
    return db.prepare(`
      SELECT * FROM contractors WHERE active = 1 ORDER BY verification_level DESC, avg_rating DESC LIMIT ?
    `).all(limit);
  }
  return db.prepare('SELECT * FROM contractors LIMIT ?').all(limit);
}

export function getContractorById(id: number) {
  const db = getDb();
  return db.prepare('SELECT * FROM contractors WHERE id = ?').get(id);
}

export function getContractorsByService(serviceCategory: string) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM contractors 
    WHERE service_categories LIKE ? AND active = 1
    ORDER BY verification_level DESC, avg_rating DESC
  `).all(`%${serviceCategory}%`);
}

// Match queries
export function createMatch(leadId: number, contractorId: number, matchScore: number, matchReason: string) {
  const db = getDb();
  return db.prepare(`
    INSERT INTO matches (lead_id, contractor_id, match_score, match_reason)
    VALUES (?, ?, ?, ?)
  `).run(leadId, contractorId, matchScore, matchReason);
}

export function getMatchesForLead(leadId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT m.*, c.name as contractor_name, c.phone as contractor_phone, 
           c.verification_level, c.avg_rating
    FROM matches m
    JOIN contractors c ON m.contractor_id = c.id
    WHERE m.lead_id = ?
    ORDER BY m.match_score DESC
  `).all(leadId);
}

export function updateMatchStatus(matchId: number, status: string, outcome?: string) {
  const db = getDb();
  if (outcome) {
    return db.prepare(`
      UPDATE matches SET status = ?, outcome = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(status, outcome, matchId);
  }
  return db.prepare(`
    UPDATE matches SET status = ? WHERE id = ?
  `).run(status, matchId);
}

// Analytics
export function getDashboardStats() {
  const db = getDb();
  
  const leads = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
      SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
      SUM(CASE WHEN status = 'matched' THEN 1 ELSE 0 END) as matched,
      SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted,
      SUM(CASE WHEN lead_temperature = 'hot' THEN 1 ELSE 0 END) as hot_leads
    FROM leads
  `).get();
  
  const contractors = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN verification_level != 'basic' THEN 1 ELSE 0 END) as verified
    FROM contractors WHERE active = 1
  `).get();
  
  const matches = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN outcome = 'won' THEN 1 ELSE 0 END) as won
    FROM matches
  `).get();
  
  return { leads, contractors, matches };
}

// Service categories
export function getServiceCategories() {
  const db = getDb();
  return db.prepare('SELECT * FROM service_categories ORDER BY name').all();
}

// Activity logging
export function logActivity(entityType: string, entityId: number, action: string, details?: string) {
  const db = getDb();
  return db.prepare(`
    INSERT INTO activity_log (entity_type, entity_id, action, details)
    VALUES (?, ?, ?, ?)
  `).run(entityType, entityId, action, details);
}

export function getRecentActivity(limit: number = 20) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?
  `).all(limit);
}
