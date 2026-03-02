import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

const dbPath = path.join(process.cwd(), 'data', 'cv.db');
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');

// GET - List documents (optionally filter by contractor_id or status)
export async function GET(request: NextRequest) {
  try {
    const db = new Database(dbPath, { readonly: true });
    const { searchParams } = new URL(request.url);
    
    const contractorId = searchParams.get('contractor_id');
    const status = searchParams.get('status');
    const docType = searchParams.get('type');
    const expiringSoon = searchParams.get('expiring_soon'); // days
    
    let query = `
      SELECT d.*, c.name as contractor_name, c.phone as contractor_phone
      FROM documents d
      JOIN contractors c ON d.contractor_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (contractorId) {
      query += ' AND d.contractor_id = ?';
      params.push(contractorId);
    }
    
    if (status) {
      query += ' AND d.status = ?';
      params.push(status);
    }
    
    if (docType) {
      query += ' AND d.doc_type = ?';
      params.push(docType);
    }
    
    if (expiringSoon) {
      query += ` AND d.expires_at IS NOT NULL 
                 AND d.expires_at <= date('now', '+' || ? || ' days')
                 AND d.status = 'approved'`;
      params.push(expiringSoon);
    }
    
    query += ' ORDER BY d.uploaded_at DESC';
    
    const documents = db.prepare(query).all(...params);
    db.close();
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST - Upload a document
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const contractorId = formData.get('contractor_id') as string;
    const docType = formData.get('doc_type') as string;
    const expiresAt = formData.get('expires_at') as string;
    const notes = formData.get('notes') as string;
    
    if (!file || !contractorId || !docType) {
      return NextResponse.json(
        { error: 'Missing required fields: file, contractor_id, doc_type' },
        { status: 400 }
      );
    }
    
    // Create upload directory
    await mkdir(uploadDir, { recursive: true });
    
    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const fileName = `${contractorId}_${docType}_${timestamp}.${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const publicPath = `/uploads/documents/${fileName}`;
    
    // Save file
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));
    
    // Save to database
    const db = new Database(dbPath);
    
    const stmt = db.prepare(`
      INSERT INTO documents (
        contractor_id, doc_type, file_name, file_path, file_size, mime_type, expires_at, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      contractorId,
      docType,
      file.name,
      publicPath,
      file.size,
      file.type,
      expiresAt || null,
      notes || null
    );
    
    // Log the upload
    db.prepare(`
      INSERT INTO verification_log (contractor_id, document_id, action, notes)
      VALUES (?, ?, 'uploaded', ?)
    `).run(contractorId, result.lastInsertRowid, `Uploaded ${docType}: ${file.name}`);
    
    const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(result.lastInsertRowid);
    db.close();
    
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}

// PATCH - Update document status (approve/reject)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, rejection_reason, verified_by } = body;
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }
    
    const db = new Database(dbPath);
    
    const updates: string[] = ['status = ?'];
    const params: any[] = [status];
    
    if (status === 'approved') {
      updates.push('verified_at = CURRENT_TIMESTAMP');
      updates.push('verified_by = ?');
      params.push(verified_by || 'admin');
    }
    
    if (status === 'rejected' && rejection_reason) {
      updates.push('rejection_reason = ?');
      params.push(rejection_reason);
    }
    
    params.push(id);
    
    db.prepare(`UPDATE documents SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    
    // Get contractor_id for logging
    const doc = db.prepare('SELECT contractor_id FROM documents WHERE id = ?').get(id) as any;
    
    // Log the action
    db.prepare(`
      INSERT INTO verification_log (contractor_id, document_id, action, performed_by, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      doc.contractor_id,
      id,
      status,
      verified_by || 'admin',
      rejection_reason || null
    );
    
    // If insurance approved, update contractor
    if (status === 'approved') {
      const docInfo = db.prepare('SELECT doc_type, expires_at FROM documents WHERE id = ?').get(id) as any;
      if (docInfo.doc_type === 'insurance') {
        db.prepare(`
          UPDATE contractors 
          SET insurance_verified = 1, insurance_expires = ?, last_verified_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(docInfo.expires_at, doc.contractor_id);
      } else if (docInfo.doc_type === 'license') {
        db.prepare(`
          UPDATE contractors 
          SET license_expires = ?, last_verified_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(docInfo.expires_at, doc.contractor_id);
      }
    }
    
    const updated = db.prepare('SELECT * FROM documents WHERE id = ?').get(id);
    db.close();
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}
