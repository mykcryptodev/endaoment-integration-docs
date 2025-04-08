'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { getEndaomentUrls } from '@/utils/endaoment-urls';
import { formatUsdc } from '@/utils/formatUsdc';

interface Daf {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
}

const allDafsQueryOptions = queryOptions({
  queryKey: ['All DAFs'],
  queryFn: async (): Promise<Daf[]> => {
    const response = await fetch('/api/get-dafs', { credentials: 'include' });
    const list = await response.json();

    if (!Array.isArray(list)) {
      throw new Error('Invalid response');
    }

    return list;
  },
});

export const AllDafs = () => {
  const allDafsResponse = useQuery(allDafsQueryOptions);

  if (allDafsResponse.isLoading) {
    return <div className="text-center">Loading DAFs...</div>;
  }

  if (allDafsResponse.isError) {
    return <div className="text-center text-error">Error loading DAFs</div>;
  }

  if (!allDafsResponse.data?.length) {
    return <div className="text-center">No DAFs found</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Your DAFs</h2>
      <div className="grid gap-4">
        {allDafsResponse.data.map((daf) => (
          <div key={daf.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">{daf.name}</h3>
              <p className="text-sm opacity-70">
                Balance: {formatUsdc(daf.balance)}
              </p>
              <p className="text-sm opacity-70">
                Created: {new Date(daf.createdAt).toLocaleDateString()}
              </p>
              <div className="card-actions justify-end mt-4">
                <a
                  href={getEndaomentUrls(daf.id).orgPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  View on Endaoment
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 