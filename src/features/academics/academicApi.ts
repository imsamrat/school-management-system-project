import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { Class, Section, Subject, CourseAssignment, ClassRoutine } from '@/types/academic.types';

export const academicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Classes
    getClasses: builder.query<ApiResponse<Class[]>, void>({
      query: () => '/classes',
      providesTags: ['Classes'],
    }),
    createClass: builder.mutation<ApiResponse<Class>, Partial<Class>>({
      query: (body) => ({
        url: '/classes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Classes'],
    }),
    updateClass: builder.mutation<ApiResponse<Class>, { id: string; body: Partial<Class> }>({
      query: ({ id, body }) => ({
        url: `/classes/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Classes'],
    }),

    // Sections
    getSections: builder.query<ApiResponse<Section[]>, void>({
      query: () => '/sections',
      providesTags: ['Sections'],
    }),
    createSection: builder.mutation<ApiResponse<Section>, Partial<Section>>({
      query: (body) => ({
        url: '/sections',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Sections'],
    }),

    // Subjects
    getSubjects: builder.query<ApiResponse<Subject[]>, void>({
      query: () => '/subjects',
      providesTags: ['Subjects'],
    }),
    createSubject: builder.mutation<ApiResponse<Subject>, Partial<Subject>>({
      query: (body) => ({
        url: '/subjects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subjects'],
    }),

    // Course Assignments
    getCourseAssignments: builder.query<ApiResponse<CourseAssignment[]>, void>({
      query: () => '/course-assignments',
      providesTags: ['CourseAssignments'],
    }),
    createCourseAssignment: builder.mutation<ApiResponse<CourseAssignment>, Partial<CourseAssignment>>({
      query: (body) => ({ url: '/course-assignments', method: 'POST', body }),
      invalidatesTags: ['CourseAssignments'],
    }),

    // Class Routines
    getClassRoutines: builder.query<ApiResponse<ClassRoutine[]>, void>({
      query: () => '/class-routines',
      providesTags: ['ClassRoutines'],
    }),
    createClassRoutine: builder.mutation<ApiResponse<ClassRoutine>, Partial<ClassRoutine>>({
      query: (body) => ({ url: '/class-routines', method: 'POST', body }),
      invalidatesTags: ['ClassRoutines'],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useGetSectionsQuery,
  useCreateSectionMutation,
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useGetCourseAssignmentsQuery,
  useCreateCourseAssignmentMutation,
  useGetClassRoutinesQuery,
  useCreateClassRoutineMutation,
} = academicApi;
