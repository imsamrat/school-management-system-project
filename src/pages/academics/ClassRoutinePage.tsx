import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGetClassRoutinesQuery, useCreateClassRoutineMutation, useGetClassesQuery, useGetSectionsQuery, useGetSubjectsQuery } from '@/features/academics/academicApi';
import { useGetTeachersQuery } from '@/features/teachers/teacherApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { usePermission } from '@/hooks/usePermission';
import type { ClassRoutine } from '@/types/academic.types';

export default function ClassRoutinePage() {
  const { data: response, isLoading } = useGetClassRoutinesQuery();
  const { data: classesRes } = useGetClassesQuery();
  const { data: sectionsRes } = useGetSectionsQuery();
  const { data: subjectsRes } = useGetSubjectsQuery();
  const { data: teachersRes } = useGetTeachersQuery({});
  
  const [createRoutine, { isLoading: isCreating }] = useCreateClassRoutineMutation();
  const { hasPermission } = usePermission();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ class_id: '', section_id: '', day_of_week: 'Monday', period_number: 1, start_time: '', end_time: '', subject_id: '', employee_id: '' });

  const routines = response?.data || [];
  const classes = classesRes?.data || [];
  const sections = sectionsRes?.data || [];
  const subjects = subjectsRes?.data || [];
  const teachers = teachersRes?.data || [];

  const handleAdd = async () => {
    if (!newRoutine.class_id || !newRoutine.subject_id || !newRoutine.employee_id || !newRoutine.start_time) return;
    try {
      await createRoutine(newRoutine as unknown as Partial<ClassRoutine>).unwrap();
      setIsAdding(false);
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<ClassRoutine>[] = [
    { 
      header: 'Class/Section', 
      cell: row => {
        const c = classes.find(c => c.id === row.class_id)?.name;
        const s = sections.find(s => s.id === row.section_id)?.name;
        return <span className="font-medium text-gray-900">{c} {s ? `- ${s}` : ''}</span>;
      }
    },
    { header: 'Day', accessorKey: 'day_of_week' },
    { 
      header: 'Time', 
      cell: row => <span className="text-gray-600 font-mono text-sm">{row.start_time} - {row.end_time}</span>
    },
    { 
      header: 'Subject', 
      cell: row => subjects.find(s => s.id === row.subject_id)?.name || row.subject_id 
    },
    { 
      header: 'Teacher', 
      cell: row => {
        const t = teachers.find(t => t.id === row.employee_id);
        return t ? `${t.first_name} ${t.last_name}` : row.employee_id;
      }
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Routine</h1>
          <p className="text-sm text-gray-500">Manage daily class timetables (List View)</p>
        </div>
        {hasPermission('settings.manage') && (
          <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Slot
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Class</label>
              <select value={newRoutine.class_id} onChange={e => setNewRoutine({...newRoutine, class_id: e.target.value})} className="input-field">
                <option value="">Select Class...</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Section</label>
              <select value={newRoutine.section_id} onChange={e => setNewRoutine({...newRoutine, section_id: e.target.value})} className="input-field">
                <option value="">Select Section...</option>
                {sections.filter(s => s.class_id === newRoutine.class_id).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Day</label>
              <select value={newRoutine.day_of_week} onChange={e => setNewRoutine({...newRoutine, day_of_week: e.target.value})} className="input-field">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Period & Time</label>
              <div className="flex gap-2">
                <input type="time" value={newRoutine.start_time} onChange={e => setNewRoutine({...newRoutine, start_time: e.target.value})} className="input-field px-2" />
                <input type="time" value={newRoutine.end_time} onChange={e => setNewRoutine({...newRoutine, end_time: e.target.value})} className="input-field px-2" />
              </div>
            </div>
            <div>
              <label className="label">Subject</label>
              <select value={newRoutine.subject_id} onChange={e => setNewRoutine({...newRoutine, subject_id: e.target.value})} className="input-field">
                <option value="">Select Subject...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Teacher</label>
              <select value={newRoutine.employee_id} onChange={e => setNewRoutine({...newRoutine, employee_id: e.target.value})} className="input-field">
                <option value="">Select Teacher...</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAdd} disabled={isCreating || !newRoutine.class_id || !newRoutine.subject_id || !newRoutine.employee_id} className="btn-primary">Save Slot</button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={routines}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
      />
    </div>
  );
}
