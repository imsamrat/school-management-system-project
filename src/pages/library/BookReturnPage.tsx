import { useState } from 'react';
import { useGetBooksQuery, useGetIssuesQuery, useReturnBookMutation } from '@/features/library/libraryApi';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import { useGetTeachersQuery } from '@/features/teachers/teacherApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { format, differenceInDays } from 'date-fns';
import type { BookIssue } from '@/types/library.types';
import StatusBadge from '@/components/common/StatusBadge';

export default function BookReturnPage() {
  const { data: booksRes } = useGetBooksQuery();
  const { data: issuesRes, isLoading } = useGetIssuesQuery({ status: 'issued' });
  const { data: studentsRes } = useGetStudentsQuery({});
  const { data: teachersRes } = useGetTeachersQuery({});
  
  const [returnBook, { isLoading: isReturning }] = useReturnBookMutation();

  const books = booksRes?.data || [];
  const issues = issuesRes?.data || [];
  const students = studentsRes?.data || [];
  const teachers = teachersRes?.data || [];

  const [selectedIssue, setSelectedIssue] = useState<BookIssue | null>(null);
  const [penaltyAmount, setPenaltyAmount] = useState(0);

  const calculatePenalty = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = differenceInDays(today, due);
    // e.g. $1 per day late
    return diff > 0 ? diff * 1 : 0;
  };

  const handleSelectIssue = (issue: BookIssue) => {
    setSelectedIssue(issue);
    setPenaltyAmount(calculatePenalty(issue.due_date));
  };

  const handleReturn = async () => {
    if (!selectedIssue) return;
    try {
      await returnBook({ id: selectedIssue.id, penalty_amount: penaltyAmount }).unwrap();
      setSelectedIssue(null);
      setPenaltyAmount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<BookIssue>[] = [
    { 
      header: 'Book', 
      cell: row => <span className="font-semibold text-gray-900">{books.find(b => b.id === row.book_id)?.title || row.book_id}</span> 
    },
    { 
      header: 'Issued To', 
      cell: row => {
        if (row.user_type === 'student') {
          const s = students.find(s => s.id === row.user_id);
          return s ? `${s.first_name} ${s.last_name} (Student)` : row.user_id;
        } else {
          const t = teachers.find(t => t.id === row.user_id);
          return t ? `${t.first_name} ${t.last_name} (Teacher)` : row.user_id;
        }
      }
    },
    { header: 'Due Date', cell: row => format(new Date(row.due_date), 'MMM dd, yyyy') },
    { 
      header: 'Penalty', 
      cell: row => {
        const pen = calculatePenalty(row.due_date);
        return pen > 0 ? <span className="text-red-600 font-semibold">${pen}</span> : <span className="text-green-600">None</span>;
      }
    },
    {
      header: 'Action',
      cell: row => (
        <button onClick={() => handleSelectIssue(row)} className="text-primary-600 hover:text-primary-800 font-medium bg-primary-50 px-3 py-1 rounded-md">
          Process Return
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Return Books</h1>
        <p className="text-sm text-gray-500">Process returned books and collect late penalties</p>
      </div>

      {selectedIssue && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-lg">Process Return</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-xs text-gray-500 uppercase">Book</p>
              <p className="font-medium">{books.find(b => b.id === selectedIssue.book_id)?.title}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Due Date</p>
              <p className="font-medium">{format(new Date(selectedIssue.due_date), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase block mb-1">Penalty Amount ($)</label>
              <input 
                type="number" 
                value={penaltyAmount} 
                onChange={e => setPenaltyAmount(Number(e.target.value))} 
                className="input-field py-1"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setSelectedIssue(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleReturn} disabled={isReturning} className="btn-primary">Confirm Return</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Pending Returns</h2>
        </div>
        <DataTable
          columns={columns}
          data={issues}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
