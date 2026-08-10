import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Save } from 'lucide-react';
import { useGetEmployeeAttendanceQuery, useMarkEmployeeAttendanceMutation } from '@/features/attendance/attendanceApi';
import { useGetEmployeesQuery } from '@/features/employees/employeeApi';
import { DatePicker } from '@/components/common/DatePicker';
import { BulkActionToolbar } from '@/components/common/BulkActionToolbar';
import { usePermission } from '@/hooks/usePermission';

export default function EmployeeAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { data: employeesRes } = useGetEmployeesQuery({});
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const { data: attendanceRes, isLoading: isLoadingAtt } = useGetEmployeeAttendanceQuery({ date: dateStr });
  const [markAttendance, { isLoading: isSaving }] = useMarkEmployeeAttendanceMutation();
  
  const { hasPermission } = usePermission();
  const canMark = hasPermission('attendance.mark');

  const employees = employeesRes?.data || [];
  const existingAttendance = attendanceRes?.data || [];

  const [localState, setLocalState] = useState<Record<string, string>>({});

  useEffect(() => {
    const newState: Record<string, string> = {};
    existingAttendance.forEach(a => {
      if (a.employee_id) newState[a.employee_id] = a.status;
    });
    setLocalState(newState);
  }, [existingAttendance, dateStr]);

  const handleStatusChange = (empId: string, status: string) => {
    setLocalState(prev => ({ ...prev, [empId]: status }));
  };

  const handleBulk = (status: string) => {
    const newState: Record<string, string> = {};
    employees.forEach(e => { newState[e.id] = status; });
    setLocalState(newState);
  };

  const handleSave = async () => {
    const records = Object.entries(localState).map(([employee_id, status]) => ({ employee_id, status }));
    if (records.length === 0) return;
    
    try {
      await markAttendance({ date: dateStr, records }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employee Attendance</h1>
        <p className="text-sm text-gray-500">Mark and manage daily non-teaching staff attendance</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-end">
        <div className="w-48">
          <label className="label">Date</label>
          <DatePicker date={selectedDate} onChange={setSelectedDate} maxDate={new Date()} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <BulkActionToolbar 
            onMarkAllPresent={() => handleBulk('present')}
            onMarkAllAbsent={() => handleBulk('absent')}
            disabled={!canMark || employees.length === 0}
          />
          {canMark && (
            <button 
              onClick={handleSave} 
              disabled={isSaving || employees.length === 0}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Attendance
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Employee ID</th>
                <th className="px-6 py-3">Employee Name</th>
                <th className="px-6 py-3">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoadingAtt ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No employees found.</td></tr>
              ) : (
                employees.map(employee => (
                  <tr key={employee.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 font-mono">{employee.employee_id_code}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {['present', 'absent', 'late', 'leave'].map(status => (
                          <button
                            key={status}
                            disabled={!canMark}
                            onClick={() => handleStatusChange(employee.id, status)}
                            className={`px-3 py-1.5 rounded text-xs font-medium capitalize border transition-colors ${
                              localState[employee.id] === status
                                ? status === 'present' ? 'bg-green-100 text-green-700 border-green-200'
                                : status === 'absent' ? 'bg-red-100 text-red-700 border-red-200'
                                : status === 'late' ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                : 'bg-blue-100 text-blue-700 border-blue-200'
                              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
