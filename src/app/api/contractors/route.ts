import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'cv.db');

export async function GET(request: NextRequest) {
  try {
    const db = new Database(dbPath, { readonly: true });
    const { searchParams } = new URL(request.url);
    
    // Query params
    const trades = searchParams.get('trades'); // comma-separated trades
    const search = searchParams.get('search');
    const verified = searchParams.get('verified');
    const hasPhone = searchParams.get('hasPhone');
    const sort = searchParams.get('sort') || 'name'; // name, trades, verified, recent
    const order = searchParams.get('order') || 'asc';
    
    let query = 'SELECT * FROM contractors WHERE 1=1';
    const params: any[] = [];
    
    // Filter by trades (match any of the selected trades)
    if (trades) {
      const tradeList = trades.split(',').map(t => t.trim());
      const tradeConditions = tradeList.map(() => 
        "(service_categories LIKE ? OR service_categories LIKE ? OR service_categories LIKE ? OR service_categories = ?)"
      ).join(' OR ');
      query += ` AND (${tradeConditions})`;
      tradeList.forEach(trade => {
        params.push(`${trade},%`, `%,${trade},%`, `%,${trade}`, trade);
      });
    }
    
    // Search by name, company, phone
    if (search) {
      query += ` AND (name LIKE ? OR company_name LIKE ? OR phone LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Filter verified only
    if (verified === 'true') {
      query += ` AND verification_level IN ('verified', 'pro', 'elite')`;
    }
    
    // Filter has phone
    if (hasPhone === 'true') {
      query += ` AND phone IS NOT NULL AND phone != ''`;
    }
    
    // Sorting
    const sortColumn = {
      'name': 'name',
      'trades': 'service_categories',
      'verified': 'verification_level',
      'recent': 'created_at',
      'phone': 'phone'
    }[sort] || 'name';
    
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;
    
    const contractors = db.prepare(query).all(...params);
    db.close();
    
    return NextResponse.json(contractors);
  } catch (error) {
    console.error('Error fetching contractors:', error);
    return NextResponse.json({ error: 'Failed to fetch contractors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = new Database(dbPath);
    const body = await request.json();
    
    const stmt = db.prepare(`
      INSERT INTO contractors (
        name, company_name, phone, email, services, service_categories,
        location, verification_level, notes, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      body.name,
      body.company_name || null,
      body.phone || null,
      body.email || null,
      body.services || null,
      body.service_categories || null,
      body.location || 'Austin, TX',
      body.verification_level || 'basic',
      body.notes || null,
      body.source || 'manual'
    );
    
    const contractor = db.prepare('SELECT * FROM contractors WHERE id = ?').get(result.lastInsertRowid);
    db.close();
    
    return NextResponse.json(contractor, { status: 201 });
  } catch (error) {
    console.error('Error creating contractor:', error);
    return NextResponse.json({ error: 'Failed to create contractor' }, { status: 500 });
  }
}
