import type { Daf, OrgListing } from '../../utils/endaoment-types';
import { useSearch } from '../../utils/useSearch';
import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getEnvOrThrow } from '../../utils/env';
import { getEndaomentUrls } from '../../utils/endaoment-urls';
import { queryClient } from '../../utils/queryClient';

export const GRANT_BOX_ID = 'grant-box';

export const GrantBox = ({
  daf,
  onClose,
}: {
  daf: Daf;
  onClose: () => void;
}) => {
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

  const [selectedOrg, setSelectedOrg] = useState<OrgListing | undefined>();

  const {
    mutate: grant,
    isIdle,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationKey: ['Donate'],
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${getEnvOrThrow('SAFE_BACKEND_URL')}/grant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: formData.get('amount'),
            fundId: daf.id,
            orgId: formData.get('orgId'),
            purpose: 'General Grant',
          }),
          credentials: 'include',
        }
      );

      return response.json();
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['Daf Activity'],
      });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedOrg) return;
    grant(new FormData(e.currentTarget));
  };

  return (
    <div className="card bg-base-100 shadow-xl" id={GRANT_BOX_ID}>
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h3 className="card-title">
            Grant from{' '}
            <a 
              href={`${getEndaomentUrls().app}/funds/${daf.id}`}
              className="link link-primary"
            >
              {daf.name}
            </a>
          </h3>
          <button 
            className="btn btn-sm btn-circle btn-ghost" 
            type="button" 
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form id="grant-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title">
                {selectedOrg
                  ? 'Granting to'
                  : 'Search and Select an Org to grant to'}
              </h4>
              {selectedOrg ? (
                <div className="flex items-center gap-4">
                  {selectedOrg.logo && (
                    <img 
                      src={selectedOrg.logo} 
                      alt={selectedOrg.name} 
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <h5 className="font-semibold">{selectedOrg.name}</h5>
                    {selectedOrg.description && (
                      <p className="text-sm opacity-70">{selectedOrg.description}</p>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-ghost"
                    onClick={() => setSelectedOrg(undefined)}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.currentTarget.value)}
                      onBlur={submitSearch}
                      className="input input-bordered flex-1"
                      placeholder="Search organizations..."
                    />
                    <button 
                      className="btn btn-primary" 
                      onClick={submitSearch}
                      type="button"
                    >
                      Search
                    </button>
                  </div>
                  <div className="space-y-2">
                    {isLoading ? (
                      <div className="flex justify-center">
                        <span className="loading loading-spinner loading-md"></span>
                      </div>
                    ) : (
                      data?.pages.map((page) =>
                        page.map((org) => (
                          <button
                            type="button"
                            onClick={() => setSelectedOrg(org)}
                            key={org.ein ?? org.id}
                            className="btn btn-ghost justify-start w-full text-left"
                          >
                            <div className="flex items-center gap-4">
                              {org.logo && (
                                <img 
                                  src={org.logo} 
                                  alt={org.name} 
                                  className="w-12 h-12 object-contain"
                                />
                              )}
                              <div>
                                <div className="font-semibold">{org.name}</div>
                                {org.description && (
                                  <div className="text-sm opacity-70">{org.description}</div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))
                      )
                    )}
                    {hasNextPage && (
                      <div className="flex justify-center">
                        {isFetchingNextPage ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          <button
                            onClick={() => fetchNextPage()}
                            type="button"
                            className="btn btn-outline btn-sm"
                          >
                            Load More
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <input
                name="orgId"
                hidden
                readOnly
                value={selectedOrg && selectedOrg.id ? selectedOrg.id : ''}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Amount in dollars</span>
            </label>
            <input 
              type="number" 
              id="amount" 
              name="amount" 
              className="input input-bordered"
              required
            />
          </div>

          <div className="card-actions justify-end">
            {isIdle || isError ? (
              <button 
                type="submit" 
                className={`btn ${isError ? 'btn-error' : 'btn-primary'}`}
                disabled={!selectedOrg}
              >
                {isIdle && 'Grant'}
                {isError && 'Error granting, try again'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {isPending && (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Granting...</span>
                  </>
                )}
                {isSuccess && (
                  <div className="text-success flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Granted!</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {isSuccess && (
            <div className="text-center">
              <a
                href={`${getEndaomentUrls().app}/funds/${daf.id}`}
                className="link link-primary"
              >
                View on Endaoment
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
