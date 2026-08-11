import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import PlaceholderPage from '@/pages/PlaceholderPage';

// Students
import StudentListPage from '@/pages/students/StudentListPage';
import StudentFormPage from '@/pages/students/StudentFormPage';
import StudentProfilePage from '@/pages/students/StudentProfilePage';

// Teachers
import TeacherListPage from '@/pages/teachers/TeacherListPage';
import TeacherFormPage from '@/pages/teachers/TeacherFormPage';
import TeacherProfilePage from '@/pages/teachers/TeacherProfilePage';

// Employees
import EmployeeListPage from '@/pages/employees/EmployeeListPage';
import EmployeeFormPage from '@/pages/employees/EmployeeFormPage';
import EmployeeProfilePage from '@/pages/employees/EmployeeProfilePage';

// Staff (Unified)
import StaffListPage from '@/pages/staff/StaffListPage';
import StaffFormPage from '@/pages/staff/StaffFormPage';
import StaffProfilePage from '@/pages/staff/StaffProfilePage';

// Academics
import ClassesPage from '@/pages/academics/ClassesPage';
import SectionsPage from '@/pages/academics/SectionsPage';
import SubjectsPage from '@/pages/academics/SubjectsPage';
import CourseAssignmentsPage from '@/pages/academics/CourseAssignmentsPage';
import ClassRoutinePage from '@/pages/academics/ClassRoutinePage';
import AcademicYearsPage from '@/pages/academics/AcademicYearsPage';

// Attendance
import StudentAttendancePage from '@/pages/attendance/StudentAttendancePage';
import TeacherAttendancePage from '@/pages/attendance/TeacherAttendancePage';
import EmployeeAttendancePage from '@/pages/attendance/EmployeeAttendancePage';
import AttendanceReportsPage from '@/pages/attendance/AttendanceReportsPage';

// Examinations
import ExamSetupPage from '@/pages/examinations/ExamSetupPage';
import ExamSchedulePage from '@/pages/examinations/ExamSchedulePage';
import MarksEntryPage from '@/pages/examinations/MarksEntryPage';
import ReportCardPage from '@/pages/examinations/ReportCardPage';
import ExamResultsPage from '@/pages/examinations/ExamResultsPage';

// Finance
import FeeStructurePage from '@/pages/finance/FeeStructurePage';
import StudentFeesPage from '@/pages/finance/StudentFeesPage';
import PaymentHistoryPage from '@/pages/finance/PaymentHistoryPage';
import FeeReceiptPage from '@/pages/finance/FeeReceiptPage';
import CollectFeesPage from '@/pages/finance/CollectFeesPage';
import FinanceReportsPage from '@/pages/finance/FinanceReportsPage';

// Library
import BookListPage from '@/pages/library/BookListPage';
import BookIssuePage from '@/pages/library/BookIssuePage';
import BookReturnPage from '@/pages/library/BookReturnPage';

// Payroll
import SalaryStructurePage from '@/pages/payroll/SalaryStructurePage';
import ProcessPayrollPage from '@/pages/payroll/ProcessPayrollPage';
import PayslipsPage from '@/pages/payroll/PayslipsPage';

// Settings
import SchoolProfilePage from '@/pages/settings/SchoolProfilePage';
import SystemSettingsPage from '@/pages/settings/SystemSettingsPage';
import AcademicSettingsPage from '@/pages/settings/AcademicSettingsPage';
import FeeSettingsPage from '@/pages/settings/FeeSettingsPage';
import UsersPage from '@/pages/settings/UsersPage';
import AuditLogsPage from '@/pages/settings/AuditLogsPage';

// Admissions
import ApplicationsPage from '@/pages/admissions/ApplicationsPage';
import NewAdmissionPage from '@/pages/admissions/NewAdmissionPage';

// Documents
import AdmitCardsPage from '@/pages/documents/AdmitCardsPage';
import IdCardsPage from '@/pages/documents/IdCardsPage';
import CertificatesPage from '@/pages/documents/CertificatesPage';

