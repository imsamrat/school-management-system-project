import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGetExamSchedulesQuery, useCreateExamScheduleMutation, useGetExamsQuery } from '@/features/exams/examApi';
import { useGetClassesQuery, useGetSubjectsQuery } from '@/features/academics/academicApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { usePermission } from '@/hooks/usePermission';
import type { ExamSchedule } from '@/types/exam.types';

export default function ExamSchedulePage() {
  const [selectedExam, setSelectedExam] = useState('');
  
  const { data: examsRes } = useGetExamsQuery();
  const { data: schedulesRes, isLoading } = useGetExamSchedulesQuery({ exam_id: selectedExam }, { skip: !selectedExam });
  const { data: classesRes } = useGetClassesQuery();
  const { data: subjectsRes } = useGetSubjectsQuery();
  
  const [createSchedule, { isLoading: isCreating }] = useCreateExamScheduleMutation();
  const { hasPermission } = usePermission();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ class_id: '', subject_id: '', exam_date: '', start_time: '', end_time: '', total_marks: 100, pass_marks: 40 });

  const exams = examsRes?.data || [];
  const schedules = schedulesRes?.data || [];
  const classes = classesRes?.data || [];
  const subjects = subjectsRes?.data || [];

  const handleAdd = async () => {
    if (!selectedExam || !newSchedule.class_id || !newSchedule.subject_id) return;
    try {
      await createSchedule({ exam_id: selectedExam, ...newSchedule } as Partial<ExamSchedule>).unwrap();
      setIsAdding(false);
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<ExamSchedule>[] = [
    { 
      header: 'Class', 
      cell: row => classes.find(c => c.id === row.class_id)?.name || row.class_id
    },
    { 
      header: 'Subject', 
      cell: row => subjects.find(s => s.id === row.subject_id)?.name || row.subject_id
    },
    { header: 'Date', accessorKey: 'exam_date' },
    { 
      header: 'Time', 
      cell: row => <span className="text-gray-600 font-mono text-sm">{row.start_time} - {row.end_time}</span>
    },
    { 
      header: 'Marks (Total/Pass)', 
      cell: row => `${row.total_marks} / ${row.pass_marks}`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Schedule</h1>
          <p className="text-sm text-gray-500">Define dates and times for exam subjects</p>
        </div>
        {hasPermission('exams.manage') && selectedExam && (
          <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Subject to Schedule
          </button>
        )}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <label className="label">Select Exam to View/Manage Schedule</label>
        <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)} className="input-field max-w-md">
          <option value="">Select Exam...</option>
          {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      {isAdding && selectedExam && (
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Class</label>
              <select value={newSchedule.class_id} onChange={e => setNewSchedule({...newSchedule, class_id: e.target.value})} className="input-field">
                <option value="">Select Class...</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Subject</label>
              <select value={newSchedule.subject_id} onChange={e => setNewSchedule({...newSchedule, subject_id: e.target.value})} className="input-field">
                <option value="">Select Subject...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Exam Date</label>
              <input type="date" value={newSchedule.exam_date} onChange={e => setNewSchedule({...newSchedule, exam_date: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="label">Time (Start & End)</label>
              <div className="flex gap-2">
                <input type="time" value={newSchedule.start_time} onChange={e => setNewSchedule({...newSchedule, start_time: e.target.value})} className="input-field px-2" />
                <input type="time" value={newSchedule.end_time} onChange={e => setNewSchedule({...newSchedule, end_time: e.target.value})} className="input-field px-2" />
              </div>
            </div>
            <div>
              <label className="label">Total Marks</label>
              <input type="number" value={newSchedule.total_marks} onChange={e => setNewSchedule({...newSchedule, total_marks: Number(e.target.value)})} className="input-field" />
            </div>
            <div>
              <label className="label">Pass Marks</label>
              <input type="number" value={newSchedule.pass_marks} onChange={e => setNewSchedule({...newSchedule, pass_marks: Number(e.target.value)})} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAdd} disabled={isCreating || !newSchedule.class_id || !newSchedule.subject_id} className="btn-primary">Save to Schedule</button>
          </div>
        </div>
      )}

      {selectedExam && (
        <DataTable
          columns={columns}
          data={schedules}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
