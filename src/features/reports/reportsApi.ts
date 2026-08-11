import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { GeneralReportData } from '@/types/reports.types';

export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralReports: builder.query<ApiResponse<GeneralReportData>, void>({
      query: () => '/reports/general',
      providesTags: ['Reports'],
    }),
  }),
});

export const {
  useGetGeneralReportsQuery,
} = reportsApi;
