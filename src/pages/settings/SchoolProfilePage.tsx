import { useState, useEffect } from 'react';
import { useGetSchoolProfileQuery, useUpdateSchoolProfileMutation } from '@/features/settings/settingsApi';
import type { SchoolProfile } from '@/types/settings.types';

export default function SchoolProfilePage() {
  const { data: profileRes, isLoading } = useGetSchoolProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateSchoolProfileMutation();

  const [formData, setFormData] = useState<Partial<SchoolProfile>>({});

  useEffect(() => {
    if (profileRes?.data) {
      setFormData(profileRes.data);
    }
  }, [profileRes]);

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">School Profile</h1>
        <p className="text-sm text-gray-500">Update the primary details of the institution</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
          <img 
            src={formData.logo_url} 
            alt="School Logo" 
            className="w-24 h-24 rounded-full border border-gray-200 object-cover"
          />
          <div>
            <label className="label">Logo URL</label>
            <input 
              type="text" 
              value={formData.logo_url || ''} 
              onChange={e => setFormData({...formData, logo_url: e.target.value})} 
              className="input-field w-[400px]"
            />
            <p className="text-xs text-gray-400 mt-1">Provide a valid image URL for the school logo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">School Name</label>
            <input 
              type="text" 
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Established Year</label>
            <input 
              type="number" 
              value={formData.established_year || ''} 
              onChange={e => setFormData({...formData, established_year: Number(e.target.value)})} 
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input 
              type="email" 
              value={formData.email || ''} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input 
              type="text" 
              value={formData.phone || ''} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              className="input-field"
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Website</label>
            <input 
              type="url" 
              value={formData.website || ''} 
              onChange={e => setFormData({...formData, website: e.target.value})} 
              className="input-field"
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Physical Address</label>
            <textarea 
              value={formData.address || ''} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              className="input-field"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button onClick={handleSave} disabled={isUpdating} className="btn-primary">
            {isUpdating ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
