import { useState } from 'react';
import { useGetPayrollRecordsQuery } from '@/features/payroll/payrollApi';
import { useGetTeachersQuery } from '@/features/teachers/teacherApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import type { PayrollRecord } from '@/types/payroll.types';
import { Printer } from 'lucide-react';

export default function PayslipsPage() {
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const { data: payrollRes, isLoading } = useGetPayrollRecordsQuery({ month: selectedMonth });
  const { data: teachersRes } = useGetTeachersQuery({});

  const records = payrollRes?.data || [];
  const teachers = teachersRes?.data || [];

  const handlePrint = (record: PayrollRecord) => {
    // In a real app, open a new window or trigger a print dialog for the specific payslip
    window.print();
  };

  const columns: Column<PayrollRecord>[] = [
    { 
      header: 'Employee', 
      cell: row => {
        if (row.user_type === 'teacher') {
          const t = teachers.find(t => t.id === row.user_id);
          return t ? `${t.first_name} ${t.last_name}` : row.user_id;
        }
        return row.user_id;
      }
    },
    { header: 'Month', cell: row => row.month },
    { header: 'Base Salary', cell: row => `$${row.base_salary}` },
    { header: 'Net Salary', cell: row => <span className="font-bold text-gray-900">${row.net_salary}</span> },
    {
      header: 'Action',
      cell: row => (
        <button onClick={() => handlePrint(row)} className="text-primary-600 hover:text-primary-800 p-2 rounded-md hover:bg-primary-50">
          <Printer className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payslips</h1>
          <p className="text-sm text-gray-500">View and print employee payslips</p>
        </div>
        <input 
          type="month" 
          value={selectedMonth} 
          onChange={e => setSelectedMonth(e.target.value)} 
          className="input-field max-w-[200px]"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 print:hidden">
        <DataTable
          columns={columns}
          data={records}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
        />
      </div>
      
      {/* Print only section - just a placeholder, typically you'd render actual slips here and hide everything else */}
      <div className="hidden print:block text-center mt-20">
        <h1 className="text-3xl font-bold">Payslips generation placeholder</h1>
        <p>Please configure specific print styles to render individual slips.</p>
      </div>
    </div>
  );
}
