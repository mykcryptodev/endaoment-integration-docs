import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import logo from './assets/logo.svg';
import { AllDafs } from './components/all-dafs/AllDafs';
import { NewDaf } from './components/new-daf/NewDaf';
import { OrgSearch } from './components/org-search/OrgSearch';
import { ThemePicker } from './components/theme-picker/ThemePicker';
import { getEnvOrThrow } from './utils/env';

type View = 'none' | 'org-search' | 'all-dafs' | 'new-daf';

const checkSignedInQueryOptions = queryOptions({
  queryKey: ['Check Signed In'],
  queryFn: async (): Promise<boolean> => {
    const response = await fetch(
      `${getEnvOrThrow('SAFE_BACKEND_URL')}/check-login`,
      { credentials: 'include' }
    );
    const data = await response.json();
    return data.isSignedIn;
  },
});

function App() {
  // Pull login status from the server
  const { data: isSignedIn, refetch: refetchSignInStatus } = useQuery(
    checkSignedInQueryOptions
  );
  const { mutate: signIn } = useMutation({
    mutationKey: ['Sign In'],
    mutationFn: async () => {
      const response = await fetch(
        `${getEnvOrThrow('SAFE_BACKEND_URL')}/init-login`
      );
      const { url } = await response.json();
      window.location.href = url;
    },
  });
  const { mutate: signOut } = useMutation({
    mutationKey: ['Sign Out'],
    mutationFn: async () => {
      await fetch(`${getEnvOrThrow('SAFE_BACKEND_URL')}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    },
    onSuccess: () => {
      refetchSignInStatus();
    },
  });

  // The current view the user is on
  const [currentView, setCurrentView] = useState<View>('none');

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <a href="https://endaoment.org" target="_blank" className="hover:opacity-80 transition-opacity">
              <img src={logo} className="h-16" alt="Endaoment logo" />
            </a>
            <ThemePicker />
          </div>
          <h1 className="text-4xl font-bold text-center">Endaoment Quickstart</h1>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              className="btn btn-primary" 
              onClick={() => setCurrentView('org-search')}
            >
              Search Orgs
            </button>

            {isSignedIn ? (
              <>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setCurrentView('all-dafs')}
                >
                  View My DAFs
                </button>
                <button 
                  className="btn btn-accent" 
                  onClick={() => setCurrentView('new-daf')}
                >
                  Open A New DAF
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => {
                    setCurrentView('none');
                    signOut();
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                className="btn btn-success"
                onClick={() => {
                  setCurrentView('none');
                  signIn();
                }}
              >
                Sign In
              </button>
            )}
          </div>

          <main className="w-full max-w-4xl">
            {currentView === 'org-search' && <OrgSearch />}
            {currentView === 'all-dafs' && <AllDafs />}
            {currentView === 'new-daf' && <NewDaf />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
