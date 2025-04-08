import { NextResponse } from 'next/server';

const MOCK_ORGANIZATIONS = [
  {
    id: '1',
    ein: '12-3456789',
    name: 'Example Organization 1',
    description: 'This is an example organization that helps people in need.',
  },
  {
    id: '2',
    ein: '98-7654321',
    name: 'Another Example Organization',
    description: 'Another example organization that makes a difference in the community.',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 10;

  // Filter organizations based on search query
  const filteredOrgs = MOCK_ORGANIZATIONS.filter(org =>
    org.name.toLowerCase().includes(query.toLowerCase()) ||
    org.description?.toLowerCase().includes(query.toLowerCase())
  );

  // Calculate pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrgs = filteredOrgs.slice(startIndex, endIndex);
  const hasNextPage = endIndex < filteredOrgs.length;

  return NextResponse.json({
    organizations: paginatedOrgs,
    hasNextPage,
  });
} 