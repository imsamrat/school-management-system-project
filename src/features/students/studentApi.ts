import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { Student } from '@/types/student.types';

export const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<ApiResponse<Student[]>, { q?: string }>({
      query: (params) => ({
        url: '/students',
        params,
      }),
      providesTags: ['Students'],
    }),
    getStudentById: builder.query<ApiResponse<Student>, string>({
      query: (id) => `/students/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Students', id }],
    }),
    createStudent: builder.mutation<ApiResponse<Student>, Partial<Student>>({
      query: (body) => ({
        url: '/students',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Students'],
    }),
    updateStudent: builder.mutation<ApiResponse<Student>, { id: string; body: Partial<Student> }>({
      query: ({ id, body }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Students', id }, 'Students'],
    }),
    deleteStudent: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Students'],
    }),
    getStudentGuardians: builder.query<ApiResponse<any[]>, string>({
      query: (studentId) => `/students/${studentId}/guardians`,
      providesTags: (_result, _error, id) => [{ type: 'Students', id: `guardians-${id}` }],
    }),
    addStudentGuardian: builder.mutation<ApiResponse<any>, { studentId: string; body: any }>({
      query: ({ studentId, body }) => ({
        url: `/students/${studentId}/guardians`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { studentId }) => [{ type: 'Students', id: `guardians-${studentId}` }],
    }),
    deleteStudentGuardian: builder.mutation<ApiResponse, { guardianId: string; studentId: string }>({
      query: ({ guardianId }) => ({
        url: `/students/guardians/${guardianId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { studentId }) => [{ type: 'Students', id: `guardians-${studentId}` }],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentGuardiansQuery,
  useAddStudentGuardianMutation,
  useDeleteStudentGuardianMutation,
} = studentApi;
