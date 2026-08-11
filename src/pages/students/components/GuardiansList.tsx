import { useState } from 'react';
import { User, Phone, MapPin, Plus, Trash2, Mail, Briefcase, AlertTriangle } from 'lucide-react';
import { useGetStudentGuardiansQuery, useAddStudentGuardianMutation, useDeleteStudentGuardianMutation } from '@/features/students/studentApi';
import { usePermission } from '@/hooks/usePermission';

interface GuardiansListProps {
  studentId: string;
}

export function GuardiansList({ studentId }: GuardiansListProps) {
  const { data: response, isLoading } = useGetStudentGuardiansQuery(studentId);
  const [deleteGuardian, { isLoading: isDeleting }] = useDeleteStudentGuardianMutation();
  const { hasPermission } = usePermission();
  const [isAdding, setIsAdding] = useState(false);
  
  const guardians = response?.data || [];

  const handleDelete = async (guardianId: string) => {
    if (confirm('Are you sure you want to remove this guardian?')) {
      await deleteGuardian({ guardianId, studentId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Guardian Details</h3>
        {hasPermission('students.edit') && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="btn-secondary flex items-center gap-2 text-sm py-1.5"
          >
            <Plus className="w-4 h-4" /> Add Guardian
          </button>
        )}
      </div>

      {isAdding && (
        <AddGuardianForm 
          studentId={studentId} 
          onCancel={() => setIsAdding(false)} 
        />
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-100 rounded-lg"></div>
        </div>
      ) : guardians.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          No guardians added yet.
        </div>
      ) : (
        <div className="space-y-4">
          {guardians.map(guardian => (
            <div key={guardian.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-start justify-between gap-4 group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{guardian.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">
                      {guardian.relation}
                    </span>
                    {guardian.is_primary && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">Primary</span>
                    )}
                    {guardian.emergency_contact && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Emergency
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    {guardian.phone && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" /> {guardian.phone}
                      </p>
                    )}
                    {guardian.email && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" /> {guardian.email}
                      </p>
                    )}
                    {guardian.occupation && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" /> {guardian.occupation}
                      </p>
                    )}
                    {guardian.address && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" /> {guardian.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {hasPermission('students.edit') && (
                <button 
                  onClick={() => handleDelete(guardian.id)}
                  disabled={isDeleting}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove Guardian"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddGuardianForm({ studentId, onCancel }: { studentId: string; onCancel: () => void }) {
  const [addGuardian, { isLoading }] = useAddStudentGuardianMutation();
  const [formData, setFormData] = useState({
    name: '',
    relation: 'father',
    phone: '',
    email: '',
    occupation: '',
    address: '',
    is_primary: false,
    emergency_contact: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGuardian({ studentId, body: formData }).unwrap();
      onCancel();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
      <h4 className="font-medium text-gray-900 mb-2">Add New Guardian</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Name *</label>
          <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="label">Relation *</label>
          <select required className="input-field" value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value})}>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="guardian">Guardian</option>
            <option value="sibling">Sibling</option>
          </select>
        </div>
        <div>
          <label className="label">Phone</label>
          <input type="tel" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="label">Occupation</label>
          <input type="text" className="input-field" value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} />
        </div>
        <div>
          <label className="label">Address</label>
          <input type="text" className="input-field" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.is_primary} onChange={e => setFormData({...formData, is_primary: e.target.checked})} className="rounded text-primary-600 focus:ring-primary-500" />
          <span className="text-sm text-gray-700">Primary Guardian</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.emergency_contact} onChange={e => setFormData({...formData, emergency_contact: e.target.checked})} className="rounded text-primary-600 focus:ring-primary-500" />
          <span className="text-sm text-gray-700">Emergency Contact</span>
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary py-1.5">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn-primary py-1.5">Save Guardian</button>
      </div>
    </form>
  );
}
