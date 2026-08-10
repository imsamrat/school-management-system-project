import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useGetExamsQuery, useGetExamSchedulesQuery, useGetMarksQuery, useSaveMarksMutation } from '@/features/exams/examApi';
import { useGetClassesQuery, useGetSubjectsQuery } from '@/features/academics/academicApi';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import { usePermission } from '@/hooks/usePermission';

export default function MarksEntryPage() {
  const [examId, setExamId] = useState('');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  
  const { data: examsRes } = useGetExamsQuery();
  const { data: classesRes } = useGetClassesQuery();
  const { data: subjectsRes } = useGetSubjectsQuery();
  const { data: schedulesRes } = useGetExamSchedulesQuery({ exam_id: examId }, { skip: !examId });
  const { data: studentsRes } = useGetStudentsQuery({}); // would normally filter by classId
  const { data: marksRes, isLoading: isLoadingMarks } = useGetMarksQuery({ exam_id: examId, subject_id: subjectId }, { skip: !examId || !subjectId });
  
  const [saveMarks, { isLoading: isSaving }] = useSaveMarksMutation();
  const { hasPermission } = usePermission();
  const canEnterMarks = hasPermission('marks.enter');

  const exams = examsRes?.data || [];
  const classes = classesRes?.data || [];
  const subjects = subjectsRes?.data || [];
  const schedules = schedulesRes?.data || [];
  
  // Filter subjects based on schedule for the selected class
  const availableSubjectIds = schedules.filter(s => s.class_id === classId).map(s => s.subject_id);
  const availableSubjects = subjects.filter(s => availableSubjectIds.includes(s.id));
  
  const students = (studentsRes?.data || []).filter(s => s.class_id === classId);
  const existingMarks = marksRes?.data || [];

  const [localMarks, setLocalMarks] = useState<Record<string, { marks_obtained: number, remarks: string }>>({});

  useEffect(() => {
    const newState: Record<string, { marks_obtained: number, remarks: string }> = {};
    existingMarks.forEach(m => {
      newState[m.student_id] = { marks_obtained: m.marks_obtained, remarks: m.remarks || '' };
    });
    setLocalMarks(newState);
  }, [existingMarks, subjectId]); // reset when subject changes

  const handleMarksChange = (studentId: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setLocalMarks(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], marks_obtained: numValue, remarks: prev[studentId]?.remarks || '' }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setLocalMarks(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], marks_obtained: prev[studentId]?.marks_obtained || 0, remarks }
    }));
  };

  const handleSave = async () => {
    const records = Object.entries(localMarks).map(([student_id, data]) => ({ 
      student_id, 
      marks_obtained: data.marks_obtained, 
      remarks: data.remarks 
    }));
    
    if (records.length === 0) return;
    
    try {
      await saveMarks({ exam_id: examId, subject_id: subjectId, marks: records }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marks Entry</h1>
        <p className="text-sm text-gray-500">Enter student marks for examinations</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
        <div className="w-48">
          <label className="label">Exam</label>
          <select value={examId} onChange={e => { setExamId(e.target.value); setClassId(''); setSubjectId(''); }} className="input-field">
            <option value="">Select Exam...</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="w-48">
          <label className="label">Class</label>
          <select value={classId} onChange={e => { setClassId(e.target.value); setSubjectId(''); }} className="input-field" disabled={!examId}>
            <option value="">Select Class...</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="w-48">
          <label className="label">Subject</label>
          <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="input-field" disabled={!classId}>
            <option value="">Select Subject...</option>
            {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {examId && classId && subjectId && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-end bg-gray-50/50">
            {canEnterMarks && (
              <button 
                onClick={handleSave} 
                disabled={isSaving || students.length === 0}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Marks
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3 w-48">Total Marks</th>
                  <th className="px-6 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoadingMarks ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading marks...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No students found in this class.</td></tr>
                ) : (
                  students.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-600 font-mono">{student.roll_number}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          min="0"
                          max="100"
                          disabled={!canEnterMarks}
                          value={localMarks[student.id]?.marks_obtained ?? ''} 
                          onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          className="input-field text-center w-32"
                          placeholder="Marks"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="text"
                          disabled={!canEnterMarks}
                          value={localMarks[student.id]?.remarks || ''} 
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          className="input-field"
                          placeholder="Optional remarks..."
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
