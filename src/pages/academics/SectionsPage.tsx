import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGetSectionsQuery, useCreateSectionMutation, useGetClassesQuery } from '@/features/academics/academicApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { usePermission } from '@/hooks/usePermission';
import type { Section } from '@/types/academic.types';

export default function SectionsPage() {
  const { data: response, isLoading } = useGetSectionsQuery();
  const { data: classesResponse } = useGetClassesQuery();
  const [createSection, { isLoading: isCreating }] = useCreateSectionMutation();
  const { hasPermission } = usePermission();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [classId, setClassId] = useState('');
  const [capacity, setCapacity] = useState('30');

  const sections = response?.data || [];
  const classes = classesResponse?.data || [];

  const handleAdd = async () => {
    if (!newSectionName || !classId) return;
    try {
      await createSection({ name: newSectionName, class_id: classId, capacity: parseInt(capacity) }).unwrap();
      setIsAdding(false);
      setNewSectionName('');
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<Section>[] = [
    { header: 'Section Name', accessorKey: 'name', sortable: true, className: 'font-medium' },
    { 
      header: 'Class', 
      cell: (row) => classes.find(c => c.id === row.class_id)?.name || row.class_id 
    },
    { header: 'Capacity', accessorKey: 'capacity' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sections</h1>
          <p className="text-sm text-gray-500">Manage class sections</p>
        </div>
        {hasPermission('settings.manage') && (
          <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Section
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="label">Class</label>
            <select value={classId} onChange={e => setClassId(e.target.value)} className="input-field">
              <option value="">Select Class...</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="label">Section Name</label>
            <input type="text" value={newSectionName} onChange={e => setNewSectionName(e.target.value)} className="input-field" placeholder="e.g. A" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="label">Capacity</label>
            <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} className="input-field" placeholder="30" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleAdd} disabled={isCreating || !newSectionName || !classId} className="btn-primary flex-1">Save</button>
            <button onClick={() => setIsAdding(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={sections}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
      />
    </div>
  );
}
