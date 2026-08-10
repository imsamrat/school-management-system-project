import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import SchoolProfilePage from '@/pages/settings/SchoolProfilePage';
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

// Academics
import ClassesPage from '@/pages/academics/ClassesPage';
import SectionsPage from '@/pages/academics/SectionsPage';
import SubjectsPage from '@/pages/academics/SubjectsPage';
import CourseAssignmentsPage from '@/pages/academics/CourseAssignmentsPage';
import ClassRoutinePage from '@/pages/academics/ClassRoutinePage';

// Attendance
import StudentAttendancePage from '@/pages/attendance/StudentAttendancePage';
import TeacherAttendancePage from '@/pages/attendance/TeacherAttendancePage';
import EmployeeAttendancePage from '@/pages/attendance/EmployeeAttendancePage';

// Examinations
import ExamSetupPage from '@/pages/examinations/ExamSetupPage';
import ExamSchedulePage from '@/pages/examinations/ExamSchedulePage';
import MarksEntryPage from '@/pages/examinations/MarksEntryPage';
import ReportCardPage from '@/pages/examinations/ReportCardPage';

// Finance
import FeeStructurePage from '@/pages/finance/FeeStructurePage';
import StudentFeesPage from '@/pages/finance/StudentFeesPage';
import PaymentHistoryPage from '@/pages/finance/PaymentHistoryPage';
import FeeReceiptPage from '@/pages/finance/FeeReceiptPage';

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
      { path: 'admissions', element: <PlaceholderPage /> },
      { path: 'admissions/new', element: <PlaceholderPage /> },

      // Students
      { path: 'students', element: <StudentListPage /> },
      { path: 'students/new', element: <StudentFormPage /> },
      { path: 'students/:id', element: <StudentProfilePage /> },

      // Teachers
      { path: 'teachers', element: <TeacherListPage /> },
      { path: 'teachers/new', element: <TeacherFormPage /> },
      { path: 'teachers/:id', element: <TeacherProfilePage /> },

      // Employees
      { path: 'employees', element: <EmployeeListPage /> },
      { path: 'employees/new', element: <EmployeeFormPage /> },
      { path: 'employees/:id', element: <EmployeeProfilePage /> },

      // Academics
      { path: 'academics/years', element: <PlaceholderPage /> },
      { path: 'academics/classes', element: <ClassesPage /> },
      { path: 'academics/subjects', element: <SubjectsPage /> },
      { path: 'academics/assignments', element: <CourseAssignmentsPage /> },
      { path: 'academics/routine', element: <ClassRoutinePage /> },

      // Sections (not strictly under academics in the old router path, let's just make it academics/sections if it wasn't there, or just mount it. Wait, the sidebar says /academics/sections is not there. Wait, sidebar doesn't have sections? It's usually under Classes. But let's add the route anyway.)
      { path: 'academics/sections', element: <SectionsPage /> },

      // Attendance
      { path: 'attendance/students', element: <StudentAttendancePage /> },
      { path: 'attendance/teachers', element: <TeacherAttendancePage /> },
      { path: 'attendance/employees', element: <EmployeeAttendancePage /> },
      { path: 'attendance/reports', element: <PlaceholderPage /> },

      // Exams
      { path: 'exams', element: <ExamSetupPage /> },
      { path: 'exams/new', element: <PlaceholderPage /> },
      { path: 'exams/schedule', element: <ExamSchedulePage /> },
      { path: 'exams/marks', element: <MarksEntryPage /> },
      { path: 'exams/results', element: <PlaceholderPage /> },
      { path: 'exams/report-cards', element: <ReportCardPage /> },

      // Finance
      { path: 'finance/fee-structure', element: <FeeStructurePage /> },
      { path: 'finance/student-fees', element: <StudentFeesPage /> },
      { path: 'finance/history', element: <PaymentHistoryPage /> },
      { path: 'finance/receipts/:id', element: <FeeReceiptPage /> },
      { path: 'finance/payments', element: <PlaceholderPage /> },
      { path: 'finance/reports', element: <PlaceholderPage /> },
      { path: 'finance/refunds', element: <PlaceholderPage /> },

      // Payroll
      { path: 'payroll', element: <PlaceholderPage /> },
      { path: 'payroll/salary-structure', element: <PlaceholderPage /> },
      { path: 'payroll/process', element: <PlaceholderPage /> },
      { path: 'payroll/payslips', element: <PlaceholderPage /> },
      { path: 'payroll/reports', element: <PlaceholderPage /> },

      // Documents
      { path: 'documents/admit-cards', element: <PlaceholderPage /> },
      { path: 'documents/id-cards', element: <PlaceholderPage /> },
      { path: 'documents/certificates', element: <PlaceholderPage /> },

      // Reports
      { path: 'reports/students', element: <PlaceholderPage /> },
      { path: 'reports/attendance', element: <PlaceholderPage /> },
      { path: 'reports/academic', element: <PlaceholderPage /> },
      { path: 'reports/finance', element: <PlaceholderPage /> },
      { path: 'reports/payroll', element: <PlaceholderPage /> },

      // Settings
      { path: 'settings/school', element: <SchoolProfilePage /> },
      { path: 'settings/academic', element: <PlaceholderPage /> },
      { path: 'settings/fees', element: <PlaceholderPage /> },
      { path: 'settings/users', element: <PlaceholderPage /> },
      { path: 'settings/audit-logs', element: <PlaceholderPage /> },
      { path: 'settings/system', element: <PlaceholderPage /> },

      // Catch-all
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
