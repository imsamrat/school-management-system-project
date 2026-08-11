import { useState, useEffect } from 'react';
import { useGetSystemSettingsQuery, useUpdateSystemSettingsMutation } from '@/features/settings/settingsApi';
import type { SystemSettings } from '@/types/settings.types';

export default function SystemSettingsPage() {
  const { data: settingsRes, isLoading } = useGetSystemSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSystemSettingsMutation();

  const [formData, setFormData] = useState<Partial<SystemSettings>>({});

  useEffect(() => {
    if (settingsRes?.data) {
      setFormData(settingsRes.data);
    }
  }, [settingsRes]);

  const handleSave = async () => {
    try {
      await updateSettings(formData).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500">Configure global application preferences</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Current Academic Year</label>
            <select 
              value={formData.academic_year || ''} 
              onChange={e => setFormData({...formData, academic_year: e.target.value})} 
              className="input-field"
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
              <option value="2027-2028">2027-2028</option>
            </select>
          </div>
          <div>
            <label className="label">Currency</label>
            <select 
              value={formData.currency || ''} 
              onChange={e => setFormData({...formData, currency: e.target.value})} 
              className="input-field"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Timezone</label>
            <select 
              value={formData.timezone || ''} 
              onChange={e => setFormData({...formData, timezone: e.target.value})} 
              className="input-field"
            >
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Dubai">Asia/Dubai</option>
              <option value="Asia/Dhaka">Asia/Dhaka</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.enable_email_notifications || false} 
              onChange={e => setFormData({...formData, enable_email_notifications: e.target.checked})}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-600"
            />
            <span className="text-sm text-gray-700">Enable Email Notifications</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.enable_sms_notifications || false} 
              onChange={e => setFormData({...formData, enable_sms_notifications: e.target.checked})}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-600"
            />
            <span className="text-sm text-gray-700">Enable SMS Notifications</span>
          </label>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button onClick={handleSave} disabled={isUpdating} className="btn-primary">
            {isUpdating ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
