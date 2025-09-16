import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

// PUT - Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { userEmail, name, fullName, address, road, pinCode, country, state, city, phoneNumber } = body;
    const { id } = await params;

    console.log('Received update address data:', body);

    // Validate required fields
    if (!userEmail || !name || !fullName || !address || !road || !pinCode || !country || !state || !city || !phoneNumber) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Update address
    const updatedAddress = await backendClient
      .patch(id)
      .set({
        userEmail,
        name,
        fullName,
        address,
        road,
        pinCode,
        country,
        state,
        city,
        phoneNumber,
        isDefault: false,
      })
      .commit();

    return NextResponse.json({ address: updatedAddress });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await backendClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
