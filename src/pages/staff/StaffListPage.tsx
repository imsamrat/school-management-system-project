import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Download, Users, GraduationCap, Briefcase, Search } from 'lucide-react';
import { useGetStaffQuery } from '@/features/staff/staffApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { usePermission } from '@/hooks/usePermission';
import type { Staff } from '@/types/staff.types';

type ViewMode = 'all' | 'teacher' | 'employee';

const TABS: { key: ViewMode; label: string; icon: any; color: string }[] = [
  { key: 'all',      label: 'All Staff',   icon: Users,           color: 'text-gray-700 bg-gray-100' },
  { key: 'teacher',  label: 'Teachers',    icon: GraduationCap,   color: 'text-blue-700 bg-blue-100' },
  { key: 'employee', label: 'Employees',   icon: Briefcase,        color: 'text-purple-700 bg-purple-100' },
];

export default function StaffListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasPermission } = usePermission();

  const initialTab = (searchParams.get('role') as ViewMode) || 'all';
  const [activeTab, setActiveTab] = useState<ViewMode>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const queryRole = activeTab === 'all' ? undefined : activeTab;
  const { data: response, isLoading } = useGetStaffQuery({ role: queryRole, q: searchTerm || undefined });
  const staff = response?.data || [];

  const handleTabChange = (tab: ViewMode) => {
    setActiveTab(tab);
    setPage(1);
    if (tab === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ role: tab });
    }
  };

  const columns: Column<Staff>[] = [
    {
      header: 'Staff Member',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.photo_url ? (
            <img src={row.photo_url} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100" />
          ) : (
            <div className={`h-9 w-9 rounded-full flex items-center justify-center font-semibold text-sm
              ${row.is_teacher ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
              {row.first_name[0]}{row.last_name[0]}
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-900">{row.first_name} {row.last_name}</div>
            <div className="text-xs text-gray-500">{row.email || row.phone}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.is_teacher ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              <GraduationCap className="w-3 h-3" /> Teacher
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
              <Briefcase className="w-3 h-3" /> Employee
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'ID',
      cell: (row) => (
        <div>
          <div className="font-mono text-sm text-gray-700">{row.employee_id_code}</div>
          {row.is_teacher && row.teacher_id_code && (
            <div className="font-mono text-xs text-blue-600">{row.teacher_id_code}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Department / Designation',
      cell: (row) => (
        <div>
          <div className="text-sm font-medium text-gray-800">{row.department || '—'}</div>
          <div className="text-xs text-gray-500">{row.designation}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const counts = {
    all: staff.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Register</h1>
          <p className="text-sm text-gray-500 mt-1">Unified directory for all teaching and non-teaching staff</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="btn-secondary hidden sm:flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          {hasPermission('employees.create') && (
            <button
              onClick={() => navigate(activeTab === 'teacher' ? '/staff/new?role=teacher' : '/staff/new')}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'teacher' ? 'Add Teacher' : 'Add Staff'}
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all border-b-2 ${
                  isActive
                    ? 'border-primary-600 text-primary-700 bg-primary-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, ID..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={staff}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          onRowClick={(row) => navigate(`/staff/${row.id}`)}
          pagination={{
            page,
            limit: 20,
            total: staff.length,
            onPageChange: setPage,
          }}
        />
      </div>
    </div>
  );
}
