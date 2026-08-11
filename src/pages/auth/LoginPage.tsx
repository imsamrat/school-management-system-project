import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Loader2, ShieldCheck, UserCheck, BookOpen, Users } from 'lucide-react';
import { useLoginMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';

type Role = 'admin' | 'teacher' | 'student' | 'parent';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@school.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<Role>('admin');
  const [error, setError] = useState('');
  
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setEmail(`${selectedRole}@school.com`);
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.data?.message || 'Failed to login');
    }
  };

  const roles = [
    { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'teacher', label: 'Teacher', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'student', label: 'Student', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'parent', label: 'Parent', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  ];

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-4 shadow-inner">
          <GraduationCap className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-500 font-medium">Please sign in to your account</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Select your role</label>
            <div className="grid grid-cols-4 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id as Role)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? `${r.border} ${r.bg} ring-2 ring-offset-1 shadow-sm` 
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? r.color : 'text-gray-400'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? r.color : 'text-gray-500'}`}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot password?
              </a>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
