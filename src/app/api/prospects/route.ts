import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'cv.db');

// GET - List prospects with filters
export async function GET(request: NextRequest) {
  try {
    const db = new Database(dbPath, { readonly: true });
    const { searchParams } = new URL(request.url);
    
    const source = searchParams.get('source');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    let query = 'SELECT * FROM prospects WHERE 1=1';
    const params: any[] = [];
    
    if (source) {
      query += ' AND source = ?';
      params.push(source);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (search) {
      query += ' AND (name LIKE ? OR company_name LIKE ? OR phone LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    
    if (category) {
      query += ' AND service_categories LIKE ?';
      params.push(`%${category}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const prospects = db.prepare(query).all(...params);
    
    // Get stats
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
        SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
        SUM(CASE WHEN status = 'interested' THEN 1 ELSE 0 END) as interested,
        SUM(CASE WHEN status = 'signed_up' THEN 1 ELSE 0 END) as signed_up,
        SUM(CASE WHEN source = 'angi' THEN 1 ELSE 0 END) as from_angi,
        SUM(CASE WHEN source = 'thumbtack' THEN 1 ELSE 0 END) as from_thumbtack
      FROM prospects
    `).get();
    
    db.close();
    
    return NextResponse.json({ prospects, stats });
  } catch (error) {
    console.error('Error fetching prospects:', error);
    return NextResponse.json({ error: 'Failed to fetch prospects' }, { status: 500 });
  }
}

// POST - Add prospect(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = new Database(dbPath);
    
    // Handle bulk import
    const prospects = Array.isArray(body) ? body : [body];
    const results = [];
    
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO prospects (
        name, company_name, phone, email, website, source, source_url, source_id,
        service_categories, location, rating, review_count, years_in_business, license_number, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const p of prospects) {
      try {
        const result = stmt.run(
          p.name,
          p.company_name || null,
          p.phone || null,
          p.email || null,
          p.website || null,
          p.source || 'manual',
          p.source_url || null,
          p.source_id || null,
          p.service_categories || null,
          p.location || 'Austin, TX',
          p.rating || null,
          p.review_count || null,
          p.years_in_business || null,
          p.license_number || null,
          p.notes || null
        );
        if (result.changes > 0) {
          results.push({ name: p.name, status: 'added' });
        } else {
          results.push({ name: p.name, status: 'duplicate' });
        }
      } catch (err) {
        results.push({ name: p.name, status: 'error', error: String(err) });
      }
    }
    
    db.close();
    
    return NextResponse.json({
      added: results.filter(r => r.status === 'added').length,
      duplicates: results.filter(r => r.status === 'duplicate').length,
      errors: results.filter(r => r.status === 'error').length,
      results
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding prospects:', error);
    return NextResponse.json({ error: 'Failed to add prospects' }, { status: 500 });
  }
}

// PATCH - Update prospect status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing prospect id' }, { status: 400 });
    }
    
    const db = new Database(dbPath);
    
    const updates: string[] = ['updated_at = CURRENT_TIMESTAMP'];
    const params: any[] = [];
    
    if (status) {
      updates.push('status = ?');
      params.push(status);
      
      if (['contacted', 'interested', 'signed_up'].includes(status)) {
        updates.push('last_contacted_at = CURRENT_TIMESTAMP');
        updates.push('outreach_count = outreach_count + 1');
      }
    }
    
    if (notes) {
      updates.push('notes = ?');
      params.push(notes);
    }
    
    params.push(id);
    
    db.prepare(`UPDATE prospects SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    
    const updated = db.prepare('SELECT * FROM prospects WHERE id = ?').get(id);
    db.close();
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating prospect:', error);
    return NextResponse.json({ error: 'Failed to update prospect' }, { status: 500 });
  }
}

// DELETE - Remove prospect
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing prospect id' }, { status: 400 });
    }
    
    const db = new Database(dbPath);
    db.prepare('DELETE FROM prospects WHERE id = ?').run(id);
    db.close();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prospect:', error);
    return NextResponse.json({ error: 'Failed to delete prospect' }, { status: 500 });
  }
}
