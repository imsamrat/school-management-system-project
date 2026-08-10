import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { AttendanceRecord } from '@/types/attendance.types';

export const attendanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudentAttendance: builder.query<ApiResponse<AttendanceRecord[]>, { date: string, class_id?: string, section_id?: string }>({
      query: (params) => ({ url: '/attendance/students', params }),
      providesTags: ['Attendance'],
    }),
    markStudentAttendance: builder.mutation<ApiResponse, { date: string, records: { student_id: string, status: string }[] }>({
      query: (body) => ({ url: '/attendance/students', method: 'POST', body }),
      invalidatesTags: ['Attendance'],
    }),
    
    getTeacherAttendance: builder.query<ApiResponse<AttendanceRecord[]>, { date: string }>({
      query: (params) => ({ url: '/attendance/teachers', params }),
      providesTags: ['Attendance'],
    }),
    markTeacherAttendance: builder.mutation<ApiResponse, { date: string, records: { teacher_id: string, status: string }[] }>({
      query: (body) => ({ url: '/attendance/teachers', method: 'POST', body }),
      invalidatesTags: ['Attendance'],
    }),

    getEmployeeAttendance: builder.query<ApiResponse<AttendanceRecord[]>, { date: string }>({
      query: (params) => ({ url: '/attendance/employees', params }),
      providesTags: ['Attendance'],
    }),
    markEmployeeAttendance: builder.mutation<ApiResponse, { date: string, records: { employee_id: string, status: string }[] }>({
      query: (body) => ({ url: '/attendance/employees', method: 'POST', body }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetStudentAttendanceQuery,
  useMarkStudentAttendanceMutation,
  useGetTeacherAttendanceQuery,
  useMarkTeacherAttendanceMutation,
  useGetEmployeeAttendanceQuery,
  useMarkEmployeeAttendanceMutation,
} = attendanceApi;
