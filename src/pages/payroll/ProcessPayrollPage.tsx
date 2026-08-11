import { useState } from 'react';
import { useGetPayrollRecordsQuery, useProcessPayrollMutation } from '@/features/payroll/payrollApi';
import { useGetTeachersQuery } from '@/features/teachers/teacherApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import type { PayrollRecord } from '@/types/payroll.types';

export default function ProcessPayrollPage() {
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const { data: payrollRes, isLoading } = useGetPayrollRecordsQuery({ month: selectedMonth });
  const { data: teachersRes } = useGetTeachersQuery({});
  const [processPayroll, { isLoading: isProcessing }] = useProcessPayrollMutation();

  const records = payrollRes?.data || [];
  const teachers = teachersRes?.data || [];

  const handleProcess = async () => {
    try {
      await processPayroll({ month: selectedMonth }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<PayrollRecord>[] = [
    { 
      header: 'Employee', 
      cell: row => {
        if (row.user_type === 'teacher') {
          const t = teachers.find(t => t.id === row.user_id);
          return t ? `${t.first_name} ${t.last_name} (Teacher)` : row.user_id;
        }
        return row.user_id;
      }
    },
    { header: 'Month', cell: row => <span className="font-medium text-gray-700">{row.month}</span> },
    { header: 'Net Salary', cell: row => <span className="font-bold text-gray-900">${row.net_salary}</span> },
    { header: 'Payment Date', cell: row => <span className="text-sm text-gray-600">{row.payment_date || 'Pending'}</span> },
    { header: 'Status', cell: row => <StatusBadge status={row.status} /> },
  ];

  const totalProcessed = records.reduce((acc, curr) => acc + curr.net_salary, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Process Payroll</h1>
          <p className="text-sm text-gray-500">Generate salaries for a specific month</p>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(e.target.value)} 
            className="input-field max-w-[200px]"
          />
          <button onClick={handleProcess} disabled={isProcessing} className="btn-primary">
            {isProcessing ? 'Processing...' : 'Run Payroll'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Payout ({selectedMonth})</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${totalProcessed.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Employees Processed</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{records.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Payroll Records for {selectedMonth}</h2>
        </div>
        <DataTable
          columns={columns}
          data={records}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
