import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { SearchResult } from '@/types/search.types';

export const searchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<ApiResponse<SearchResult[]>, string>({
      query: (q) => `/search?q=${encodeURIComponent(q)}`,
      // Search results usually don't need a tag unless we want to invalidate them, 
      // but they are highly transient.
    }),
  }),
});

export const {
  useLazyGlobalSearchQuery,
} = searchApi;
