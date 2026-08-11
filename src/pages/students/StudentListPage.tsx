import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download } from 'lucide-react';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { SearchInput } from '@/components/common/SearchInput';
import StatusBadge from '@/components/common/StatusBadge';
import { usePermission } from '@/hooks/usePermission';
import type { Student } from '@/types/student.types';

export default function StudentListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const { data: response, isLoading } = useGetStudentsQuery({ q: searchTerm });
  const students = response?.data || [];

  const columns: Column<Student>[] = [
    {
      header: 'Admission No',
      accessorKey: 'admission_number',
      sortable: true,
      className: 'font-medium text-gray-900',
    },
    {
      header: 'Student Name',
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
      header: 'Class/Section',
      cell: (row) => (
        <span className="text-gray-600">
          {/* Note: in a real app, join with class/section data */}
          {row.class_id} - {row.section_id} (Roll: {row.roll_number})
        </span>
      ),
    },
    {
      header: 'Gender',
      accessorKey: 'gender',
      cell: (row) => <span className="capitalize text-gray-600">{row.gender}</span>,
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Students</h1>
          <p className="text-sm text-gray-500 mt-1">Manage student records and admissions</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="btn-secondary hidden sm:flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name or ID..."
          className="w-full sm:max-w-md"
        />
        <div className="flex items-center gap-3 w-full sm:w-auto">
           {/* Additional filters can go here */}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={students}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/students/${row.id}`)}
        pagination={{
          page,
          limit: 20,
          total: students.length, // Mock total
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
