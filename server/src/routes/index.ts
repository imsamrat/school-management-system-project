import { Router } from 'express';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import studentRoutes from './student.routes.js';
import teacherRoutes from './teacher.routes.js';
import employeeRoutes from './employee.routes.js';
import staffRoutes from './staff.routes.js';
import academicRoutes from './academic.routes.js';
import attendanceRoutes from './attendance.routes.js';
import examRoutes from './exam.routes.js';
import financeRoutes from './finance.routes.js';
import libraryRoutes from './library.routes.js';
import payrollRoutes from './payroll.routes.js';
import settingsRoutes from './settings.routes.js';
import admissionsRoutes from './admissions.routes.js';
import documentsRoutes from './documents.routes.js';
import reportsRoutes from './reports.routes.js';
import notificationsRoutes from './notifications.routes.js';
import searchRoutes from './search.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admissions', admissionsRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/employees', employeeRoutes);
router.use('/staff', staffRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/exams', examRoutes);
router.use('/finance', financeRoutes);
router.use('/library', libraryRoutes);
router.use('/payroll', payrollRoutes);
router.use('/documents', documentsRoutes);
router.use('/reports', reportsRoutes);
router.use('/settings', settingsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/search', searchRoutes);
router.use('/', academicRoutes); // Mounted at root so /classes, /sections, /subjects work

// Optional: Health check could go here or in app.ts

export default router;
