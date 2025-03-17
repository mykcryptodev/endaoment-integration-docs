import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import "./App.css";
import logo from "./assets/logo.svg";
import { AllDafs } from "./components/all-dafs/AllDafs";
import { NewDaf } from "./components/new-daf/NewDaf";
import { OrgSearch } from "./components/org-search/OrgSearch";
import { ViewDaf } from "./components/view-daf/ViewDaf";
import { getEnvOrThrow } from "./utils/env";

type View = "none" | "org-search" | "all-dafs" | "new-daf" | "view-daf";

const checkSignedInQueryOptions = queryOptions({
  queryKey: ["isSignedIn"],
  queryFn: async (): Promise<boolean> => {
    const response = await fetch("/api/check-login");
    const data = await response.json();
    return data.isSignedIn;
  },
});

function App() {
  // Pull login status from the server
  const { data: isSignedIn, refetch: refetchSignInStatus } = useQuery(
    checkSignedInQueryOptions,
  );
  const { mutate: signIn } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${getEnvOrThrow("SAFE_BACKEND_URL")}/init-login`,
      );
      const { url } = await response.json();
      window.location.href = url;
    },
  });
  const { mutate: signOut } = useMutation({
    mutationFn: () => fetch(`${getEnvOrThrow("SAFE_BACKEND_URL")}/logout`),
    onSuccess: () => {
      refetchSignInStatus();
    },
  });

  // The current view the user is on
  const [currentView, setCurrentView] = useState<View>("none");

  return (
    <>
      <div>
        <a href="https://endaoment.org" target="_blank">
          <img src={logo} className="logo" alt="Endaoment logo" />
        </a>
      </div>
      <h1>Endaoment Quickstart</h1>
      <div className="action-buttons">
        <button type="button" onClick={() => setCurrentView("org-search")}>
          Search Orgs
        </button>

        {isSignedIn ? (
          <>
            <button type="button" onClick={() => setCurrentView("all-dafs")}>
              View My DAFs
            </button>
            <button type="button" onClick={() => setCurrentView("new-daf")}>
              Open A New DAF
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView("none");
                signOut();
              }}
              data-color="red"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setCurrentView("none");
              signIn();
            }}
            data-color="green"
          >
            Sign In
          </button>
        )}
      </div>
      <main>
        {currentView === "org-search" && <OrgSearch />}
        {currentView === "all-dafs" && <AllDafs />}
        {currentView === "new-daf" && <NewDaf />}
        {currentView === "view-daf" && <ViewDaf />}
      </main>
    </>
  );
}

export default App;
