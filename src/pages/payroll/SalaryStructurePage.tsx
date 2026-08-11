import { useState } from 'react';
import { useGetSalaryStructuresQuery, useCreateSalaryStructureMutation } from '@/features/payroll/payrollApi';
import { useGetTeachersQuery } from '@/features/teachers/teacherApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import type { SalaryStructure } from '@/types/payroll.types';

export default function SalaryStructurePage() {
  const { data: salaryRes, isLoading } = useGetSalaryStructuresQuery();
  const { data: teachersRes } = useGetTeachersQuery({});
  const [createStructure, { isLoading: isCreating }] = useCreateSalaryStructureMutation();

  const structures = salaryRes?.data || [];
  const teachers = teachersRes?.data || [];

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<SalaryStructure>>({
    user_type: 'teacher',
    user_id: '',
    base_salary: 0,
    allowances: 0,
    deductions: 0
  });

  const handleSave = async () => {
    if (!formData.user_id || !formData.base_salary) return;
    try {
      await createStructure(formData).unwrap();
      setIsAdding(false);
      setFormData({ user_type: 'teacher', user_id: '', base_salary: 0, allowances: 0, deductions: 0 });
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<SalaryStructure>[] = [
    { 
      header: 'Employee', 
      cell: row => {
        if (row.user_type === 'teacher') {
          const t = teachers.find(t => t.id === row.user_id);
          return t ? `${t.first_name} ${t.last_name} (Teacher)` : row.user_id;
        }
        return row.user_id;
      }
    },
    { header: 'Base Salary', cell: row => <span className="font-semibold">${row.base_salary}</span> },
    { header: 'Allowances', cell: row => <span className="text-green-600">+${row.allowances}</span> },
    { header: 'Deductions', cell: row => <span className="text-red-600">-${row.deductions}</span> },
    { header: 'Net Salary', cell: row => <span className="font-bold text-gray-900">${row.net_salary}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Structures</h1>
          <p className="text-sm text-gray-500">Define base pay and allowances for staff</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary">
          Configure Salary
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="label">Teacher</label>
              <select 
                value={formData.user_id} 
                onChange={e => setFormData({...formData, user_id: e.target.value})} 
                className="input-field"
              >
                <option value="">Select Teacher...</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Base Salary ($)</label>
              <input 
                type="number" 
                value={formData.base_salary} 
                onChange={e => setFormData({...formData, base_salary: Number(e.target.value)})} 
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="label">Allowances ($)</label>
              <input 
                type="number" 
                value={formData.allowances} 
                onChange={e => setFormData({...formData, allowances: Number(e.target.value)})} 
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="label">Deductions ($)</label>
              <input 
                type="number" 
                value={formData.deductions} 
                onChange={e => setFormData({...formData, deductions: Number(e.target.value)})} 
                className="input-field"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={isCreating || !formData.user_id} className="btn-primary">Save Structure</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={structures}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
