import { useState } from 'react';
import { useCreateApplicationMutation } from '@/features/admissions/admissionsApi';
import { useNavigate } from 'react-router-dom';
import type { AdmissionApplication } from '@/types/admissions.types';

export default function NewAdmissionPage() {
  const [createApplication, { isLoading }] = useCreateApplicationMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<AdmissionApplication>>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'Male',
    phone: '',
    email: '',
    previous_school: '',
    applied_class: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createApplication(formData).unwrap();
      navigate('/admissions');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Admission Request</h1>
        <p className="text-sm text-gray-500">Submit a new student application for review</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold border-b border-gray-100 pb-2">Student Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">First Name *</label>
            <input required type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="label">Last Name *</label>
            <input required type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="label">Date of Birth *</label>
            <input required type="date" value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="label">Gender</label>
            <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="input-field">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="label">Phone Number *</label>
            <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="label">Email Address *</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="label">Applied Class *</label>
            <input required type="text" value={formData.applied_class} onChange={e => setFormData({...formData, applied_class: e.target.value})} placeholder="e.g. Class 1" className="input-field" />
          </div>
          <div>
            <label className="label">Previous School (Optional)</label>
            <input type="text" value={formData.previous_school} onChange={e => setFormData({...formData, previous_school: e.target.value})} className="input-field" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}
