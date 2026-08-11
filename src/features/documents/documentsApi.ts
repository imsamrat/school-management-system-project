import { api } from '@/services/api';
import type { ApiResponse } from '@/types';
import type { Certificate } from '@/types/documents.types';

export const documentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCertificates: builder.query<ApiResponse<Certificate[]>, void>({
      query: () => '/documents/certificates',
      providesTags: ['Documents'],
    }),
    generateCertificate: builder.mutation<ApiResponse<Certificate>, Partial<Certificate>>({
      query: (body) => ({ url: '/documents/certificates', method: 'POST', body }),
      invalidatesTags: ['Documents'],
    }),
  }),
});

export const {
  useGetCertificatesQuery,
  useGenerateCertificateMutation,
} = documentsApi;
