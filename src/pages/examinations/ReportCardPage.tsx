import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { useGetExamsQuery, useGetMarksQuery } from '@/features/exams/examApi';
import { useGetClassesQuery, useGetSubjectsQuery } from '@/features/academics/academicApi';
import { useGetStudentsQuery } from '@/features/students/studentApi';

export default function ReportCardPage() {
  const [examId, setExamId] = useState('');
  const [classId, setClassId] = useState('');
  const [studentId, setStudentId] = useState('');
  
  const { data: examsRes } = useGetExamsQuery();
  const { data: classesRes } = useGetClassesQuery();
  const { data: subjectsRes } = useGetSubjectsQuery();
  const { data: studentsRes } = useGetStudentsQuery({}); // normally filtered by class
  // For the report card, we fetch ALL marks for the student for this exam (no subject filter)
  const { data: marksRes, isLoading } = useGetMarksQuery({ exam_id: examId, subject_id: '', student_id: studentId }, { skip: !examId || !studentId });

  const exams = examsRes?.data || [];
  const classes = classesRes?.data || [];
  const subjects = subjectsRes?.data || [];
  const students = (studentsRes?.data || []).filter(s => s.class_id === classId);
  
  const marks = marksRes?.data || [];
  const selectedStudent = students.find(s => s.id === studentId);
  const selectedExam = exams.find(e => e.id === examId);

  const totalMarksObtained = marks.reduce((sum, m) => sum + m.marks_obtained, 0);
  const totalPossible = marks.length * 100; // assuming 100 per subject
  const percentage = totalPossible > 0 ? ((totalMarksObtained / totalPossible) * 100).toFixed(2) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Cards</h1>
          <p className="text-sm text-gray-500">Generate and print student report cards</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end print:hidden">
        <div className="w-48">
          <label className="label">Exam</label>
          <select value={examId} onChange={e => { setExamId(e.target.value); setStudentId(''); }} className="input-field">
            <option value="">Select Exam...</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="w-48">
          <label className="label">Class</label>
          <select value={classId} onChange={e => { setClassId(e.target.value); setStudentId(''); }} className="input-field" disabled={!examId}>
            <option value="">Select Class...</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="w-64">
          <label className="label">Student</label>
          <select value={studentId} onChange={e => setStudentId(e.target.value)} className="input-field" disabled={!classId}>
            <option value="">Select Student...</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
          </select>
        </div>
        {studentId && (
          <button onClick={handlePrint} className="btn-primary flex items-center gap-2 ml-auto">
            <Download className="w-4 h-4" /> Print PDF
          </button>
        )}
      </div>

      {isLoading && <div className="text-center py-10 text-gray-500">Loading report card data...</div>}

      {studentId && selectedStudent && !isLoading && (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 max-w-3xl mx-auto print:shadow-none print:border-none print:p-0">
          {/* Header */}
          <div className="text-center border-b-2 border-primary-600 pb-6 mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                <FileText className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Green Valley School</h2>
            <p className="text-gray-500 mt-1">123 Education Lane, Learning City, 12345</p>
            <h3 className="text-xl font-semibold text-primary-700 mt-4 uppercase tracking-widest">{selectedExam?.name} Report Card</h3>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Student Name</p>
              <p className="font-semibold text-gray-900">{selectedStudent.first_name} {selectedStudent.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Admission No</p>
              <p className="font-semibold text-gray-900">{selectedStudent.admission_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Class & Roll No</p>
              <p className="font-semibold text-gray-900">{classes.find(c => c.id === selectedStudent.class_id)?.name} - {selectedStudent.roll_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-semibold text-gray-900">Oct 12, 2012</p>
            </div>
          </div>

          {/* Marks Table */}
          <table className="w-full text-left mb-8 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border border-gray-300 font-semibold text-gray-700">Subject</th>
                <th className="p-3 border border-gray-300 font-semibold text-gray-700 text-center">Marks Obtained</th>
                <th className="p-3 border border-gray-300 font-semibold text-gray-700 text-center">Grade</th>
                <th className="p-3 border border-gray-300 font-semibold text-gray-700 text-center">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {marks.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500 border border-gray-300">No marks entered for this exam yet.</td></tr>
              ) : (
                marks.map(mark => (
                  <tr key={mark.id}>
                    <td className="p-3 border border-gray-300 font-medium">{subjects.find(s => s.id === mark.subject_id)?.name}</td>
                    <td className="p-3 border border-gray-300 text-center">{mark.marks_obtained}</td>
                    <td className="p-3 border border-gray-300 text-center font-bold text-primary-600">{mark.grade}</td>
                    <td className="p-3 border border-gray-300 text-center text-gray-500 text-sm">{mark.remarks || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Summary */}
          {marks.length > 0 && (
            <div className="flex justify-end mb-12">
              <div className="bg-primary-50 p-6 rounded-lg w-72">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 font-medium">Total Marks:</span>
                  <span className="font-bold text-gray-900">{totalMarksObtained} / {totalPossible}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Percentage:</span>
                  <span className="font-bold text-primary-700 text-xl">{percentage}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="border-b border-gray-400 mb-2 h-8"></div>
              <p className="text-sm font-medium text-gray-600">Class Teacher</p>
            </div>
            <div className="text-center">
              <div className="border-b border-gray-400 mb-2 h-8"></div>
              <p className="text-sm font-medium text-gray-600">Principal</p>
            </div>
            <div className="text-center">
              <div className="border-b border-gray-400 mb-2 h-8"></div>
              <p className="text-sm font-medium text-gray-600">Parent/Guardian</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
