import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface Organization {
  id: string | null;
  ein: string | null;
  name: string;
  description: string | null;
}

interface SearchResponse {
  organizations: Organization[];
  hasNextPage: boolean;
}

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['search', searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&page=${pageParam}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<SearchResponse>;
    },
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.organizations.length + 1 : undefined,
    initialPageParam: 1,
  });

  const submitSearch = () => {
    if (searchTerm.trim()) {
      queryClient.invalidateQueries({ queryKey: ['search'] });
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    submitSearch,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  };
}; 