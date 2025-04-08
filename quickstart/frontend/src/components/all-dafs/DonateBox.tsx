import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import type { Daf, WireInstructions } from '../../utils/endaoment-types';
import { getEnvOrThrow } from '../../utils/env';
import type { FormEvent } from 'react';
import { getEndaomentUrls } from '../../utils/endaoment-urls';
import { queryClient } from '../../utils/queryClient';

export const DONATE_BOX_ID = 'donate-box';

const getWireInstructionsQueryOptions = queryOptions({
  queryKey: ['Wire Instructions'],
  queryFn: async (): Promise<WireInstructions> => {
    const response = await fetch(
      `${getEnvOrThrow('SAFE_BACKEND_URL')}/api/wire-donation`,
      {
        credentials: 'include',
      }
    );
    return response.json();
  },
});

export const DonateBox = ({
  daf,
  onClose,
}: {
  daf: Daf;
  onClose: () => void;
}) => {
  const { data: wireInstructions } = useQuery(getWireInstructionsQueryOptions);
  const {
    mutate: donate,
    isIdle,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationKey: ['Donate'],
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${getEnvOrThrow('SAFE_BACKEND_URL')}/api/wire-donation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: formData.get('amount'),
            fundId: daf.id,
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
    donate(new FormData(e.currentTarget));
  };

  return (
    <div className="card bg-base-100 shadow-xl" id={DONATE_BOX_ID}>
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h3 className="card-title">
            Donate to{' '}
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

        <form id="donate-form" onSubmit={handleSubmit} className="space-y-6">
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

          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p>
                Please make sure to wire the same amount to account #{' '}
                <span className="font-bold">{wireInstructions?.beneficiary.accountNumber}</span>
                {' at '}
                <span className="font-bold">{wireInstructions?.receivingBank.name}</span>
                {' with ABA routing #'}
                <span className="font-bold">{wireInstructions?.receivingBank.abaRoutingNumber}</span>
              </p>
            </div>
          </div>

          <div className="card-actions justify-end">
            {isIdle || isError ? (
              <button 
                type="submit" 
                className={`btn ${isError ? 'btn-error' : 'btn-primary'}`}
              >
                {isIdle && 'Donate'}
                {isError && 'Error donating, try again'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {isPending && (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Donating...</span>
                  </>
                )}
                {isSuccess && (
                  <div className="text-success flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Donated!</span>
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
