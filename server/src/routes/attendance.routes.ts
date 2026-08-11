import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as attendanceController from '../controllers/attendance.controller.js';

const router = Router();

router.use(authenticate);

// Student Attendance
router.get('/students', requirePermission('attendance.view'), attendanceController.getStudentAttendance);
router.get('/students/:id', requirePermission('attendance.view'), attendanceController.getSingleStudentAttendance);
router.post('/students', requirePermission('attendance.mark'), attendanceController.markStudentAttendance);

// Teacher Attendance
router.get('/teachers', requirePermission('attendance.view'), attendanceController.getTeacherAttendance);
router.post('/teachers', requirePermission('attendance.mark'), attendanceController.markTeacherAttendance);

// Employee Attendance
router.get('/employees', requirePermission('attendance.view'), attendanceController.getEmployeeAttendance);
router.post('/employees', requirePermission('attendance.mark'), attendanceController.markEmployeeAttendance);

export default router;
