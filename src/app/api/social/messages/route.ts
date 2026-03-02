import { NextRequest, NextResponse } from 'next/server';
import { getMessages, getConversations, mineLeadsFromDMs } from '../../../../../lib/ayrshare';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'cv.db');

// Get messages/DMs for a contractor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractorId');
    const minLeads = searchParams.get('mineLeads') === 'true';
    
    if (!contractorId) {
      return NextResponse.json({ error: 'contractorId required' }, { status: 400 });
    }
    
    // Get contractor's Ayrshare profile key
    const db = new Database(dbPath, { readonly: true });
    const contractor = db.prepare('SELECT ayrshare_profile_key FROM contractors WHERE id = ?').get(contractorId) as any;
    db.close();
    
    if (!contractor?.ayrshare_profile_key) {
      return NextResponse.json({ 
        error: 'Contractor has not connected social accounts',
        needsConnection: true 
      }, { status: 400 });
    }
    
    const profileKey = contractor.ayrshare_profile_key;
    
    if (minLeads) {
      // Mine potential leads from DMs
      const leads = await mineLeadsFromDMs(profileKey);
      return NextResponse.json({
        success: true,
        leads,
        count: leads.length,
      });
    } else {
      // Get all conversations
      const conversations = await getConversations(profileKey);
      const messages = await getMessages(profileKey);
      
      return NextResponse.json({
        success: true,
        conversations,
        messages,
        counts: {
          conversations: conversations.length,
          messages: messages.length,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
