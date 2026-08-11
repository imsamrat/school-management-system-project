import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, GraduationCap } from 'lucide-react';
import { useCreateStaffMutation } from '@/features/staff/staffApi';
import { ImageUpload } from '@/components/common/ImageUpload';

export default function StaffFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [createStaff, { isLoading }] = useCreateStaffMutation();

  const defaultIsTeacher = searchParams.get('role') === 'teacher';

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'male',
    date_of_birth: '',
    address: '',
    joining_date: new Date().toISOString().split('T')[0],
    employment_type: 'full_time',
    department: '',
    designation: '',
    salary: '',
    emergency_contact: '',
    photo_url: '',
    is_teacher: defaultIsTeacher,
    // Teacher-specific
    teacher_id_code: '',
    employee_id_code: '',
    qualification: '',
    specialization: '',
  });

  useEffect(() => {
    if (defaultIsTeacher) {
      setFormData(prev => ({ ...prev, is_teacher: true }));
    }
  }, [defaultIsTeacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        is_teacher: formData.is_teacher,
      };
      // Only include teacher fields if is_teacher
      if (!formData.is_teacher) {
        delete payload.teacher_id_code;
        delete payload.qualification;
        delete payload.specialization;
      }
      await createStaff(payload).unwrap();
      navigate('/staff');
    } catch (error) {
      console.error('Failed to create staff:', error);
    }
  };

  const sectionClass = 'text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/staff')}
          className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {formData.is_teacher ? 'Add New Teacher' : 'Add New Employee'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {formData.is_teacher
              ? 'Register a new teaching staff member'
              : 'Register a new non-teaching staff member'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">

          {/* ── Is Teacher Toggle ─────────────────────── */}
          <div className="flex items-center justify-between p-4 rounded-xl border-2 transition-all
            bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Teaching Staff</p>
                <p className="text-sm text-gray-500">
                  Enable if this person is a teacher. This will unlock teacher-specific fields.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                name="is_teacher"
                checked={formData.is_teacher}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* ── Photo ─────────────────────────────────── */}
          <div>
            <h3 className={sectionClass}>Profile Photo</h3>
            <ImageUpload
              value={formData.photo_url}
              onChange={(url) => setFormData(prev => ({ ...prev, photo_url: url }))}
              label="Staff Photo"
            />
          </div>

          {/* ── Personal Info ─────────────────────────── */}
          <div>
            <h3 className={sectionClass}>Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">First Name *</label>
                <input required type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="input-field" placeholder="e.g. John" />
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input required type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="input-field" placeholder="e.g. Doe" />
              </div>
              <div>
                <label className="label">Gender *</label>
                <select required name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Date of Birth</label>
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="e.g. +880 1712 345678" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="e.g. john@school.edu" />
              </div>
              <div className="md:col-span-2">
                <label className="label">Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="input-field resize-none" rows={2} placeholder="Home address..." />
              </div>
            </div>
          </div>

          {/* ── Employment Details ────────────────────── */}
          <div>
            <h3 className={sectionClass}>Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Employee ID</label>
                <input type="text" name="employee_id_code" value={formData.employee_id_code} onChange={handleChange} className="input-field" placeholder="e.g. EMP-001 (auto-generated if blank)" />
              </div>
              <div>
                <label className="label">Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className="input-field" placeholder="e.g. Mathematics" />
              </div>
              <div>
                <label className="label">Designation</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="input-field" placeholder="e.g. Senior Teacher" />
              </div>
              <div>
                <label className="label">Employment Type</label>
                <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="input-field">
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="visiting">Visiting</option>
                </select>
              </div>
              <div>
                <label className="label">Joining Date</label>
                <input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label">Monthly Salary (৳)</label>
                <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="input-field" placeholder="e.g. 25000" />
              </div>
              <div>
                <label className="label">Emergency Contact</label>
                <input type="tel" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} className="input-field" placeholder="Emergency phone number" />
              </div>
            </div>
          </div>

          {/* ── Teacher-specific Fields ───────────────── */}
          {formData.is_teacher && (
            <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50/40 space-y-4">
              <h3 className={`${sectionClass} text-blue-800`}>
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Teaching Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Teacher ID</label>
                  <input type="text" name="teacher_id_code" value={formData.teacher_id_code} onChange={handleChange} className="input-field" placeholder="e.g. TCH-001 (auto-generated if blank)" />
                </div>
                <div>
                  <label className="label">Specialization</label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="input-field" placeholder="e.g. Algebra, Literature" />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Qualification</label>
                  <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="input-field" placeholder="e.g. M.Sc. in Physics, B.Ed." />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/staff')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {formData.is_teacher ? 'Save Teacher' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
