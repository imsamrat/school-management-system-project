import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { FeeStructure, Invoice, Payment } from '@/types/finance.types';

export const financeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeeStructures: builder.query<ApiResponse<FeeStructure[]>, { class_id?: string }>({
      query: (params) => ({ url: '/finance/fee-structures', params }),
      providesTags: ['FeeStructures'],
    }),
    createFeeStructure: builder.mutation<ApiResponse<FeeStructure>, Partial<FeeStructure>>({
      query: (body) => ({ url: '/finance/fee-structures', method: 'POST', body }),
      invalidatesTags: ['FeeStructures'],
    }),

    getInvoices: builder.query<ApiResponse<Invoice[]>, { student_id?: string, status?: string }>({
      query: (params) => ({ url: '/finance/invoices', params }),
      providesTags: ['FeeInvoices'],
    }),
    createInvoice: builder.mutation<ApiResponse<Invoice>, Partial<Invoice>>({
      query: (body) => ({ url: '/finance/invoices', method: 'POST', body }),
      invalidatesTags: ['FeeInvoices'],
    }),

    getPayments: builder.query<ApiResponse<Payment[]>, { student_id?: string }>({
      query: (params) => ({ url: '/finance/payments', params }),
      providesTags: ['FeePayments'],
    }),
    collectPayment: builder.mutation<ApiResponse<Payment>, Partial<Payment>>({
      query: (body) => ({ url: '/finance/payments/collect', method: 'POST', body }),
      invalidatesTags: ['FeePayments', 'FeeInvoices'],
    }),
  }),
});

export const {
  useGetFeeStructuresQuery,
  useCreateFeeStructureMutation,
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useGetPaymentsQuery,
  useCollectPaymentMutation,
} = financeApi;
