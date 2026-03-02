import { NextRequest, NextResponse } from 'next/server';
import { getContractorById, updateContractor, deleteContractor } from '../../../../../lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const contractor = getContractorById(id);
    if (!contractor) {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
    }
    return NextResponse.json(contractor);
  } catch (error) {
    console.error('Error fetching contractor:', error);
    return NextResponse.json({ error: 'Failed to fetch contractor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const contractor = updateContractor(id, body);
    if (!contractor) {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
    }
    return NextResponse.json(contractor);
  } catch (error) {
    console.error('Error updating contractor:', error);
    return NextResponse.json({ error: 'Failed to update contractor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const success = deleteContractor(id);
    if (!success) {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contractor:', error);
    return NextResponse.json({ error: 'Failed to delete contractor' }, { status: 500 });
  }
}
