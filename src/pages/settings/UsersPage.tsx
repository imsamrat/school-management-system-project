import { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, Key, Mail } from 'lucide-react';
import { DataTable, type Column } from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  last_login: string;
}

const mockUsers: User[] = [
  { id: 'u1', full_name: 'System Administrator', email: 'admin@school.com', role: 'Super Admin', status: 'active', last_login: '2026-08-11T04:00:00Z' },
  { id: 'u2', full_name: 'John Doe', email: 'teacher@school.com', role: 'Teacher', status: 'active', last_login: '2026-08-10T15:30:00Z' },
  { id: 'u3', full_name: 'Jane Smith', email: 'accountant@school.com', role: 'Accountant', status: 'active', last_login: '2026-08-10T10:00:00Z' },
  { id: 'u4', full_name: 'Bob Wilson', email: 'librarian@school.com', role: 'Librarian', status: 'inactive', last_login: '2026-07-20T09:00:00Z' },
];

const ROLES = ['Super Admin', 'Principal', 'Teacher', 'Accountant', 'Librarian', 'HR', 'Parent', 'Student'];

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-red-100 text-red-800',
  'Principal': 'bg-purple-100 text-purple-800',
  'Teacher': 'bg-blue-100 text-blue-800',
  'Accountant': 'bg-green-100 text-green-800',
  'Librarian': 'bg-yellow-100 text-yellow-800',
  'HR': 'bg-orange-100 text-orange-800',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', role: 'Teacher' });

  const handleAdd = () => {
    if (!form.full_name || !form.email) return;
    const newUser: User = {
      id: `u${users.length + 1}`,
      ...form,
      status: 'active',
      last_login: 'Never',
    };
    setUsers([newUser, ...users]);
    setIsAdding(false);
    setForm({ full_name: '', email: '', role: 'Teacher' });
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const formatLastLogin = (ts: string) => {
    if (ts === 'Never') return 'Never';
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return ts;
    }
  };

  const columns: Column<User>[] = [
    {
      header: 'User',
      cell: row => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-sm">
            {row.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.full_name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      cell: row => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${roleColors[row.role] || 'bg-gray-100 text-gray-700'}`}>
          {row.role}
        </span>
      )
    },
    { header: 'Status', cell: row => <StatusBadge status={row.status} /> },
    { header: 'Last Login', cell: row => <span className="text-sm text-gray-500">{formatLastLogin(row.last_login)}</span> },
    {
      header: 'Actions',
      cell: row => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleStatus(row.id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              row.status === 'active'
                ? 'text-red-600 border-red-200 hover:bg-red-50'
                : 'text-green-600 border-green-200 hover:bg-green-50'
            }`}
          >
            {row.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
          <button title="Reset Password" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Key className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} title="Delete User" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Manage system users and their access roles</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: 'text-gray-900' },
          { label: 'Active', value: users.filter(u => u.status === 'active').length, color: 'text-green-600' },
          { label: 'Inactive', value: users.filter(u => u.status === 'inactive').length, color: 'text-red-600' },
          { label: 'Roles', value: new Set(users.map(u => u.role)).size, color: 'text-blue-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Add New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="label">Email Address *</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="john@school.com" />
            </div>
            <div>
              <label className="label">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAdd} className="btn-primary">
              <Mail className="w-4 h-4 mr-2" /> Send Invite
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={users}
          keyExtractor={row => row.id}
          isLoading={false}
        />
      </div>
    </div>
  );
}
