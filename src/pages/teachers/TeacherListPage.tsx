import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download } from 'lucide-react';
import { useGetTeachersQuery } from '@/features/teachers/teacherApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { SearchInput } from '@/components/common/SearchInput';
import StatusBadge from '@/components/common/StatusBadge';
import { usePermission } from '@/hooks/usePermission';
import type { Teacher } from '@/types/teacher.types';

export default function TeacherListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const { data: response, isLoading } = useGetTeachersQuery({ q: searchTerm });
  const teachers = response?.data || [];

  const columns: Column<Teacher>[] = [
    {
      header: 'Teacher ID',
      accessorKey: 'teacher_id_code',
      sortable: true,
      className: 'font-medium text-gray-900',
    },
    {
      header: 'Teacher Name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xs">
            {row.first_name[0]}{row.last_name[0]}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.first_name} {row.last_name}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'department',
      cell: (row) => <span className="text-gray-600">{row.department}</span>,
    },
    {
      header: 'Designation',
      accessorKey: 'designation',
      cell: (row) => <span className="text-gray-600">{row.designation}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Teachers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage teaching staff directory</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="btn-secondary hidden sm:flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          {hasPermission('teachers.create') && (
            <button 
              onClick={() => navigate('/teachers/new')}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Teacher
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name or ID..."
          className="w-full sm:max-w-md"
        />
      </div>

      <DataTable
        columns={columns}
        data={teachers}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/teachers/${row.id}`)}
        pagination={{
          page,
          limit: 20,
          total: teachers.length,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
