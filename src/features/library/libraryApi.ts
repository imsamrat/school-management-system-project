import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { Book, BookIssue } from '@/types/library.types';

export const libraryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<ApiResponse<Book[]>, void>({
      query: () => '/library/books',
      providesTags: ['Books'],
    }),
    createBook: builder.mutation<ApiResponse<Book>, Partial<Book>>({
      query: (body) => ({ url: '/library/books', method: 'POST', body }),
      invalidatesTags: ['Books'],
    }),

    getIssues: builder.query<ApiResponse<BookIssue[]>, { status?: string }>({
      query: (params) => ({ url: '/library/issues', params }),
      providesTags: ['BookIssues'],
    }),
    issueBook: builder.mutation<ApiResponse<BookIssue>, Partial<BookIssue>>({
      query: (body) => ({ url: '/library/issues', method: 'POST', body }),
      invalidatesTags: ['BookIssues', 'Books'],
    }),
    returnBook: builder.mutation<ApiResponse<BookIssue>, { id: string, penalty_amount: number }>({
      query: ({ id, penalty_amount }) => ({ 
        url: `/library/issues/${id}/return`, 
        method: 'POST', 
        body: { penalty_amount } 
      }),
      invalidatesTags: ['BookIssues', 'Books'],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useGetIssuesQuery,
  useIssueBookMutation,
  useReturnBookMutation,
} = libraryApi;
