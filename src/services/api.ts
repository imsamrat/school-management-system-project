import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import { API_BASE_URL } from '@/utils/constants';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Auth',
    'Students',
    'Teachers',
    'Employees',
    'Classes',
    'Sections',
    'Subjects',
    'CourseAssignments',
    'ClassRoutines',
    'AcademicYears',
    'Attendance',
    'Exams',
    'ExamSchedules',
    'Marks',
    'FeeTypes',
    'FeeStructures',
    'FeeInvoices',
    'FeePayments',
    'Books',
    'BookIssues',
    'Payroll',
    'Settings',
    'Admissions',
    'Documents',
    'Reports',
    'Notifications',
    'AuditLogs',
    'Settings',
    'Users',
    'Roles',
    'Dashboard',
  ],
  endpoints: () => ({}),
});
