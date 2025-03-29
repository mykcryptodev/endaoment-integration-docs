import { useQuery } from '@tanstack/react-query';
import { getEnvOrThrow } from '../../utils/env';
import type { DafActivity } from '../../utils/endaoment-types';
import { formatUsdc } from '../../utils/formatUsdc';
import { useState } from 'react';
import { formatDate } from '../../utils/formatDate';

const ACTIVITY_TYPE_TO_LABEL: Record<string, string> = {
  pending_grant: 'Pending Grant',
  grant: 'Grant',
  cash_donation_pledge: 'Cash Donation Pledge',
};

export const DafActivityList = ({ dafId }: { dafId: string }) => {
  const dafActivityResponse = useQuery({
    queryKey: ['Daf Activity', dafId],
    queryFn: async (): Promise<DafActivity[]> => {
      const response = await fetch(
        `${getEnvOrThrow('SAFE_BACKEND_URL')}/get-daf-activity?fundId=${dafId}`,
        { credentials: 'include' }
      );
      const list = await response.json();

      if (!Array.isArray(list)) {
        throw new Error('Invalid response');
      }

      return list;
    },
  });

  const [isShowingActivity, setIsShowingActivity] = useState(false);
  const toggleShow = () => setIsShowingActivity((v) => !v);

  return (
    <div className="space-y-4">
      <button 
        type="button" 
        onClick={toggleShow}
        className="btn btn-ghost btn-sm"
      >
        {isShowingActivity ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Hide Activity
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Show Activity
          </>
        )}
      </button>
      {isShowingActivity && (
        <div className="space-y-2">
          {dafActivityResponse.data ? (
            dafActivityResponse.data.map((activity) => (
              <div
                key={activity.occurredAtUtc + activity.usdcAmount}
                className="card bg-base-200"
              >
                <div className="card-body p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">
                        {ACTIVITY_TYPE_TO_LABEL[activity.type]}
                      </h4>
                      <p className="text-sm opacity-70">
                        {formatDate(activity.occurredAtUtc)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold">
                        {formatUsdc(activity.usdcAmount)}
                      </p>
                      <p className="text-sm opacity-70">USDC</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-base-content/70">
              No activity yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};
