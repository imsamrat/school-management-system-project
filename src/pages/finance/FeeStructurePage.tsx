import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGetFeeStructuresQuery, useCreateFeeStructureMutation } from '@/features/finance/financeApi';
import { useGetClassesQuery } from '@/features/academics/academicApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { usePermission } from '@/hooks/usePermission';
import type { FeeStructure } from '@/types/finance.types';

export default function FeeStructurePage() {
  const { data: response, isLoading } = useGetFeeStructuresQuery({});
  const { data: classesRes } = useGetClassesQuery();
  const [createFeeStructure, { isLoading: isCreating }] = useCreateFeeStructureMutation();
  const { hasPermission } = usePermission();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newFS, setNewFS] = useState({ class_id: '', name: '', amount: 0, frequency: 'monthly' });

  const structures = response?.data || [];
  const classes = classesRes?.data || [];

  const handleAdd = async () => {
    if (!newFS.class_id || !newFS.name || newFS.amount <= 0) return;
    try {
      await createFeeStructure(newFS as Partial<FeeStructure>).unwrap();
      setIsAdding(false);
      setNewFS({ class_id: '', name: '', amount: 0, frequency: 'monthly' });
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<FeeStructure>[] = [
    { 
      header: 'Class', 
      cell: row => classes.find(c => c.id === row.class_id)?.name || row.class_id 
    },
    { header: 'Fee Name', accessorKey: 'name' },
    { 
      header: 'Amount', 
      cell: row => <span className="font-semibold text-gray-900">${row.amount.toFixed(2)}</span>
    },
    { 
      header: 'Frequency', 
      cell: row => <span className="capitalize">{row.frequency}</span> 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Structures</h1>
          <p className="text-sm text-gray-500">Define standard fees for classes</p>
        </div>
        {hasPermission('finance.manage') && (
          <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Fee
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Class</label>
              <select value={newFS.class_id} onChange={e => setNewFS({...newFS, class_id: e.target.value})} className="input-field">
                <option value="">Select Class...</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Fee Name</label>
              <input type="text" value={newFS.name} onChange={e => setNewFS({...newFS, name: e.target.value})} className="input-field" placeholder="e.g. Tuition Fee" />
            </div>
            <div>
              <label className="label">Amount</label>
              <input type="number" value={newFS.amount} onChange={e => setNewFS({...newFS, amount: Number(e.target.value)})} className="input-field" min="0" step="0.01" />
            </div>
            <div>
              <label className="label">Frequency</label>
              <select value={newFS.frequency} onChange={e => setNewFS({...newFS, frequency: e.target.value})} className="input-field">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One-Time</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAdd} disabled={isCreating || !newFS.class_id || !newFS.name || newFS.amount <= 0} className="btn-primary">Save Fee</button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={structures}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
      />
    </div>
  );
}
