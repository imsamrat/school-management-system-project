import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGetExamsQuery, useCreateExamMutation } from '@/features/exams/examApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { usePermission } from '@/hooks/usePermission';
import type { Exam } from '@/types/exam.types';

export default function ExamSetupPage() {
  const { data: response, isLoading } = useGetExamsQuery();
  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
  const { hasPermission } = usePermission();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newExam, setNewExam] = useState({ name: '', start_date: '', end_date: '', status: 'upcoming' });

  const exams = response?.data || [];

  const handleAdd = async () => {
    if (!newExam.name || !newExam.start_date || !newExam.end_date) return;
    try {
      await createExam(newExam as Partial<Exam>).unwrap();
      setIsAdding(false);
      setNewExam({ name: '', start_date: '', end_date: '', status: 'upcoming' });
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<Exam>[] = [
    { header: 'Exam Name', accessorKey: 'name' },
    { header: 'Start Date', accessorKey: 'start_date' },
    { header: 'End Date', accessorKey: 'end_date' },
    { 
      header: 'Status', 
      cell: row => <StatusBadge status={row.status} />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Setup</h1>
          <p className="text-sm text-gray-500">Create and manage examinations</p>
        </div>
        {hasPermission('exams.create') && (
          <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Exam
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="label">Exam Name (e.g. Mid-Term 2026)</label>
              <input type="text" value={newExam.name} onChange={e => setNewExam({...newExam, name: e.target.value})} className="input-field" placeholder="Enter exam name..." />
            </div>
            <div>
              <label className="label">Start Date</label>
              <input type="date" value={newExam.start_date} onChange={e => setNewExam({...newExam, start_date: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="label">End Date</label>
              <input type="date" value={newExam.end_date} onChange={e => setNewExam({...newExam, end_date: e.target.value})} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAdd} disabled={isCreating || !newExam.name} className="btn-primary">Save Exam</button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={exams}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
      />
    </div>
  );
}
