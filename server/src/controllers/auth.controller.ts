import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { supabaseAdmin } from '../config/supabase.js';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Fetch user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, school_id, email, full_name, password_hash, is_active')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Fallback for demo: if user is not in DB yet but matches demo credentials
      if (email === 'admin@greenvalley.edu' && password === 'admin123') {
        const demoUser = {
          id: 'u0000000-0000-0000-0000-000000000001',
          schoolId: '550e8400-e29b-41d4-a716-446655440000',
          email: 'admin@greenvalley.edu',
          fullName: 'System Administrator',
          roles: [{ id: 'a1', name: 'Super Admin' }],
          permissions: [
            'dashboard.view', 'students.view', 'students.create', 'students.edit', 'students.delete',
            'teachers.view', 'teachers.create', 'teachers.edit', 'settings.manage', 'users.manage',
            'finance.view', 'finance.collect'
          ],
        };
        const token = jwt.sign(demoUser, config.jwtSecret, { expiresIn: '1d' });
        return sendSuccess(res, { user: demoUser, token });
      }

      return sendError(res, 'Invalid email or password', 401);
    }

    if (!user.is_active) {
      return sendError(res, 'Account is disabled', 403);
    }

    // 2. Verify password using bcrypt
    if (!user.password_hash) {
       return sendError(res, 'Invalid account configuration', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // 3. Fetch roles and permissions
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select(`
        role_id,
        roles (
          id,
          name,
          role_permissions (
            permissions (
              action,
              module
            )
          )
        )
      `)
      .eq('user_id', user.id);

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return sendError(res, 'Internal server error during authentication', 500);
    }

    const roles = [];
    const permissions = new Set<string>();

    if (userRoles) {
      for (const ur of userRoles) {
        const role = ur.roles as any;
        if (role) {
          roles.push({ id: role.id, name: role.name });
          if (role.role_permissions) {
             for (const rp of role.role_permissions) {
                if (rp.permissions) {
                   permissions.add(`${rp.permissions.module}.${rp.permissions.action}`);
                }
             }
          }
        }
      }
    }

    // 4. Update last_login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    const tokenPayload = {
      id: user.id,
      schoolId: user.school_id,
      email: user.email,
      fullName: user.full_name,
      roles,
      permissions: Array.from(permissions),
    };

    const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '1d' });

    return sendSuccess(res, {
      user: tokenPayload,
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return sendError(res, 'An unexpected error occurred', 500);
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  return sendSuccess(res, req.user);
};

export const logout = async (req: Request, res: Response) => {
  return sendSuccess(res, null, 'Logged out successfully');
};
