import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

// GET - Fetch addresses for a user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get('userEmail');

  if (!userEmail) {
    return NextResponse.json({ error: 'User email is required' }, { status: 400 });
  }

  try {
    const query = `*[_type == "address" && userEmail == $userEmail] | order(isDefault desc, _createdAt desc)`;
    const addresses = await backendClient.fetch(query, { userEmail });
    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, name, fullName, address, road, pinCode, country, state, city, phoneNumber } = body;

    console.log('Received address data:', body);

    // Validate required fields
    if (!userEmail || !name || !fullName || !address || !road || !pinCode || !country || !state || !city || !phoneNumber) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Create new address
    const newAddress = await backendClient.create({
      _type: 'address',
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
    });

    return NextResponse.json({ address: newAddress }, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
