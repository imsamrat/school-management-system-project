import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { Staff, StaffRole } from '@/types/staff.types';

export const staffApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ── Universal staff query ─────────────────────────────────────────────
    getStaff: builder.query<ApiResponse<Staff[]>, { role?: StaffRole; q?: string }>({
      query: (params) => ({ url: '/staff', params }),
      providesTags: ['Staff'],
    }),
    getStaffById: builder.query<ApiResponse<Staff>, string>({
      query: (id) => `/staff/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Staff', id }],
    }),
    createStaff: builder.mutation<ApiResponse<Staff>, Partial<Staff>>({
      query: (body) => ({ url: '/staff', method: 'POST', body }),
      invalidatesTags: ['Staff', 'Teachers', 'Employees'],
    }),
    updateStaff: builder.mutation<ApiResponse<Staff>, { id: string; body: Partial<Staff> }>({
      query: ({ id, body }) => ({ url: `/staff/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Staff', id }, 'Staff', 'Teachers', 'Employees',
      ],
    }),
    deleteStaff: builder.mutation<ApiResponse, string>({
      query: (id) => ({ url: `/staff/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Staff', 'Teachers', 'Employees'],
    }),

    // ── Special actions ────────────────────────────────────────────────────
    promoteToTeacher: builder.mutation<
      ApiResponse<Staff>,
      { id: string; body: Partial<Staff> }
    >({
      query: ({ id, body }) => ({ url: `/staff/${id}/promote`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Staff', id }, 'Staff', 'Teachers', 'Employees',
      ],
    }),
    demoteFromTeacher: builder.mutation<ApiResponse<Staff>, string>({
      query: (id) => ({ url: `/staff/${id}/demote`, method: 'PATCH', body: {} }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Staff', id }, 'Staff', 'Teachers', 'Employees',
      ],
    }),

    // ── Legacy filtered queries (kept for existing components) ─────────────
    getTeachers: builder.query<ApiResponse<Staff[]>, { q?: string } | void>({
      query: (params) => ({ url: '/teachers', params }),
      providesTags: ['Teachers'],
    }),
    getTeacherById: builder.query<ApiResponse<Staff>, string>({
      query: (id) => `/teachers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Teachers', id }],
    }),
    createTeacher: builder.mutation<ApiResponse<Staff>, Partial<Staff>>({
      query: (body) => ({ url: '/teachers', method: 'POST', body: { ...body, is_teacher: true } }),
      invalidatesTags: ['Teachers', 'Staff'],
    }),
    updateTeacher: builder.mutation<ApiResponse<Staff>, { id: string; body: Partial<Staff> }>({
      query: ({ id, body }) => ({ url: `/teachers/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Teachers', id }, 'Teachers', 'Staff',
      ],
    }),
    deleteTeacher: builder.mutation<ApiResponse, string>({
      query: (id) => ({ url: `/teachers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Teachers', 'Staff'],
    }),

    getEmployees: builder.query<ApiResponse<Staff[]>, { q?: string } | void>({
      query: (params) => ({ url: '/employees', params }),
      providesTags: ['Employees'],
    }),
    getEmployeeById: builder.query<ApiResponse<Staff>, string>({
      query: (id) => `/employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Employees', id }],
    }),
    createEmployee: builder.mutation<ApiResponse<Staff>, Partial<Staff>>({
      query: (body) => ({ url: '/employees', method: 'POST', body }),
      invalidatesTags: ['Employees', 'Staff'],
    }),
    updateEmployee: builder.mutation<ApiResponse<Staff>, { id: string; body: Partial<Staff> }>({
      query: ({ id, body }) => ({ url: `/employees/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Employees', id }, 'Employees', 'Staff',
      ],
    }),
    deleteEmployee: builder.mutation<ApiResponse, string>({
      query: (id) => ({ url: `/employees/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Employees', 'Staff'],
    }),
  }),
});

export const {
  useGetStaffQuery,
  useGetStaffByIdQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  usePromoteToTeacherMutation,
  useDemoteFromTeacherMutation,
  // Legacy
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = staffApi;
