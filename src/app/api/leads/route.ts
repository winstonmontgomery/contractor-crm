import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads, createLead } from '../../../../lib/database';

export async function GET() {
  try {
    const leads = getAllLeads();
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lead = createLead({
      name: body.name,
      details: body.details || null,
      service_needed: body.service_needed || null,
      location: body.location || null,
      source: body.source || 'manual',
      source_url: body.source_url || null,
      lead_temperature: body.lead_temperature || 'warm',
      urgency: body.urgency || 'normal',
      status: body.status || 'new',
      assigned_contractor_id: null,
      posted_at: body.posted_at || null,
    });
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
