import { useState } from 'react';
import { DataTable, type Column } from '@/components/common/DataTable';
import { Shield, User, Key, FileText, Settings, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  details: string;
  ip_address: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view';
}

const mockLogs: AuditLog[] = [
  { id: 'l1', user: 'System Administrator', action: 'User Login', module: 'Auth', details: 'Successful login', ip_address: '192.168.1.1', timestamp: new Date(Date.now() - 60000).toISOString(), type: 'login' },
  { id: 'l2', user: 'System Administrator', action: 'Student Created', module: 'Students', details: 'Created student: Samrat Ahmed (STU-001)', ip_address: '192.168.1.1', timestamp: new Date(Date.now() - 180000).toISOString(), type: 'create' },
  { id: 'l3', user: 'John Doe (Teacher)', action: 'Attendance Marked', module: 'Attendance', details: 'Marked attendance for Class 10 on 2026-08-11', ip_address: '192.168.1.45', timestamp: new Date(Date.now() - 900000).toISOString(), type: 'update' },
  { id: 'l4', user: 'System Administrator', action: 'Fee Collected', module: 'Finance', details: 'Collected $500 for Tuition Fee (INV-0012)', ip_address: '192.168.1.1', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'create' },
  { id: 'l5', user: 'Jane Smith (Accountant)', action: 'Book Issued', module: 'Library', details: 'Issued "The Great Gatsby" to STU-002', ip_address: '192.168.1.22', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'create' },
  { id: 'l6', user: 'System Administrator', action: 'School Profile Updated', module: 'Settings', details: 'Updated school name and contact info', ip_address: '192.168.1.1', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'update' },
  { id: 'l7', user: 'Bob Wilson (Librarian)', action: 'User Login', module: 'Auth', details: 'Successful login', ip_address: '192.168.1.88', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'login' },
  { id: 'l8', user: 'System Administrator', action: 'Payroll Processed', module: 'Payroll', details: 'Processed August 2026 payroll for 15 employees', ip_address: '192.168.1.1', timestamp: new Date(Date.now() - 259200000).toISOString(), type: 'update' },
];

const typeConfig: Record<string, { color: string; bg: string; icon: any }> = {
  create: { color: 'text-green-700', bg: 'bg-green-100', icon: FileText },
  update: { color: 'text-blue-700', bg: 'bg-blue-100', icon: Settings },
  delete: { color: 'text-red-700', bg: 'bg-red-100', icon: FileText },
  login: { color: 'text-purple-700', bg: 'bg-purple-100', icon: Key },
  logout: { color: 'text-orange-700', bg: 'bg-orange-100', icon: Key },
  view: { color: 'text-gray-700', bg: 'bg-gray-100', icon: Eye },
};

export default function AuditLogsPage() {
  const [filterModule, setFilterModule] = useState('');
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');

  const modules = [...new Set(mockLogs.map(l => l.module))];
  const types = [...new Set(mockLogs.map(l => l.type))];

  const filteredLogs = mockLogs.filter(log => {
    const moduleMatch = !filterModule || log.module === filterModule;
    const typeMatch = !filterType || log.type === filterType;
    const searchMatch = !search || log.user.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase());
    return moduleMatch && typeMatch && searchMatch;
  });

  const columns: Column<AuditLog>[] = [
    {
      header: 'Action',
      cell: row => {
        const cfg = typeConfig[row.type] || typeConfig.view;
        const Icon = cfg.icon;
        return (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${cfg.bg}`}>
              <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{row.action}</p>
              <p className="text-xs text-gray-500">{row.module}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'User',
      cell: row => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-gray-500" />
          </div>
          <span className="text-sm text-gray-700">{row.user}</span>
        </div>
      )
    },
    { header: 'Details', cell: row => <span className="text-sm text-gray-600 max-w-xs truncate block">{row.details}</span> },
    { header: 'IP Address', cell: row => <span className="text-xs font-mono text-gray-500">{row.ip_address}</span> },
    {
      header: 'Time',
      cell: row => (
        <div>
          <p className="text-xs font-medium text-gray-700">{format(new Date(row.timestamp), 'MMM dd, yyyy')}</p>
          <p className="text-xs text-gray-400">{format(new Date(row.timestamp), 'HH:mm:ss')}</p>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500">Track all user activities and system changes for compliance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Read-only — {filteredLogs.length} events</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="label">Search</label>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input-field" placeholder="Search by user or action..." />
        </div>
        <div className="min-w-[160px]">
          <label className="label">Module</label>
          <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="input-field">
            <option value="">All Modules</option>
            {modules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="min-w-[160px]">
          <label className="label">Action Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input-field">
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={filteredLogs}
          keyExtractor={row => row.id}
          isLoading={false}
        />
      </div>
    </div>
  );
}
