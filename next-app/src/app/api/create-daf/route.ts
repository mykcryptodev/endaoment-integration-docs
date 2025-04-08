import { NextResponse } from 'next/server';

interface CreateDafRequest {
  name: string;
  description?: string;
  fundAdvisor: {
    firstName: string;
    lastName: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateDafRequest;

    // Validate required fields
    if (!body.name || !body.fundAdvisor?.firstName || !body.fundAdvisor?.lastName || !body.fundAdvisor?.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock successful DAF creation
    const mockDaf = {
      id: Math.random().toString(36).substring(7),
      name: body.name,
      description: body.description,
      balance: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(mockDaf);
  } catch (error) {
    console.error('Error creating DAF:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 