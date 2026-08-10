import { useState } from 'react';
import { Save, Upload, School, MapPin, Phone, Mail, Globe, User } from 'lucide-react';

export default function SchoolProfilePage() {
  const [formData, setFormData] = useState({
    name: 'Green Valley International School',
    address: '123 Education Road, Dhanmondi',
    city: 'Dhaka',
    state: '',
    country: 'Bangladesh',
    postalCode: '1205',
    phone: '+880-2-12345678',
    email: 'info@greenvalleyschool.edu',
    website: 'www.greenvalleyschool.edu',
    principalName: 'Dr. Mohammad Rahman',
    establishedYear: '2010',
    registrationNumber: 'EIIN-12345',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Demo save
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">School Profile</h1>
          <p className="page-subtitle">Manage your school information and settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary"
          id="save-school-profile"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saved ? 'Saved ✓' : 'Save Changes'}
            </>
          )}
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          School profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo Upload */}
        <div className="card">
          <h3 className="section-title mb-4">School Logo</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-primary-50 border-2 border-dashed border-primary-200 flex items-center justify-center">
              <School className="w-10 h-10 text-primary-400" />
            </div>
            <div>
              <button type="button" className="btn-secondary">
                <Upload className="w-4 h-4" /> Upload Logo
              </button>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG or SVG. Max 2MB. Recommended: 200x200px
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="card">
          <h3 className="section-title mb-6">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="school-name" className="label">
                <School className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                School Name *
              </label>
              <input
                id="school-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="principal" className="label">
                <User className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                Principal Name
              </label>
              <input
                id="principal"
                type="text"
                value={formData.principalName}
                onChange={(e) => handleChange('principalName', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="established" className="label">
                Established Year
              </label>
              <input
                id="established"
                type="text"
                value={formData.establishedYear}
                onChange={(e) => handleChange('establishedYear', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="registration" className="label">
                Registration Number (EIIN)
              </label>
              <input
                id="registration"
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => handleChange('registrationNumber', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h3 className="section-title mb-6">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phone" className="label">
                <Phone className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                Phone
              </label>
              <input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                <Mail className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="website" className="label">
                <Globe className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                Website
              </label>
              <input
                id="website"
                type="text"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card">
          <h3 className="section-title mb-6">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="address" className="label">
                <MapPin className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                Street Address
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="input-field"
                rows={2}
              />
            </div>

            <div>
              <label htmlFor="city" className="label">City</label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="country" className="label">Country</label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="postal" className="label">Postal Code</label>
              <input
                id="postal"
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
