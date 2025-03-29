import { useSearch } from '../../utils/useSearch';
import { getEndaomentUrls } from '../../utils/endaoment-urls';

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

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          data?.pages.map((page) =>
            page.map((org) => (
              <div key={org.ein ?? org.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    {org.logo && (
                      <img 
                        src={org.logo} 
                        alt={org.name} 
                        className="w-16 h-16 object-contain"
                      />
                    )}
                    <div>
                      <h2 className="card-title">
                        <a 
                          href={`${getEndaomentUrls().app}/orgs/${org.ein ?? org.id}`}
                          className="link link-primary"
                        >
                          {org.name}
                        </a>
                      </h2>
                      {org.description && (
                        <p className="text-base-content/70">{org.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        )}
        {hasNextPage && (
          <div className="flex justify-center">
            {isFetchingNextPage ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <button
                onClick={() => fetchNextPage()}
                type="button"
                className="btn btn-outline"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
