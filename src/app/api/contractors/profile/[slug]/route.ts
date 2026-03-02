import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'cv.db');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = new Database(dbPath, { readonly: true });
    
    // Try to find by ID first
    let contractor = null;
    if (!isNaN(parseInt(slug))) {
      contractor = db.prepare('SELECT * FROM contractors WHERE id = ?').get(parseInt(slug));
    }
    
    // If not found, try by slugified name or company name
    if (!contractor) {
      const allContractors = db.prepare('SELECT * FROM contractors WHERE active = 1').all();
      contractor = allContractors.find((c: any) => {
        const nameSlug = (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const companySlug = (c.company_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return nameSlug === slug.toLowerCase() || companySlug === slug.toLowerCase();
      });
    }
    
    db.close();
    
    if (!contractor) {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
    }
    
    return NextResponse.json(contractor);
  } catch (error) {
    console.error('Error fetching contractor:', error);
    return NextResponse.json({ error: 'Failed to fetch contractor' }, { status: 500 });
  }
}
