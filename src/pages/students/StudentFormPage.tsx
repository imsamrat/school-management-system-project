import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateStudentMutation } from '@/features/students/studentApi';
import { ArrowLeft, Save } from 'lucide-react';
import { ImageUpload } from '@/components/common/ImageUpload';

export default function StudentFormPage() {
  const navigate = useNavigate();
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    admission_number: '',
    gender: 'male',
    class_id: 'c1',
    section_id: 'sec1',
    photo_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStudent(formData).unwrap();
      navigate('/students');
    } catch (error) {
      console.error('Failed to create student:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/students')}
          className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">New Admission</h1>
          <p className="text-sm text-gray-500 mt-1">Enroll a new student into the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          {/* Personal Info Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Personal Information
            </h3>
            <div className="mb-6">
              <ImageUpload
                value={formData.photo_url}
                onChange={(url) => setFormData(prev => ({ ...prev, photo_url: url }))}
                label="Student Photo"
              />
            </div>
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
            </div>
          </div>

          {/* Academic Info Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Academic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Admission Number *</label>
                <input required type="text" name="admission_number" value={formData.admission_number} onChange={handleChange} className="input-field" placeholder="e.g. ADM-2024-101" />
              </div>
              <div>
                <label className="label">Class *</label>
                <select required name="class_id" value={formData.class_id} onChange={handleChange} className="input-field">
                  <option value="c1">Class 1</option>
                  <option value="c2">Class 2</option>
                </select>
              </div>
              <div>
                <label className="label">Section *</label>
                <select required name="section_id" value={formData.section_id} onChange={handleChange} className="input-field">
                  <option value="sec1">Section A</option>
                  <option value="sec2">Section B</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/students')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Student
          </button>
        </div>
      </form>
    </div>
  );
}
