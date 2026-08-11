import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit, Trash2, GraduationCap, Briefcase, Phone,
  MapPin, Mail, Calendar, Building2, DollarSign, User, Award, ChevronRight
} from 'lucide-react';
import {
  useGetStaffByIdQuery,
  useDeleteStaffMutation,
  usePromoteToTeacherMutation,
  useDemoteFromTeacherMutation
} from '@/features/staff/staffApi';
import StatusBadge from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { usePermission } from '@/hooks/usePermission';
import type { Staff } from '@/types/staff.types';

export default function StaffProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [isDemoteOpen, setIsDemoteOpen] = useState(false);

  const { data: response, isLoading } = useGetStaffByIdQuery(id!);
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const [promote, { isLoading: isPromoting }] = usePromoteToTeacherMutation();
  const [demote, { isLoading: isDemoting }] = useDemoteFromTeacherMutation();

  const staff = response?.data;

  const handleDelete = async () => {
    try { await deleteStaff(id!).unwrap(); navigate('/staff'); }
    catch (e) { console.error(e); }
  };

  const handlePromote = async () => {
    try { await promote({ id: id!, body: {} }).unwrap(); setIsPromoteOpen(false); }
    catch (e) { console.error(e); }
  };

  const handleDemote = async () => {
    try { await demote(id!).unwrap(); setIsDemoteOpen(false); }
    catch (e) { console.error(e); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
  if (!staff) return <div className="text-center py-12 text-gray-500">Staff member not found.</div>;

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) =>
    value ? (
      <div className="flex items-start gap-3 text-sm">
        <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
        <div>
          <span className="text-gray-500 text-xs uppercase tracking-wide">{label}</span>
          <p className="font-medium text-gray-800 mt-0.5">{value}</p>
        </div>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/staff')}
            className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Profile</h1>
            <p className="text-sm text-gray-500 mt-1">
              {staff.is_teacher ? 'Teaching Staff Member' : 'Non-Teaching Staff Member'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Promote/Demote Actions */}
          {hasPermission('employees.edit') && !staff.is_teacher && (
            <button
              onClick={() => setIsPromoteOpen(true)}
              className="btn-secondary text-blue-600 hover:bg-blue-50 hover:border-blue-300 flex items-center gap-2 text-sm"
            >
              <GraduationCap className="w-4 h-4" />
              Promote to Teacher
            </button>
          )}
          {hasPermission('employees.edit') && staff.is_teacher && (
            <button
              onClick={() => setIsDemoteOpen(true)}
              className="btn-secondary text-gray-600 flex items-center gap-2 text-sm"
            >
              <Briefcase className="w-4 h-4" />
              Remove Teacher Role
            </button>
          )}
          {hasPermission('employees.edit') && (
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200 flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" /> Terminate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Identity Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
            {staff.photo_url ? (
              <img
                src={staff.photo_url}
                alt={staff.first_name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md mb-4"
              />
            ) : (
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-md
                ${staff.is_teacher ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                {staff.first_name[0]}{staff.last_name[0]}
              </div>
            )}

            <h2 className="text-xl font-bold text-gray-900">
              {staff.first_name} {staff.last_name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{staff.designation || 'No designation'}</p>

            {/* Role Badge */}
            <div className="mt-3 flex flex-col gap-2 items-center">
              {staff.is_teacher ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  <GraduationCap className="w-3.5 h-3.5" /> Teacher
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                  <Briefcase className="w-3.5 h-3.5" /> Employee
                </span>
              )}
              <StatusBadge status={staff.status} />
            </div>

            {/* ID Codes */}
            <div className="mt-4 w-full space-y-2">
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg text-sm">
                <span className="text-gray-500">Employee ID</span>
                <span className="font-mono font-semibold text-gray-800">{staff.employee_id_code}</span>
              </div>
              {staff.is_teacher && staff.teacher_id_code && (
                <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg text-sm">
                  <span className="text-blue-600">Teacher ID</span>
                  <span className="font-mono font-semibold text-blue-800">{staff.teacher_id_code}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Contact</h3>
            <InfoRow icon={Phone} label="Phone" value={staff.phone} />
            <InfoRow icon={Mail} label="Email" value={staff.email} />
            <InfoRow icon={MapPin} label="Address" value={staff.address} />
            <InfoRow icon={Phone} label="Emergency" value={staff.emergency_contact} />
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Employment Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" /> Employment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Building2} label="Department" value={staff.department} />
              <InfoRow icon={Briefcase} label="Designation" value={staff.designation} />
              <InfoRow icon={Calendar} label="Joining Date" value={staff.joining_date} />
              <InfoRow icon={User} label="Employment Type" value={staff.employment_type?.replace('_', ' ')} />
              <InfoRow icon={DollarSign} label="Monthly Salary" value={staff.salary ? `৳ ${staff.salary.toLocaleString()}` : undefined} />
              <InfoRow icon={User} label="Gender" value={staff.gender} />
              <InfoRow icon={Calendar} label="Date of Birth" value={staff.date_of_birth} />
            </div>
          </div>

          {/* Teaching Details (only if teacher) */}
          {staff.is_teacher && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-700" /> Teaching Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={Award} label="Qualification" value={staff.qualification} />
                <InfoRow icon={Award} label="Specialization" value={staff.specialization} />
              </div>
              {!staff.qualification && !staff.specialization && (
                <p className="text-sm text-blue-600 mt-2">
                  No teaching details added yet. Edit this profile to add qualification and specialization.
                </p>
              )}
            </div>
          )}

          {/* Not a teacher? Show promote prompt */}
          {!staff.is_teacher && hasPermission('employees.edit') && (
            <button
              onClick={() => setIsPromoteOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-xl text-blue-700 hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Promote to Teacher</p>
                  <p className="text-sm text-blue-600">Assign a Teacher ID and add teaching fields</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Terminate Staff Member"
        message={`Are you sure you want to terminate ${staff.first_name} ${staff.last_name}? Their record will be preserved.`}
        confirmText="Terminate"
        isLoading={isDeleting}
      />

      <ConfirmDialog
        isOpen={isPromoteOpen}
        onClose={() => setIsPromoteOpen(false)}
        onConfirm={handlePromote}
        title="Promote to Teacher"
        message={`Promote ${staff.first_name} ${staff.last_name} to teaching staff? A Teacher ID will be auto-assigned. You can then edit their profile to add teaching details.`}
        confirmText="Promote"
        isLoading={isPromoting}
      />

      <ConfirmDialog
        isOpen={isDemoteOpen}
        onClose={() => setIsDemoteOpen(false)}
        onConfirm={handleDemote}
        title="Remove Teacher Role"
        message={`Remove the teacher role from ${staff.first_name} ${staff.last_name}? They will remain as a regular employee. Their Teacher ID will be cleared.`}
        confirmText="Remove Role"
        isLoading={isDemoting}
      />
    </div>
  );
}
