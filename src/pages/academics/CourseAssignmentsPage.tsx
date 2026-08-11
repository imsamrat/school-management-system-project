import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGetCourseAssignmentsQuery, useCreateCourseAssignmentMutation, useGetClassesQuery, useGetSectionsQuery, useGetSubjectsQuery } from '@/features/academics/academicApi';
import { useGetTeachersQuery } from '@/features/teachers/teacherApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { usePermission } from '@/hooks/usePermission';
import type { CourseAssignment } from '@/types/academic.types';

export default function CourseAssignmentsPage() {
  const { data: response, isLoading } = useGetCourseAssignmentsQuery();
  const { data: classesRes } = useGetClassesQuery();
  const { data: sectionsRes } = useGetSectionsQuery();
  const { data: subjectsRes } = useGetSubjectsQuery();
  const { data: teachersRes } = useGetTeachersQuery({});
  
  const [createAssignment, { isLoading: isCreating }] = useCreateCourseAssignmentMutation();
  const { hasPermission } = usePermission();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ class_id: '', section_id: '', subject_id: '', employee_id: '' });

  const assignments = response?.data || [];
  const classes = classesRes?.data || [];
  const sections = sectionsRes?.data || [];
  const subjects = subjectsRes?.data || [];
  const teachers = teachersRes?.data || [];

  const handleAdd = async () => {
    if (!newAssignment.class_id || !newAssignment.subject_id || !newAssignment.employee_id) return;
    try {
      await createAssignment(newAssignment as Partial<CourseAssignment>).unwrap();
      setIsAdding(false);
      setNewAssignment({ class_id: '', section_id: '', subject_id: '', employee_id: '' });
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<CourseAssignment>[] = [
    { 
      header: 'Class & Section', 
      cell: row => {
        const c = classes.find(c => c.id === row.class_id)?.name;
        const s = sections.find(s => s.id === row.section_id)?.name;
        return <span className="font-medium text-gray-900">{c} {s ? `- ${s}` : ''}</span>;
      }
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
          <h1 className="text-2xl font-bold text-gray-900">Course Assignments</h1>
          <p className="text-sm text-gray-500">Map teachers to subjects and classes</p>
        </div>
        {hasPermission('settings.manage') && (
          <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Assign Teacher
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Class</label>
              <select value={newAssignment.class_id} onChange={e => setNewAssignment({...newAssignment, class_id: e.target.value})} className="input-field">
                <option value="">Select Class...</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Section</label>
              <select value={newAssignment.section_id} onChange={e => setNewAssignment({...newAssignment, section_id: e.target.value})} className="input-field">
                <option value="">All Sections</option>
                {sections.filter(s => s.class_id === newAssignment.class_id).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Subject</label>
              <select value={newAssignment.subject_id} onChange={e => setNewAssignment({...newAssignment, subject_id: e.target.value})} className="input-field">
                <option value="">Select Subject...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Teacher</label>
              <select value={newAssignment.employee_id} onChange={e => setNewAssignment({...newAssignment, employee_id: e.target.value})} className="input-field">
                <option value="">Select Teacher...</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAdd} disabled={isCreating || !newAssignment.class_id || !newAssignment.subject_id || !newAssignment.employee_id} className="btn-primary">Save Assignment</button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={assignments}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
      />
    </div>
  );
}
