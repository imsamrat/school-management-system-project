import { Router } from 'express';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import studentRoutes from './student.routes.js';
import teacherRoutes from './teacher.routes.js';
import employeeRoutes from './employee.routes.js';
import academicRoutes from './academic.routes.js';
import attendanceRoutes from './attendance.routes.js';
import examRoutes from './exam.routes.js';
import financeRoutes from './finance.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/employees', employeeRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/exams', examRoutes);
router.use('/finance', financeRoutes);
router.use('/', academicRoutes); // Mounted at root so /classes, /sections, /subjects work

// Optional: Health check could go here or in app.ts

export default router;
