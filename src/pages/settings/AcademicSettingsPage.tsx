import { useState } from 'react';
import { Save, BookOpen, Calendar, Clock, GraduationCap } from 'lucide-react';

interface AcademicSettings {
  default_class_duration: number;
  periods_per_day: number;
  working_days: string[];
  school_start_time: string;
  school_end_time: string;
  grading_system: 'percentage' | 'gpa' | 'letter';
  pass_percentage: number;
  session_start_month: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AcademicSettingsPage() {
  const [formData, setFormData] = useState<AcademicSettings>({
    default_class_duration: 45,
    periods_per_day: 8,
    working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    school_start_time: '08:00',
    school_end_time: '15:00',
    grading_system: 'percentage',
    pass_percentage: 40,
    session_start_month: 'April',
  });
  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) => {
    const days = formData.working_days.includes(day)
      ? formData.working_days.filter(d => d !== day)
      : [...formData.working_days, day];
    setFormData({ ...formData, working_days: days });
  };

  const handleSave = () => {
    // In production this would call an API mutation
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Academic Settings</h1>
        <p className="text-sm text-gray-500">Configure class schedules, grading, and academic calendar</p>
      </div>

      {/* Schedule Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Class Schedule</h2>
            <p className="text-xs text-gray-500">Configure daily timing and periods</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">School Start Time</label>
            <input type="time" value={formData.school_start_time} onChange={e => setFormData({ ...formData, school_start_time: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">School End Time</label>
            <input type="time" value={formData.school_end_time} onChange={e => setFormData({ ...formData, school_end_time: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">Period Duration (minutes)</label>
            <input type="number" min="20" max="120" value={formData.default_class_duration} onChange={e => setFormData({ ...formData, default_class_duration: +e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">Periods Per Day</label>
            <input type="number" min="4" max="12" value={formData.periods_per_day} onChange={e => setFormData({ ...formData, periods_per_day: +e.target.value })} className="input-field" />
          </div>
        </div>
      </div>

      {/* Working Days */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Working Days</h2>
            <p className="text-xs text-gray-500">Select which days school is in session</p>
          </div>
        </div>
        <div className="p-6 flex flex-wrap gap-3">
          {DAYS.map(day => {
            const selected = formData.working_days.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                  selected
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-200 hover:bg-primary-50'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grading System */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Grading & Examinations</h2>
            <p className="text-xs text-gray-500">Configure how student performance is assessed</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">Grading System</label>
            <select value={formData.grading_system} onChange={e => setFormData({ ...formData, grading_system: e.target.value as any })} className="input-field">
              <option value="percentage">Percentage (%)</option>
              <option value="gpa">GPA (4.0 Scale)</option>
              <option value="letter">Letter Grade (A-F)</option>
            </select>
          </div>
          <div>
            <label className="label">Pass Percentage (%)</label>
            <input type="number" min="0" max="100" value={formData.pass_percentage} onChange={e => setFormData({ ...formData, pass_percentage: +e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">Session Start Month</label>
            <select value={formData.session_start_month} onChange={e => setFormData({ ...formData, session_start_month: e.target.value })} className="input-field">
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
