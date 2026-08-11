import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { Expense, ExpenseCategory } from '@/types/finance.types';

export const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenseCategories: builder.query<ApiResponse<ExpenseCategory[]>, void>({
      query: () => '/expenses/categories',
      providesTags: ['ExpenseCategories'],
    }),
    createExpenseCategory: builder.mutation<ApiResponse<ExpenseCategory>, { name: string; description?: string }>({
      query: (body) => ({
        url: '/expenses/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ExpenseCategories'],
    }),
    deleteExpenseCategory: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/expenses/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ExpenseCategories'],
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
  useCreateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