// Reports
import GeneralReportsPage from '@/pages/reports/GeneralReportsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },

      // Admissions
      { path: 'admissions', element: <ApplicationsPage /> },
      { path: 'admissions/new', element: <NewAdmissionPage /> },

      // Students
      { path: 'students', element: <StudentListPage /> },
      { path: 'students/new', element: <StudentFormPage /> },
      { path: 'students/:id/edit', element: <StudentFormPage /> },
      { path: 'students/:id', element: <StudentProfilePage /> },

      // Teachers (legacy routes kept for compatibility)
      { path: 'teachers', element: <TeacherListPage /> },
      { path: 'teachers/new', element: <TeacherFormPage /> },
      { path: 'teachers/:id', element: <TeacherProfilePage /> },

      // Employees (legacy routes kept for compatibility)
      { path: 'employees', element: <EmployeeListPage /> },
      { path: 'employees/new', element: <EmployeeFormPage /> },
      { path: 'employees/:id', element: <EmployeeProfilePage /> },

      // Staff (Unified — primary routes)
      { path: 'staff', element: <StaffListPage /> },
      { path: 'staff/new', element: <StaffFormPage /> },
      { path: 'staff/:id', element: <StaffProfilePage /> },

      // Academics
      { path: 'academics/years', element: <AcademicYearsPage /> },
      { path: 'academics/classes', element: <ClassesPage /> },
      { path: 'academics/subjects', element: <SubjectsPage /> },
      { path: 'academics/assignments', element: <CourseAssignmentsPage /> },
      { path: 'academics/routine', element: <ClassRoutinePage /> },

      // Sections
      { path: 'academics/sections', element: <SectionsPage /> },

      // Attendance
      { path: 'attendance/students', element: <StudentAttendancePage /> },
      { path: 'attendance/teachers', element: <TeacherAttendancePage /> },
      { path: 'attendance/employees', element: <EmployeeAttendancePage /> },
      { path: 'attendance/reports', element: <AttendanceReportsPage /> },

      // Exams
      { path: 'exams', element: <ExamSetupPage /> },
      { path: 'exams/new', element: <PlaceholderPage /> },
      { path: 'exams/schedule', element: <ExamSchedulePage /> },
      { path: 'exams/marks', element: <MarksEntryPage /> },
      { path: 'exams/results', element: <ExamResultsPage /> },
      { path: 'exams/report-cards', element: <ReportCardPage /> },

      // Finance
      { path: 'finance/fee-structure', element: <FeeStructurePage /> },
      { path: 'finance/student-fees', element: <StudentFeesPage /> },
      { path: 'finance/history', element: <PaymentHistoryPage /> },
      { path: 'finance/receipts/:id', element: <FeeReceiptPage /> },
      { path: 'finance/collect', element: <CollectFeesPage /> },
      { path: 'finance/payments', element: <PaymentHistoryPage /> },
      { path: 'finance/reports', element: <FinanceReportsPage /> },
      { path: 'finance/refunds', element: <PlaceholderPage /> },

      // Library
      { path: 'library/books', element: <BookListPage /> },
      { path: 'library/issue', element: <BookIssuePage /> },
      { path: 'library/return', element: <BookReturnPage /> },

      // Payroll
      { path: 'payroll', element: <PlaceholderPage /> },
      { path: 'payroll/salary-structure', element: <SalaryStructurePage /> },
      { path: 'payroll/process', element: <ProcessPayrollPage /> },
      { path: 'payroll/payslips', element: <PayslipsPage /> },
      { path: 'payroll/reports', element: <PlaceholderPage /> },

      // Documents
      { path: 'documents/admit-cards', element: <AdmitCardsPage /> },
      { path: 'documents/id-cards', element: <IdCardsPage /> },
      { path: 'documents/certificates', element: <CertificatesPage /> },

      // Reports
      { path: 'reports/students', element: <GeneralReportsPage /> },
      { path: 'reports/attendance', element: <GeneralReportsPage /> },
      { path: 'reports/academic', element: <GeneralReportsPage /> },
      { path: 'reports/finance', element: <GeneralReportsPage /> },
      { path: 'reports/payroll', element: <GeneralReportsPage /> },

      // Settings
      { path: 'settings/school', element: <SchoolProfilePage /> },
      { path: 'settings/academic', element: <AcademicSettingsPage /> },
      { path: 'settings/fees', element: <FeeSettingsPage /> },
      { path: 'settings/users', element: <UsersPage /> },
      { path: 'settings/audit-logs', element: <AuditLogsPage /> },
      { path: 'settings/system', element: <SystemSettingsPage /> },

      // Catch-all
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
