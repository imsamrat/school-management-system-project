import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { Expense, ExpenseCategory } from '@/types/finance.types';

export const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenseCategories: builder.query<ApiResponse<ExpenseCategory[]>, void>({
      query: () => '/expenses/categories',
      providesTags: ['Expenses'],
    }),
    getExpenses: builder.query<ApiResponse<Expense[]>, { start_date?: string; end_date?: string; category_id?: string }>({
      query: (params) => ({
        url: '/expenses',
        params,
      }),
      providesTags: ['Expenses'],
    }),
    createExpense: builder.mutation<ApiResponse<Expense>, Partial<Expense>>({
      query: (body) => ({
        url: '/expenses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Expenses'],
    }),
    deleteExpense: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expenses'],
    }),
  }),
});

export const {
  useGetExpenseCategoriesQuery,
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
