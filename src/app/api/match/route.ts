import { NextRequest, NextResponse } from 'next/server';
import { getMatchingContractors, matchLeadToContractor, getLeadById } from '../../../../lib/database';

// Get matching contractors for a lead
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    
    if (!leadId) {
      return NextResponse.json({ error: 'leadId required' }, { status: 400 });
    }
    
    const contractors = getMatchingContractors(parseInt(leadId));
    return NextResponse.json(contractors);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

// Assign a contractor to a lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, contractorId } = body;
    
    if (!leadId || !contractorId) {
      return NextResponse.json({ error: 'leadId and contractorId required' }, { status: 400 });
    }
    
    const lead = matchLeadToContractor(leadId, contractorId);
    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error matching:', error);
    return NextResponse.json({ error: 'Failed to match' }, { status: 500 });
  }
}
