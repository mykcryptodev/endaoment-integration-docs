'use client';

import { useSearch } from '@/utils/useSearch';
import { getEndaomentUrls } from '@/utils/endaoment-urls';
import { useState } from 'react';

interface Organization {
  id: string | null;
  ein: string | null;
  name: string;
  description: string | null;
}

interface SearchPage {
  organizations: Organization[];
  hasNextPage: boolean;
}

export const OrgSearch = () => {
  const {
    searchTerm,
    setSearchTerm,
    submitSearch,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSearch();

  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  const toggleDescription = (orgId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [orgId]: !prev[orgId]
    }));
  };

  const getOrgId = (org: Organization) => {
    return org.ein ?? org.id ?? 'unknown';
  };

  const formatOrgName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex gap-4">
        <input
          className="input input-bordered flex-1"
          type="text"
          placeholder="Search organizations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          onBlur={submitSearch}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitSearch();
          }}
        />
        <button
          className="btn btn-primary"
          onClick={submitSearch}
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {data?.pages.map((page: SearchPage, i: number) => (
        <div key={i} className="space-y-4">
          {page.organizations.map((org: Organization) => (
            <div key={getOrgId(org)} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{formatOrgName(org.name)}</h2>
                <p className="text-sm opacity-70">
                  EIN: {org.ein || 'N/A'} | ID: {org.id || 'N/A'}
                </p>
                <div className="mt-2">
                  <p className={`${expandedDescriptions[getOrgId(org)] ? '' : 'line-clamp-2'}`}>
                    {org.description || 'No description available.'}
                  </p>
                  {org.description && (
                    <button
                      className="btn btn-link btn-sm p-0 mt-1"
                      onClick={() => toggleDescription(getOrgId(org))}
                    >
                      {expandedDescriptions[getOrgId(org)] ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
                <div className="card-actions justify-end mt-4">
                  <a
                    href={getEndaomentUrls(org.id).orgPage}
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
      ))}

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            className="btn btn-outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}; 