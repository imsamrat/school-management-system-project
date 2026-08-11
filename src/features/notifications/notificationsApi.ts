import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { AppNotification } from '@/types/notifications.types';

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ApiResponse<AppNotification[]>, void>({
      query: () => '/notifications',
      providesTags: ['Notifications'],
    }),
    markAsRead: builder.mutation<ApiResponse<AppNotification>, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }),
      invalidatesTags: ['Notifications'],
    }),
    markAllAsRead: builder.mutation<ApiResponse<null>, void>({
      query: () => ({ url: '/notifications/read-all', method: 'PUT' }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
