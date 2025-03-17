import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { OrgListing } from "../../utils/endaoment-types";
import { getEndaomentUrls } from "../../utils/endaoment-urls";

import "./OrgSearch.css";

const PAGE_COUNT = 10;

const searchOnEndaoment = async (
  searchTerm: string,
  page: number,
): Promise<OrgListing[]> => {
  if (searchTerm === "") return [];

  const offset = page * PAGE_COUNT;
  const response = await fetch(
    `${getEndaomentUrls().api}/v2/orgs/search?searchTerm=${searchTerm}&count=${PAGE_COUNT}&offset=${offset}`,
  );
  return response.json();
};

export const OrgSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["org-search", submittedSearchTerm],
      queryFn: ({ pageParam }) =>
        searchOnEndaoment(submittedSearchTerm, pageParam),
      getNextPageParam: (last, pages) =>
        last.length < PAGE_COUNT ? null : pages.length,
      initialPageParam: 0,
    });

  return (
    <>
      <input
        className="org-search-input"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        onBlur={() => setSubmittedSearchTerm(searchTerm)}
      />
      <button onClick={() => setSubmittedSearchTerm(searchTerm)}>Search</button>
      <div className="org-list">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          data?.pages.map((page) =>
            page.map((org) => (
              <div key={org.ein ?? org.id} className="org-listing">
                <img src={org.logo} alt={org.logo ? org.name : ""} />
                <a href={`https://app.endaoment.org/orgs/${org.ein ?? org.id}`}>
                  {org.name}
                </a>
                <p>{org.description}</p>
              </div>
            )),
          )
        )}
        {hasNextPage &&
          (isFetchingNextPage ? (
            <span>Loading...</span>
          ) : (
            <button
              onClick={() => fetchNextPage()}
              type="button"
              className="load-more-button"
            >
              Load More
            </button>
          ))}
      </div>
    </>
  );
};
