import { api } from '@/services/api';
import type { ApiResponse } from '@/types';

export interface DashboardMetrics {
  totalStudents: number;
  activeTeachers: number;
  totalEmployees: number;
  todayAttendance: number;
  pendingFees: number;
  todayCollection: number;
  booksIssued: number;
  recentActivities: {
    id: number;
    action: string;
    time: string;
    type: 'finance' | 'admission' | 'library' | 'academic' | 'system';
  }[];
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query<ApiResponse<DashboardMetrics>, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardMetricsQuery } = dashboardApi;
