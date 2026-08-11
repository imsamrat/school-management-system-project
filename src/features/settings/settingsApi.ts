import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { SchoolProfile, SystemSettings } from '@/types/settings.types';

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolProfile: builder.query<ApiResponse<SchoolProfile>, void>({
      query: () => '/settings/profile',
      providesTags: ['Settings'],
    }),
    updateSchoolProfile: builder.mutation<ApiResponse<SchoolProfile>, Partial<SchoolProfile>>({
      query: (body) => ({ url: '/settings/profile', method: 'PUT', body }),
      invalidatesTags: ['Settings'],
    }),
    getSystemSettings: builder.query<ApiResponse<SystemSettings>, void>({
      query: () => '/settings/system',
      providesTags: ['Settings'],
    }),
    updateSystemSettings: builder.mutation<ApiResponse<SystemSettings>, Partial<SystemSettings>>({
      query: (body) => ({ url: '/settings/system', method: 'PUT', body }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetSchoolProfileQuery,
  useUpdateSchoolProfileMutation,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} = settingsApi;
