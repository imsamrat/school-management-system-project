import { api } from '@/services/api';
import type { ApiResponse, User, LoginCredentials, DashboardStats } from '@/types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<{ user: User; token: string }>, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
    }),
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi;
export const { useGetDashboardStatsQuery } = dashboardApi;
