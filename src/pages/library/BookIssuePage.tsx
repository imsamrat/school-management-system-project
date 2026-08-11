import { useState } from 'react';
import { useGetBooksQuery, useGetIssuesQuery, useIssueBookMutation } from '@/features/library/libraryApi';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import { useGetTeachersQuery } from '@/features/teachers/teacherApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { format } from 'date-fns';
import type { BookIssue } from '@/types/library.types';
import StatusBadge from '@/components/common/StatusBadge';

export default function BookIssuePage() {
  const { data: booksRes } = useGetBooksQuery();
  const { data: issuesRes, isLoading } = useGetIssuesQuery({ status: 'issued' });
  const { data: studentsRes } = useGetStudentsQuery({});
  const { data: teachersRes } = useGetTeachersQuery({});
  
  const [issueBook, { isLoading: isIssuing }] = useIssueBookMutation();

  const books = booksRes?.data || [];
  const issues = issuesRes?.data || [];
  const students = studentsRes?.data || [];
  const teachers = teachersRes?.data || [];

  const [isAdding, setIsAdding] = useState(false);
  const [issueData, setIssueData] = useState({
    book_id: '',
    user_type: 'student' as 'student' | 'teacher',
    user_id: '',
    due_date: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  });

  const handleIssue = async () => {
    if (!issueData.book_id || !issueData.user_id) return;
    try {
      await issueBook(issueData).unwrap();
      setIsAdding(false);
      setIssueData({ ...issueData, book_id: '', user_id: '' });
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
    { header: 'Issue Date', cell: row => format(new Date(row.issue_date), 'MMM dd, yyyy') },
    { header: 'Due Date', cell: row => format(new Date(row.due_date), 'MMM dd, yyyy') },
    { header: 'Status', cell: row => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issue Books</h1>
          <p className="text-sm text-gray-500">Check out books to students or teachers</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary">
          Issue New Book
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label">Book</label>
              <select 
                value={issueData.book_id} 
                onChange={e => setIssueData({...issueData, book_id: e.target.value})} 
                className="input-field"
              >
                <option value="">Select Book...</option>
                {books.filter(b => b.available_quantity > 0).map(b => (
                  <option key={b.id} value={b.id}>{b.title} (Available: {b.available_quantity})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">User Type</label>
              <select 
                value={issueData.user_type} 
                onChange={e => setIssueData({...issueData, user_type: e.target.value as 'student'|'teacher', user_id: ''})} 
                className="input-field"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div>
              <label className="label">{issueData.user_type === 'student' ? 'Student' : 'Teacher'}</label>
              <select 
                value={issueData.user_id} 
                onChange={e => setIssueData({...issueData, user_id: e.target.value})} 
                className="input-field"
              >
                <option value="">Select...</option>
                {issueData.user_type === 'student' 
                  ? students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.admission_number})</option>)
                  : teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)
                }
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input 
                type="date" 
                value={issueData.due_date} 
                onChange={e => setIssueData({...issueData, due_date: e.target.value})} 
                className="input-field"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleIssue} disabled={isIssuing || !issueData.book_id || !issueData.user_id} className="btn-primary">Confirm Issue</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Currently Issued Books</h2>
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
