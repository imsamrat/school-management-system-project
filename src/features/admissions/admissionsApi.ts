import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { AdmissionApplication } from '@/types/admissions.types';

export const admissionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query<ApiResponse<AdmissionApplication[]>, void>({
      query: () => '/admissions/applications',
      providesTags: ['Admissions'],
    }),
    createApplication: builder.mutation<ApiResponse<AdmissionApplication>, Partial<AdmissionApplication>>({
      query: (body) => ({ url: '/admissions/applications', method: 'POST', body }),
      invalidatesTags: ['Admissions'],
    }),
    updateApplicationStatus: builder.mutation<ApiResponse<AdmissionApplication>, { id: string, status: string }>({
      query: ({ id, status }) => ({ url: `/admissions/applications/${id}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Admissions'],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationStatusMutation,
} = admissionsApi;
