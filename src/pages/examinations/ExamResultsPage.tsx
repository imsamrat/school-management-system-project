import { useState } from 'react';
import { useGetExamsQuery } from '@/features/exams/examApi';
import { useGetClassesQuery } from '@/features/academics/academicApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import type { Exam } from '@/types/exam.types';

interface Result {
  id: string;
  student_name: string;
  exam: string;
  class: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  status: 'Pass' | 'Fail';
}

// Mock results data
const mockResults: Result[] = [
  { id: 'r1', student_name: 'Samrat Ahmed', exam: 'Mid Term 2026', class: 'Class 10', total_marks: 500, obtained_marks: 435, percentage: 87, grade: 'A+', status: 'Pass' },
  { id: 'r2', student_name: 'Alice Johnson', exam: 'Mid Term 2026', class: 'Class 9', total_marks: 500, obtained_marks: 390, percentage: 78, grade: 'A', status: 'Pass' },
  { id: 'r3', student_name: 'Bob Williams', exam: 'Mid Term 2026', class: 'Class 10', total_marks: 500, obtained_marks: 320, percentage: 64, grade: 'B', status: 'Pass' },
  { id: 'r4', student_name: 'Carol Davis', exam: 'Mid Term 2026', class: 'Class 8', total_marks: 500, obtained_marks: 215, percentage: 43, grade: 'F', status: 'Fail' },
  { id: 'r5', student_name: 'David Lee', exam: 'Mid Term 2026', class: 'Class 9', total_marks: 500, obtained_marks: 460, percentage: 92, grade: 'A+', status: 'Pass' },
];

const gradeColors: Record<string, string> = {
  'A+': 'bg-green-100 text-green-800',
  'A': 'bg-blue-100 text-blue-800',
  'B': 'bg-yellow-100 text-yellow-800',
  'C': 'bg-orange-100 text-orange-800',
  'F': 'bg-red-100 text-red-800',
};

export default function ExamResultsPage() {
  const { data: examsRes } = useGetExamsQuery();
  const { data: classesRes } = useGetClassesQuery();
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const exams = examsRes?.data || [];
  const classes = classesRes?.data || [];

  const filteredResults = mockResults.filter(r => {
    const examMatch = !selectedExam || r.exam === exams.find(e => e.id === selectedExam)?.name;
    const classMatch = !selectedClass || r.class === classes.find(c => c.id === selectedClass)?.name;
    return examMatch && classMatch;
  });

  const passCount = filteredResults.filter(r => r.status === 'Pass').length;
  const failCount = filteredResults.filter(r => r.status === 'Fail').length;
  const avgPercentage = filteredResults.length > 0
    ? (filteredResults.reduce((acc, r) => acc + r.percentage, 0) / filteredResults.length).toFixed(1)
    : '0';

  const columns: Column<Result>[] = [
    { header: 'Student Name', cell: row => <span className="font-semibold text-gray-900">{row.student_name}</span> },
    { header: 'Exam', accessorKey: 'exam' },
    { header: 'Class', accessorKey: 'class' },
    { header: 'Total Marks', cell: row => <span className="font-medium">{row.total_marks}</span> },
    { header: 'Obtained', cell: row => <span className="font-bold text-gray-900">{row.obtained_marks}</span> },
    { header: 'Percentage', cell: row => (
      <div className="flex items-center gap-2">
        <div className="w-20 bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${row.percentage >= 80 ? 'bg-green-500' : row.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${row.percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium">{row.percentage}%</span>
      </div>
    )},
    { header: 'Grade', cell: row => (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeColors[row.grade] || 'bg-gray-100 text-gray-800'}`}>
        {row.grade}
      </span>
    )},
    { header: 'Status', cell: row => (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${row.status === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {row.status}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
        <p className="text-sm text-gray-500">View student performance across all examinations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Students</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{filteredResults.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Pass</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{passCount}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Fail</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{failCount}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Class Average</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{avgPercentage}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="label">Filter by Exam</label>
          <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)} className="input-field">
            <option value="">All Exams</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="label">Filter by Class</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="input-field">
            <option value="">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={filteredResults}
          keyExtractor={(row) => row.id}
          isLoading={false}
        />
      </div>
    </div>
  );
}
