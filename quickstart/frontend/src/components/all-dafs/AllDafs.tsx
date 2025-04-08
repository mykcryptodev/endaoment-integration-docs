import { queryOptions, useQuery } from '@tanstack/react-query';
import { getEnvOrThrow } from '../../utils/env';
import type { Daf } from '../../utils/endaoment-types';
import { useReducer, useState } from 'react';
import { DONATE_BOX_ID, DonateBox } from './DonateBox';
import { GRANT_BOX_ID, GrantBox } from './GrantBox';
import { getEndaomentUrls } from '../../utils/endaoment-urls';
import { formatUsdc } from '../../utils/formatUsdc';
import { DafActivityList } from './DafActivityList';

const allDafsQueryOptions = queryOptions({
  queryKey: ['All DAFs'],
  queryFn: async (): Promise<Daf[]> => {
    const response = await fetch(
      `${getEnvOrThrow('SAFE_BACKEND_URL')}/api/get-dafs`,
      { credentials: 'include' }
    );
    const list = await response.json();

    if (!Array.isArray(list)) {
      throw new Error('Invalid response');
    }

    return list;
  },
});

export const AllDafs = () => {
  const allDafsResponse = useQuery(allDafsQueryOptions);

  const [focusedDaf, setFocusedDaf] = useReducer(
    (_prev: Daf | undefined, nextId: string | undefined) => {
      if (!nextId) return undefined;
      if (!allDafsResponse.data) return undefined;

      const foundDaf = allDafsResponse.data.find((daf) => daf.id === nextId);
      if (!foundDaf) return undefined;
      return foundDaf;
    },
    undefined
  );
  const [isShowingDonateBox, setIsShowingDonateBox] = useState(false);
  const [isShowingGrantBox, setIsShowingGrantBox] = useState(false);

  const handleDonate = (id: string) => {
    if (!focusedDaf || focusedDaf.id !== id || !isShowingDonateBox) {
      setFocusedDaf(id);
      setIsShowingDonateBox(true);
      document.getElementById(DONATE_BOX_ID)?.scrollIntoView();
    }
    setIsShowingGrantBox(false);
  };
  const handleGrant = (id: string) => {
    if (!focusedDaf || focusedDaf.id !== id || !isShowingGrantBox) {
      setFocusedDaf(id);
      setIsShowingGrantBox(true);
      document.getElementById(GRANT_BOX_ID)?.scrollIntoView();
    }
    setIsShowingDonateBox(false);
  };
  const handleClose = () => {
    setIsShowingDonateBox(false);
    setIsShowingGrantBox(false);
    setFocusedDaf(undefined);
  };

  return (
    <div className="space-y-6">
      {isShowingDonateBox && focusedDaf && (
        <DonateBox daf={focusedDaf} onClose={handleClose} />
      )}
      {isShowingGrantBox && focusedDaf && (
        <GrantBox daf={focusedDaf} onClose={handleClose} />
      )}
      {allDafsResponse.data && (
        <div className="grid gap-6">
          {allDafsResponse.data.map((daf) => (
            <div key={daf.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  <a 
                    href={`${getEndaomentUrls().app}/funds/${daf.id}`}
                    className="link link-primary"
                  >
                    {daf.name}
                  </a>
                </h2>
                {daf.description && (
                  <p className="text-base-content/70">{daf.description}</p>
                )}
                <p className="text-lg font-semibold">
                  Balance: {formatUsdc(daf.usdcBalance)} USDC
                </p>
                <div className="card-actions justify-end gap-2">
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleDonate(daf.id)} 
                    type="button"
                  >
                    Donate
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleGrant(daf.id)}
                    type="button"
                    disabled={BigInt(daf.usdcBalance) === 0n}
                  >
                    Grant
                  </button>
                </div>
                <div className="divider"></div>
                <DafActivityList dafId={daf.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
