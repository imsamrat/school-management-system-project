import { useState } from 'react';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import { useGetExamsQuery } from '@/features/exams/examApi';
import { Printer, Download, Filter } from 'lucide-react';

export default function AdmitCardsPage() {
  const { data: studentsRes, isLoading: loadingStudents } = useGetStudentsQuery({});
  const { data: examsRes, isLoading: loadingExams } = useGetExamsQuery();

  const students = studentsRes?.data || [];
  const exams = examsRes?.data || [];

  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const filteredStudents = students.filter(s => {
    return !selectedClass || s.class_id === selectedClass;
  });

  const selectedExamObj = exams.find(e => e.id === selectedExam);

  const handlePrint = () => {
    window.print();
  };

  const classes = [...new Set(students.map(s => s.class_id).filter(Boolean))];

  if (loadingStudents || loadingExams) return <div className="p-8 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admit Cards</h1>
          <p className="text-sm text-gray-500">Generate and print examination admit cards for students</p>
        </div>
        <button
          onClick={handlePrint}
          disabled={!selectedExam || filteredStudents.length === 0}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Printer className="w-4 h-4" /> Print Admit Cards
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm print:hidden">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <h2 className="font-semibold text-gray-700">Select Examination & Class</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Examination *</label>
            <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)} className="input-field">
              <option value="">Select Examination...</option>
              {exams.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Class (Optional — leave blank for all)</label>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="input-field">
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        {selectedExam && (
          <p className="mt-3 text-sm text-gray-500">
            Ready to print <span className="font-semibold text-gray-900">{filteredStudents.length}</span> admit cards
            {selectedExamObj ? ` for ${selectedExamObj.name}` : ''}.
          </p>
        )}
      </div>

      {/* Admit Cards Grid — visible on screen and in print */}
      {selectedExam && filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm print:break-inside-avoid print:shadow-none print:rounded-none"
            >
              {/* Header */}
              <div className="bg-primary-700 text-white p-4">
                <div className="text-center">
                  <h3 className="font-bold text-lg">Green Valley School</h3>
                  <p className="text-xs opacity-80">123 Education Lane, New York</p>
                  <div className="mt-2 bg-white/20 rounded-lg px-3 py-1 inline-block">
                    <p className="text-xs font-bold uppercase tracking-wider">Examination Admit Card</p>
                  </div>
                </div>
              </div>

              {/* Exam Info */}
              <div className="bg-primary-50 px-4 py-2 flex justify-between items-center border-b border-primary-100">
                <div>
                  <p className="text-[10px] text-primary-600 font-semibold uppercase">Examination</p>
                  <p className="text-sm font-bold text-primary-900">{selectedExamObj?.name || 'Selected Exam'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-primary-600 font-semibold uppercase">Date</p>
                  <p className="text-sm font-bold text-primary-900">{selectedExamObj?.start_date || '—'}</p>
                </div>
              </div>

              {/* Student Info */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex-shrink-0 overflow-hidden">
                    <img
                      src={`https://ui-avatars.com/api/?name=${student.first_name}+${student.last_name}&background=e0e7ff&color=4338ca&size=128`}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900 uppercase">{student.first_name} {student.last_name}</p>
                    <p className="text-xs text-gray-500">Roll No: <span className="font-semibold">{student.roll_number || 'N/A'}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-gray-400 uppercase font-semibold">Admission No.</p>
                    <p className="font-bold text-gray-800">{student.admission_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase font-semibold">Class</p>
                    <p className="font-bold text-gray-800">{student.class_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase font-semibold">Section</p>
                    <p className="font-bold text-gray-800">{student.section_id || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase font-semibold">Gender</p>
                    <p className="font-bold text-gray-800">{student.gender}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-end">
                <div className="border-t border-black pt-1 w-28 text-center">
                  <p className="text-[9px] text-gray-500">Principal's Signature</p>
                </div>
                <div className="border-t border-black pt-1 w-28 text-center">
                  <p className="text-[9px] text-gray-500">Controller of Exams</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !selectedExam && (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center">
            <Printer className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Select an examination above to generate admit cards</p>
            <p className="text-gray-400 text-sm mt-1">Admit cards will be generated for all eligible students</p>
          </div>
        )
      )}
    </div>
  );
}
