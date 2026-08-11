import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

// ─────────────────────────────────────────────────
// GET ALL STAFF (teachers + non-teachers)
// GET /api/staff  or  /api/employees  or  /api/teachers
// Query param: ?role=teacher | ?role=employee | (none = all)
// ─────────────────────────────────────────────────
export const getStaff = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    const { q, role } = req.query;

    let query = supabaseAdmin
      .from('employees')
      .select('*')
      .eq('school_id', schoolId)
      .neq('status', 'terminated')
      .order('first_name', { ascending: true });

    // Filter by role
    if (role === 'teacher') {
      query = query.eq('is_teacher', true);
    } else if (role === 'employee') {
      query = query.eq('is_teacher', false);
    }

    // Search by name or ID
    if (q && typeof q === 'string') {
      query = query.or(
        `first_name.ilike.%${q}%,last_name.ilike.%${q}%,employee_id_code.ilike.%${q}%,teacher_id_code.ilike.%${q}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    return sendSuccess(res, data);
  } catch (err: any) {
    console.error('Error fetching staff:', err);
    return sendError(res, 'Failed to fetch staff', 500);
  }
};

// ─────────────────────────────────────────────────
// GET ONE STAFF MEMBER
// ─────────────────────────────────────────────────
export const getStaffById = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('employees')
      .select('*')
      .eq('school_id', schoolId)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return sendError(res, 'Staff member not found', 404);

    return sendSuccess(res, data);
  } catch (err: any) {
    console.error('Error fetching staff member:', err);
    return sendError(res, 'Failed to fetch staff details', 500);
  }
};

// ─────────────────────────────────────────────────
// CREATE STAFF (employee or teacher based on is_teacher flag)
// ─────────────────────────────────────────────────
export const createStaff = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    const { is_teacher, teacher_id_code, ...rest } = req.body;

    // Auto-generate employee_id_code if not provided
    const employee_id_code =
      rest.employee_id_code || `EMP-${Date.now().toString().slice(-6)}`;

    // Auto-generate teacher_id_code for teachers if not provided
    const resolvedTeacherCode = is_teacher
      ? teacher_id_code || `TCH-${Date.now().toString().slice(-6)}`
      : null;

    const newStaff = {
      ...rest,
      school_id: schoolId,
      employee_id_code,
      is_teacher: !!is_teacher,
      teacher_id_code: resolvedTeacherCode,
    };

    const { data, error } = await supabaseAdmin
      .from('employees')
      .insert(newStaff)
      .select()
      .single();

    if (error) throw error;

    const msg = is_teacher
      ? 'Teacher created successfully'
      : 'Employee created successfully';
    return sendSuccess(res, data, msg, 201);
  } catch (err: any) {
    console.error('Error creating staff:', err);
    return sendError(res, 'Failed to create staff member', 500);
  }
};

// ─────────────────────────────────────────────────
// UPDATE STAFF (also handles Promote to Teacher)
// ─────────────────────────────────────────────────
export const updateStaff = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const updates: Record<string, any> = { ...req.body };

    // If promoting to teacher and no teacher_id_code provided, auto-generate
    if (updates.is_teacher === true && !updates.teacher_id_code) {
      // Fetch current record to check if it already has a teacher_id_code
      const { data: current } = await supabaseAdmin
        .from('employees')
        .select('teacher_id_code')
        .eq('id', id)
        .single();

      if (!current?.teacher_id_code) {
        updates.teacher_id_code = `TCH-${Date.now().toString().slice(-6)}`;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('employees')
      .update(updates)
      .eq('school_id', schoolId)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Staff member updated successfully');
  } catch (err: any) {
    console.error('Error updating staff:', err);
    return sendError(res, 'Failed to update staff member', 500);
  }
};

// ─────────────────────────────────────────────────
// SOFT DELETE STAFF
// ─────────────────────────────────────────────────
export const deleteStaff = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('employees')
      .update({
        status: 'terminated',
        deleted_at: new Date().toISOString(),
      })
      .eq('school_id', schoolId)
      .eq('id', id);

    if (error) throw error;
    return sendSuccess(res, null, 'Staff member terminated successfully');
  } catch (err: any) {
    console.error('Error deleting staff:', err);
    return sendError(res, 'Failed to terminate staff member', 500);
  }
};

// ─────────────────────────────────────────────────
// PROMOTE EMPLOYEE TO TEACHER (convenience endpoint)
// PATCH /api/staff/:id/promote
// ─────────────────────────────────────────────────
export const promoteToTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;
    const { teacher_id_code, department, designation, qualification, specialization } = req.body;

    const { data: current } = await supabaseAdmin
      .from('employees')
      .select('teacher_id_code')
      .eq('id', id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('employees')
      .update({
        is_teacher: true,
        teacher_id_code:
          teacher_id_code ||
          current?.teacher_id_code ||
          `TCH-${Date.now().toString().slice(-6)}`,
        department,
        designation,
        qualification,
        specialization,
      })
      .eq('school_id', schoolId)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Employee promoted to teacher successfully');
  } catch (err: any) {
    console.error('Error promoting to teacher:', err);
    return sendError(res, 'Failed to promote employee', 500);
  }
};

// ─────────────────────────────────────────────────
// DEMOTE TEACHER TO REGULAR EMPLOYEE
// PATCH /api/staff/:id/demote
// ─────────────────────────────────────────────────
export const demoteFromTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('employees')
      .update({ is_teacher: false, teacher_id_code: null })
      .eq('school_id', schoolId)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Teacher demoted to employee');
  } catch (err: any) {
    return sendError(res, 'Failed to demote teacher', 500);
  }
};

// ─────────────────────────────────────────────────
// Legacy aliases — keep /api/teachers and /api/employees working
// These just call getStaff with the appropriate role filter
// ─────────────────────────────────────────────────
export const getTeachers = (req: AuthRequest, res: Response) => {
  req.query.role = 'teacher';
  return getStaff(req, res);
};

export const getTeacherById = getStaffById;
export const createTeacher = (req: AuthRequest, res: Response) => {
  req.body.is_teacher = true;
  return createStaff(req, res);
};
export const updateTeacher = updateStaff;
export const deleteTeacher = deleteStaff;

export const getEmployees = (req: AuthRequest, res: Response) => {
  req.query.role = 'employee';
  return getStaff(req, res);
};
export const getEmployeeById = getStaffById;
export const createEmployee = createStaff;
export const updateEmployee = updateStaff;
export const deleteEmployee = deleteStaff;
