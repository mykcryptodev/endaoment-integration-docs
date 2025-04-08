import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock DAF data
const MOCK_DAFS = [
  {
    id: '1',
    name: 'Example DAF 1',
    description: 'This is an example DAF for testing purposes.',
    balance: 10000,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Example DAF 2',
    description: 'Another example DAF for testing purposes.',
    balance: 25000,
    createdAt: '2024-02-01T00:00:00.000Z',
  },
];

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json(MOCK_DAFS);
} 