import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { SalaryStructure, PayrollRecord } from '@/types/payroll.types';

export const payrollApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSalaryStructures: builder.query<ApiResponse<SalaryStructure[]>, void>({
      query: () => '/payroll/salary-structures',
      providesTags: ['Payroll'],
    }),
    createSalaryStructure: builder.mutation<ApiResponse<SalaryStructure>, Partial<SalaryStructure>>({
      query: (body) => ({ url: '/payroll/salary-structures', method: 'POST', body }),
      invalidatesTags: ['Payroll'],
    }),
    getPayrollRecords: builder.query<ApiResponse<PayrollRecord[]>, { month?: string }>({
      query: (params) => ({ url: '/payroll/records', params }),
      providesTags: ['Payroll'],
    }),
    processPayroll: builder.mutation<ApiResponse<null>, { month: string }>({
      query: (body) => ({ url: '/payroll/process', method: 'POST', body }),
      invalidatesTags: ['Payroll'],
    }),
  }),
});

export const {
  useGetSalaryStructuresQuery,
  useCreateSalaryStructureMutation,
  useGetPayrollRecordsQuery,
  useProcessPayrollMutation,
} = payrollApi;
