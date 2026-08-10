import { useParams, useNavigate } from 'react-router-dom';
import { useGetEmployeeByIdQuery, useDeleteEmployeeMutation } from '@/features/employees/employeeApi';
import { ArrowLeft, Edit, Trash2, Briefcase, Building2, Phone, MapPin } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';

export default function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { data: response, isLoading } = useGetEmployeeByIdQuery(id!);
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
  
  const employee = response?.data;

  const handleDelete = async () => {
    try {
      await deleteEmployee(id!).unwrap();
      navigate('/employees');
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return <div className="text-center py-12 text-gray-500">Employee not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/employees')}
            className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Employee Profile</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage employee details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasPermission('employees.edit') && (
            <button className="btn-secondary flex items-center gap-2">
              <Edit className="w-4 h-4" /> Edit
            </button>
          )}
          {hasPermission('employees.edit') && (
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Terminate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-bold mb-4">
            {employee.first_name[0]}{employee.last_name[0]}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{employee.first_name} {employee.last_name}</h2>
          <p className="text-gray-500 text-sm mt-1">{employee.employee_id_code}</p>
          <div className="mt-3">
            <StatusBadge status={employee.status} />
          </div>

          <div className="w-full border-t border-gray-100 mt-6 pt-6 space-y-4 text-left">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">{employee.designation}</p>
                <p className="text-xs text-gray-500">Designation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">{employee.department}</p>
                <p className="text-xs text-gray-500">Department</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6">
            <nav className="flex space-x-6">
              <a href="#" className="py-4 px-1 border-b-2 border-primary-600 font-medium text-sm text-primary-700">Overview</a>
              <a href="#" className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Attendance</a>
              <a href="#" className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Payroll</a>
            </nav>
          </div>
          <div className="p-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">Not provided</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">Not provided</p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Terminate Employee"
        message="Are you sure you want to mark this employee as terminated?"
        confirmLabel="Terminate"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
