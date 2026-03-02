import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'cv.db');

export async function GET() {
  try {
    const db = new Database(dbPath, { readonly: true });
    
    // Get all unique trades from service_categories (comma-separated)
    const rows = db.prepare(`
      SELECT DISTINCT service_categories 
      FROM contractors 
      WHERE service_categories IS NOT NULL AND service_categories != ''
    `).all() as { service_categories: string }[];
    
    // Parse and dedupe individual trades
    const tradesSet = new Set<string>();
    rows.forEach(row => {
      row.service_categories.split(',').forEach(trade => {
        const trimmed = trade.trim();
        if (trimmed) tradesSet.add(trimmed);
      });
    });
    
    // Sort alphabetically and return with counts
    const trades = Array.from(tradesSet).sort();
    
    // Get counts for each trade
    const tradeCounts = trades.map(trade => {
      const count = db.prepare(`
        SELECT COUNT(*) as count 
        FROM contractors 
        WHERE service_categories LIKE ? OR service_categories LIKE ? OR service_categories LIKE ? OR service_categories = ?
      `).get(`${trade},%`, `%,${trade},%`, `%,${trade}`, trade) as { count: number };
      
      return { trade, count: count.count };
    });
    
    db.close();
    
    return NextResponse.json({
      trades: tradeCounts.sort((a, b) => b.count - a.count),
      total: tradeCounts.length
    });
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 });
  }
}
