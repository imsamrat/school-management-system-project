import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Save } from 'lucide-react';
import { useGetStudentAttendanceQuery, useMarkStudentAttendanceMutation } from '@/features/attendance/attendanceApi';
import { useGetClassesQuery, useGetSectionsQuery } from '@/features/academics/academicApi';
import { useGetStudentsQuery } from '@/features/students/studentApi';
import { DatePicker } from '@/components/common/DatePicker';
import { BulkActionToolbar } from '@/components/common/BulkActionToolbar';
import { usePermission } from '@/hooks/usePermission';

export default function StudentAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  
  const { data: classesRes } = useGetClassesQuery();
  const { data: sectionsRes } = useGetSectionsQuery();
  // Fetch students, in real app filtered by class/section
  const { data: studentsRes } = useGetStudentsQuery({});
  
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const { data: attendanceRes, isLoading: isLoadingAtt } = useGetStudentAttendanceQuery({ date: dateStr, class_id: classId, section_id: sectionId }, { skip: !classId });
  const [markAttendance, { isLoading: isSaving }] = useMarkStudentAttendanceMutation();
  
  const { hasPermission } = usePermission();
  const canMark = hasPermission('attendance.mark');

  const classes = classesRes?.data || [];
  const sections = sectionsRes?.data || [];
  const students = (studentsRes?.data || []).filter(s => s.class_id === classId && (sectionId ? s.section_id === sectionId : true));
  const existingAttendance = attendanceRes?.data || [];

  const [localState, setLocalState] = useState<Record<string, string>>({});

  useEffect(() => {
    // Populate local state with existing attendance
    const newState: Record<string, string> = {};
    existingAttendance.forEach(a => {
      if (a.student_id) newState[a.student_id] = a.status;
    });
    setLocalState(newState);
  }, [existingAttendance]);

  const handleStatusChange = (studentId: string, status: string) => {
    setLocalState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleBulk = (status: string) => {
    const newState: Record<string, string> = {};
    students.forEach(s => {
      newState[s.id] = status;
    });
    setLocalState(newState);
  };

  const handleSave = async () => {
    const records = Object.entries(localState).map(([student_id, status]) => ({ student_id, status }));
    if (records.length === 0) return;
    
    try {
      await markAttendance({ date: dateStr, records }).unwrap();
      // Toast notification would go here
    } catch (e) {
      console.error('Failed to save attendance', e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Attendance</h1>
        <p className="text-sm text-gray-500">Mark and manage daily student attendance</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
        <div className="w-48">
          <label className="label">Date</label>
          <DatePicker date={selectedDate} onChange={setSelectedDate} maxDate={new Date()} />
        </div>
        <div className="w-48">
          <label className="label">Class</label>
          <select value={classId} onChange={e => setClassId(e.target.value)} className="input-field">
            <option value="">Select Class...</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="w-48">
          <label className="label">Section</label>
          <select value={sectionId} onChange={e => setSectionId(e.target.value)} className="input-field" disabled={!classId}>
            <option value="">All Sections</option>
            {sections.filter(s => s.class_id === classId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {classId && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <BulkActionToolbar 
              onMarkAllPresent={() => handleBulk('present')}
              onMarkAllAbsent={() => handleBulk('absent')}
              disabled={!canMark || students.length === 0}
            />
            {canMark && (
              <button 
                onClick={handleSave} 
                disabled={isSaving || students.length === 0}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Attendance
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoadingAtt ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No students found in this class.</td></tr>
                ) : (
                  students.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-600 font-mono">{student.roll_number}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {['present', 'absent', 'late', 'leave'].map(status => (
                            <button
                              key={status}
                              disabled={!canMark}
                              onClick={() => handleStatusChange(student.id, status)}
                              className={`px-3 py-1.5 rounded text-xs font-medium capitalize border transition-colors ${
                                localState[student.id] === status
                                  ? status === 'present' ? 'bg-green-100 text-green-700 border-green-200'
                                  : status === 'absent' ? 'bg-red-100 text-red-700 border-red-200'
                                  : status === 'late' ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                  : 'bg-blue-100 text-blue-700 border-blue-200'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
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
