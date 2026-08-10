import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGetClassesQuery, useCreateClassMutation } from '@/features/academics/academicApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { usePermission } from '@/hooks/usePermission';
import type { Class } from '@/types/academic.types';

export default function ClassesPage() {
  const { data: response, isLoading } = useGetClassesQuery();
  const [createClass, { isLoading: isCreating }] = useCreateClassMutation();
  const { hasPermission } = usePermission();
  const [isAdding, setIsAdding] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassOrder, setNewClassOrder] = useState('');

  const classes = response?.data || [];

  const handleAdd = async () => {
    if (!newClassName) return;
    try {
      await createClass({ name: newClassName, numeric_order: parseInt(newClassOrder) || 0 }).unwrap();
      setIsAdding(false);
      setNewClassName('');
      setNewClassOrder('');
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<Class>[] = [
    { header: 'Class Name', accessorKey: 'name', sortable: true, className: 'font-medium' },
    { header: 'Numeric Order', accessorKey: 'numeric_order', sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-sm text-gray-500">Manage academic classes</p>
        </div>
        {hasPermission('settings.manage') && (
          <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Class
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-end gap-4">
          <div className="flex-1">
            <label className="label">Class Name</label>
            <input type="text" value={newClassName} onChange={e => setNewClassName(e.target.value)} className="input-field" placeholder="e.g. Class 1" />
          </div>
          <div className="flex-1">
            <label className="label">Numeric Order</label>
            <input type="number" value={newClassOrder} onChange={e => setNewClassOrder(e.target.value)} className="input-field" placeholder="e.g. 1" />
          </div>
          <button onClick={handleAdd} disabled={isCreating || !newClassName} className="btn-primary mb-[1px]">Save</button>
          <button onClick={() => setIsAdding(false)} className="btn-secondary mb-[1px]">Cancel</button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={classes}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
      />
    </div>
  );
}
