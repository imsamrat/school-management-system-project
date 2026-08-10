import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { Exam, ExamSchedule, StudentMark } from '@/types/exam.types';

export const examApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query<ApiResponse<Exam[]>, void>({
      query: () => '/exams',
      providesTags: ['Exams'],
    }),
    createExam: builder.mutation<ApiResponse<Exam>, Partial<Exam>>({
      query: (body) => ({ url: '/exams', method: 'POST', body }),
      invalidatesTags: ['Exams'],
    }),

    getExamSchedules: builder.query<ApiResponse<ExamSchedule[]>, { exam_id?: string }>({
      query: (params) => ({ url: '/exams/schedules', params }),
      providesTags: ['ExamSchedules'],
    }),
    createExamSchedule: builder.mutation<ApiResponse<ExamSchedule>, Partial<ExamSchedule>>({
      query: (body) => ({ url: '/exams/schedules', method: 'POST', body }),
      invalidatesTags: ['ExamSchedules'],
    }),

    getMarks: builder.query<ApiResponse<StudentMark[]>, { exam_id: string, subject_id: string, student_id?: string }>({
      query: (params) => ({ url: '/exams/marks', params }),
      providesTags: ['Marks'],
    }),
    saveMarks: builder.mutation<ApiResponse, { exam_id: string, subject_id: string, marks: { student_id: string, marks_obtained: number, remarks?: string }[] }>({
      query: (body) => ({ url: '/exams/marks', method: 'POST', body }),
      invalidatesTags: ['Marks'],
    }),
  }),
});

export const {
  useGetExamsQuery,
  useCreateExamMutation,
  useGetExamSchedulesQuery,
  useCreateExamScheduleMutation,
  useGetMarksQuery,
  useSaveMarksMutation,
} = examApi;
