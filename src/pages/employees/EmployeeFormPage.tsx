import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateEmployeeMutation } from '@/features/employees/employeeApi';
import { ArrowLeft, Save } from 'lucide-react';

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    employee_id_code: '',
    department: '',
    designation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployee(formData).unwrap();
      navigate('/employees');
    } catch (error) {
      console.error('Failed to create employee:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/employees')}
          className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Employee</h1>
          <p className="text-sm text-gray-500 mt-1">Register a new non-teaching staff member</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">First Name *</label>
                <input required type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="input-field" placeholder="e.g. Michael" />
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input required type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="input-field" placeholder="e.g. Davis" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Employee ID *</label>
                <input required type="text" name="employee_id_code" value={formData.employee_id_code} onChange={handleChange} className="input-field" placeholder="e.g. EMP-001" />
              </div>
              <div>
                <label className="label">Department *</label>
                <input required type="text" name="department" value={formData.department} onChange={handleChange} className="input-field" placeholder="e.g. Administration" />
              </div>
              <div>
                <label className="label">Designation *</label>
                <input required type="text" name="designation" value={formData.designation} onChange={handleChange} className="input-field" placeholder="e.g. Accountant" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/employees')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Employee
          </button>
        </div>
      </form>
    </div>
  );
}
