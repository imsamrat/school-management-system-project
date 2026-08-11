import { useState } from 'react';
import { GraduationCap, Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/common/DataTable';

interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

const mockYears: AcademicYear[] = [
  { id: 'ay1', name: '2026-2027', start_date: '2026-04-01', end_date: '2027-03-31', is_current: true },
  { id: 'ay2', name: '2025-2026', start_date: '2025-04-01', end_date: '2026-03-31', is_current: false },
  { id: 'ay3', name: '2024-2025', start_date: '2024-04-01', end_date: '2025-03-31', is_current: false },
];

export default function AcademicYearsPage() {
  const [years, setYears] = useState<AcademicYear[]>(mockYears);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: '', start_date: '', end_date: '' });

  const handleAdd = () => {
    if (!form.name || !form.start_date || !form.end_date) return;
    const newYear: AcademicYear = {
      id: `ay${years.length + 1}`,
      ...form,
      is_current: false,
    };
    setYears([newYear, ...years]);
    setIsAdding(false);
    setForm({ name: '', start_date: '', end_date: '' });
  };

  const handleSetCurrent = (id: string) => {
    setYears(years.map(y => ({ ...y, is_current: y.id === id })));
  };

  const columns: Column<AcademicYear>[] = [
    {
      header: 'Academic Year',
      cell: row => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-700" />
          </div>
          <span className="font-bold text-gray-900">{row.name}</span>
        </div>
      ),
    },
    { header: 'Start Date', cell: row => row.start_date },
    { header: 'End Date', cell: row => row.end_date },
    {
      header: 'Status',
      cell: row => row.is_current ? (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">Active</span>
      ) : (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">Inactive</span>
      ),
    },
    {
      header: 'Actions',
      cell: row => (
        <div className="flex items-center gap-2">
          {!row.is_current && (
            <button
              onClick={() => handleSetCurrent(row.id)}
              className="text-xs font-medium text-primary-600 hover:text-primary-800 border border-primary-200 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Set as Active
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Years</h1>
          <p className="text-sm text-gray-500">Manage and configure academic session years</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Add Academic Year
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">New Academic Year</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Year Label (e.g., 2027-2028)</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="2027-2028" />
            </div>
            <div>
              <label className="label">Start Date</label>
              <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label">End Date</label>
              <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAdd} className="btn-primary">Save Year</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={years}
          keyExtractor={row => row.id}
          isLoading={false}
        />
      </div>
    </div>
  );
}
