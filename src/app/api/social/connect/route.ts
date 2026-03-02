import { NextRequest, NextResponse } from 'next/server';
import { createContractorProfile, generateSocialLinkUrl, getProfiles } from '../../../../../lib/ayrshare';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'cv.db');

// Generate a social linking URL for a contractor
export async function POST(request: NextRequest) {
  try {
    const { contractorId } = await request.json();
    
    if (!contractorId) {
      return NextResponse.json({ error: 'contractorId required' }, { status: 400 });
    }
    
    // Get contractor from database
    const db = new Database(dbPath, { readonly: true });
    const contractor = db.prepare('SELECT * FROM contractors WHERE id = ?').get(contractorId) as any;
    db.close();
    
    if (!contractor) {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
    }
    
    // Check if contractor already has an Ayrshare profile
    let profileKey = contractor.ayrshare_profile_key;
    
    if (!profileKey) {
      // Create new Ayrshare profile for this contractor
      const profile = await createContractorProfile({
        title: contractor.company_name || contractor.name,
        refId: `contractor_${contractorId}`,
      });
      
      profileKey = profile.profileKey;
      
      // Save profile key to database
      const dbWrite = new Database(dbPath);
      dbWrite.prepare('UPDATE contractors SET ayrshare_profile_key = ? WHERE id = ?').run(profileKey, contractorId);
      dbWrite.close();
    }
    
    // Generate social linking URL
    const linkUrl = await generateSocialLinkUrl(profileKey);
    
    return NextResponse.json({
      success: true,
      linkUrl,
      profileKey,
      contractor: {
        id: contractor.id,
        name: contractor.name,
        company: contractor.company_name,
      },
    });
  } catch (error) {
    console.error('Error generating social link:', error);
    return NextResponse.json({ error: 'Failed to generate social link' }, { status: 500 });
  }
}

// Get list of all contractors with their social connection status
export async function GET() {
  try {
    // Get all Ayrshare profiles
    const profiles = await getProfiles();
    
    // Get all contractors
    const db = new Database(dbPath, { readonly: true });
    const contractors = db.prepare('SELECT id, name, company_name, ayrshare_profile_key FROM contractors WHERE active = 1').all();
    db.close();
    
    // Match contractors with their profiles
    const result = contractors.map((c: any) => ({
      id: c.id,
      name: c.name,
      company: c.company_name,
      hasProfile: !!c.ayrshare_profile_key,
      profileKey: c.ayrshare_profile_key,
    }));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching social connections:', error);
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}
