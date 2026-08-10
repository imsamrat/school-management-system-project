import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/features/auth/authSlice';
import { useLoginMutation } from '@/features/auth/authApi';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import type { User } from '@/types';

// Demo user for Phase 1 — will be replaced by actual Supabase auth
const DEMO_USER: User = {
  id: 'u0000000-0000-0000-0000-000000000001',
  schoolId: '550e8400-e29b-41d4-a716-446655440000',
  email: 'admin@greenvalley.edu',
  fullName: 'System Administrator',
  phone: '+880-1711111111',
  isActive: true,
  roles: [{ id: 'a0000000-0000-0000-0000-000000000001', name: 'Super Admin', isSystemRole: true }],
  permissions: [
    'dashboard.view', 'students.view', 'students.create', 'students.edit', 'students.delete',
    'teachers.view', 'teachers.create', 'teachers.edit',
    'employees.view', 'employees.create', 'employees.edit',
    'attendance.view', 'attendance.mark', 'attendance.edit',
    'exams.view', 'exams.create', 'exams.manage',
    'marks.view', 'marks.enter', 'marks.edit', 'marks.publish',
    'fees.view', 'fees.collect', 'fees.refund', 'fees.report',
    'payroll.view', 'payroll.process', 'payroll.approve',
    'reports.view', 'reports.export',
    'documents.manage', 'settings.manage', 'users.manage', 'audit.view',
    'admissions.view', 'admissions.manage', 'notifications.view',
  ],
};

export default function LoginPage() {
  const [email, setEmail] = useState('admin@greenvalley.edu');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginMutation({ email, password }).unwrap();
      if (response.success && response.data) {
        dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.token,
          })
        );
        navigate('/');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
      <p className="text-sm text-gray-500 mt-1">
        Sign in to your School ERP account
      </p>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="admin@greenvalley.edu"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-10"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              defaultChecked
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-2.5"
          id="login-button"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Sign in
            </span>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-2">Demo Credentials</p>
        <div className="space-y-1 text-xs text-gray-600">
          <p><span className="font-medium">Email:</span> admin@greenvalley.edu</p>
          <p><span className="font-medium">Password:</span> admin123</p>
        </div>
      </div>
    </div>
  );
}
