import { useSearch } from '../../utils/useSearch';
import { getEndaomentUrls } from '../../utils/endaoment-urls';
import { useState } from 'react';

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

  const getOrgId = (org: { ein: string | null; id: string | null }) => {
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
        <button className="btn btn-primary" type="button" onClick={submitSearch}>
          Search
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          data?.pages.map((page) =>
            page.map((org) => (
              <div key={getOrgId(org)} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <figure className="px-4 pt-4">
                  {org.logo ? (
                    <img 
                      src={org.logo} 
                      alt={org.name} 
                      className="rounded-xl h-48 w-full object-contain bg-base-200"
                    />
                  ) : (
                    <div className="rounded-xl h-48 w-full bg-base-200 flex items-center justify-center">
                      <span className="text-4xl text-base-content/30">{org.name.charAt(0)}</span>
                    </div>
                  )}
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-xl">
                    <a 
                      href={`${getEndaomentUrls().app}/orgs/${getOrgId(org)}`}
                      className="link"
                    >
                      {formatOrgName(org.name)}
                    </a>
                  </h2>
                  {org.description && (
                    <div className="prose prose-sm">
                      <p className="text-base-content/70">
                        {expandedDescriptions[getOrgId(org)] 
                          ? org.description 
                          : org.description.slice(0, 200) + (org.description.length > 200 ? '...' : '')}
                      </p>
                      {org.description.length > 200 && (
                        <button
                          onClick={() => toggleDescription(getOrgId(org))}
                          className="btn btn-link btn-sm p-0 text-primary hover:text-primary-focus"
                        >
                          {expandedDescriptions[getOrgId(org)] ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        )}
      </div>
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          {isFetchingNextPage ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            <button
              onClick={() => fetchNextPage()}
              type="button"
              className="btn btn-outline btn-wide"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};
