import { useGetPaymentsQuery } from '@/features/finance/financeApi';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { format } from 'date-fns';
import type { Payment } from '@/types/finance.types';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaymentHistoryPage() {
  const { data: response, isLoading } = useGetPaymentsQuery({});
  const { data: studentsRes } = useGetStudentsQuery({});
  const navigate = useNavigate();

  const payments = response?.data || [];
  const students = studentsRes?.data || [];

  const columns: Column<Payment>[] = [
    { 
      header: 'Date', 
      cell: row => format(new Date(row.payment_date), 'MMM dd, yyyy')
    },
    { 
      header: 'Student', 
      cell: row => {
        const s = students.find(s => s.id === row.student_id);
        return s ? `${s.first_name} ${s.last_name} (${s.admission_number})` : row.student_id;
      }
    },
    { 
      header: 'Amount', 
      cell: row => <span className="font-semibold text-green-600">${row.amount.toFixed(2)}</span>
    },
    { 
      header: 'Method', 
      cell: row => <span className="capitalize">{row.payment_method.replace('_', ' ')}</span>
    },
    { header: 'Ref/Txn', accessorKey: 'reference_number' },
    {
      header: 'Action',
      cell: row => (
        <button 
          onClick={() => navigate(`/finance/receipts/${row.id}`)}
          className="text-primary-600 hover:text-primary-800 p-1 rounded-full hover:bg-primary-50 transition-colors"
          title="View Receipt"
        >
          <FileText className="w-5 h-5" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <p className="text-sm text-gray-500">Log of all collected fees</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
      />
    </div>
  );
}
