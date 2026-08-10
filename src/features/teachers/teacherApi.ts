import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { Teacher } from '@/types/teacher.types';

export const teacherApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<ApiResponse<Teacher[]>, { q?: string }>({
      query: (params) => ({
        url: '/teachers',
        params,
      }),
      providesTags: ['Teachers'],
    }),
    getTeacherById: builder.query<ApiResponse<Teacher>, string>({
      query: (id) => `/teachers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Teachers', id }],
    }),
    createTeacher: builder.mutation<ApiResponse<Teacher>, Partial<Teacher>>({
      query: (body) => ({
        url: '/teachers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Teachers'],
    }),
    updateTeacher: builder.mutation<ApiResponse<Teacher>, { id: string; body: Partial<Teacher> }>({
      query: ({ id, body }) => ({
        url: `/teachers/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Teachers', id }, 'Teachers'],
    }),
    deleteTeacher: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/teachers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teachers'],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
