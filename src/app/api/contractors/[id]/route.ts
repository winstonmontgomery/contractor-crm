import { NextRequest, NextResponse } from 'next/server';
import { getContractorById, updateContractor, deleteContractor } from '../../../../../lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contractorId = parseInt(id);
    const contractor = getContractorById(contractorId);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contractorId = parseInt(id);
    const body = await request.json();
    const contractor = updateContractor(contractorId, body);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contractorId = parseInt(id);
    const success = deleteContractor(contractorId);
    if (!success) {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contractor:', error);
    return NextResponse.json({ error: 'Failed to delete contractor' }, { status: 500 });
  }
}
