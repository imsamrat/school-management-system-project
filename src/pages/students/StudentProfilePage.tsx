import { useParams, useNavigate } from 'react-router-dom';
import { useGetStudentByIdQuery, useDeleteStudentMutation } from '@/features/students/studentApi';
import { ArrowLeft, Edit, Trash2, GraduationCap, Calendar, User, Phone, MapPin } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { data: response, isLoading } = useGetStudentByIdQuery(id!);
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  
  const student = response?.data;

  const handleDelete = async () => {
    try {
      await deleteStudent(id!).unwrap();
      navigate('/students');
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) {
    return <div className="text-center py-12 text-gray-500">Student not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/students')}
            className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Student Profile</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage student details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasPermission('students.edit') && (
            <button className="btn-secondary flex items-center gap-2">
              <Edit className="w-4 h-4" /> Edit
            </button>
          )}
          {hasPermission('students.delete') && (
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-bold mb-4">
            {student.first_name[0]}{student.last_name[0]}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{student.first_name} {student.last_name}</h2>
          <p className="text-gray-500 text-sm mt-1">{student.admission_number}</p>
          <div className="mt-3">
            <StatusBadge status={student.status} />
          </div>

          <div className="w-full border-t border-gray-100 mt-6 pt-6 space-y-4 text-left">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Class {student.class_id} - Section {student.section_id}</p>
                <p className="text-xs text-gray-500">Roll No: {student.roll_number}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">{student.gender}</p>
                <p className="text-xs text-gray-500">Gender</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details Tabs */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6">
            <nav className="flex space-x-6">
              <a href="#" className="py-4 px-1 border-b-2 border-primary-600 font-medium text-sm text-primary-700">Overview</a>
              <a href="#" className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Attendance</a>
              <a href="#" className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Marks</a>
              <a href="#" className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Fees</a>
            </nav>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Father Name Placeholder</h4>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" /> +1 234 567 890
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> 123 Main St, City
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        confirmLabel="Delete Student"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
