import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGetSubjectsQuery, useCreateSubjectMutation } from '@/features/academics/academicApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { usePermission } from '@/hooks/usePermission';
import type { Subject } from '@/types/academic.types';

export default function SubjectsPage() {
  const { data: response, isLoading } = useGetSubjectsQuery();
  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
  const { hasPermission } = usePermission();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', code: '', subject_type: 'theory' });

  const subjects = response?.data || [];

  const handleAdd = async () => {
    if (!newSubject.name || !newSubject.code) return;
    try {
      await createSubject(newSubject as Partial<Subject>).unwrap();
      setIsAdding(false);
      setNewSubject({ name: '', code: '', subject_type: 'theory' });
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<Subject>[] = [
    { header: 'Subject Code', accessorKey: 'code', sortable: true, className: 'font-semibold text-gray-900' },
    { header: 'Subject Name', accessorKey: 'name', sortable: true },
    { header: 'Type', accessorKey: 'subject_type', cell: row => <span className="capitalize">{row.subject_type}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
          <p className="text-sm text-gray-500">Manage academic subjects</p>
        </div>
        {hasPermission('settings.manage') && (
          <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="label">Subject Name</label>
            <input type="text" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} className="input-field" placeholder="e.g. Mathematics" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="label">Subject Code</label>
            <input type="text" value={newSubject.code} onChange={e => setNewSubject({...newSubject, code: e.target.value})} className="input-field" placeholder="e.g. MATH101" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="label">Type</label>
            <select value={newSubject.subject_type} onChange={e => setNewSubject({...newSubject, subject_type: e.target.value})} className="input-field">
              <option value="theory">Theory</option>
              <option value="practical">Practical</option>
            </select>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleAdd} disabled={isCreating || !newSubject.name || !newSubject.code} className="btn-primary flex-1">Save</button>
            <button onClick={() => setIsAdding(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={subjects}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
      />
    </div>
  );
}
