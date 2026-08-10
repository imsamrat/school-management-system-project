import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { Employee } from '@/types/employee.types';

export const employeeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<ApiResponse<Employee[]>, { q?: string }>({
      query: (params) => ({
        url: '/employees',
        params,
      }),
      providesTags: ['Employees'],
    }),
    getEmployeeById: builder.query<ApiResponse<Employee>, string>({
      query: (id) => `/employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Employees', id }],
    }),
    createEmployee: builder.mutation<ApiResponse<Employee>, Partial<Employee>>({
      query: (body) => ({
        url: '/employees',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Employees'],
    }),
    updateEmployee: builder.mutation<ApiResponse<Employee>, { id: string; body: Partial<Employee> }>({
      query: ({ id, body }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employees', id }, 'Employees'],
    }),
    deleteEmployee: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employees'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
