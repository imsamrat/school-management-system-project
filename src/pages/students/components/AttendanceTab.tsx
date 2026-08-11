import { format } from 'date-fns';
import { useGetSingleStudentAttendanceQuery } from '@/features/attendance/attendanceApi';
import { Calendar, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';

export function AttendanceTab({ studentId }: { studentId: string }) {
  const { data: response, isLoading } = useGetSingleStudentAttendanceQuery(studentId);
  const records = response?.data || [];

  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const leaveCount = records.filter(r => r.status === 'leave').length;
  const totalDays = records.length;
  const attendancePercentage = totalDays > 0 ? Math.round(((presentCount + lateCount) / totalDays) * 100) : 0;

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-100 rounded-xl"></div>
      <div className="h-64 bg-gray-100 rounded-xl"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Percentage</p>
          <p className="text-2xl font-bold text-gray-900">{attendancePercentage}%</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <p className="text-sm text-green-600 mb-1 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Present</p>
          <p className="text-2xl font-bold text-green-700">{presentCount}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <p className="text-sm text-red-600 mb-1 flex items-center gap-1"><XCircle className="w-4 h-4"/> Absent</p>
          <p className="text-2xl font-bold text-red-700">{absentCount}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          <p className="text-sm text-yellow-600 mb-1 flex items-center gap-1"><Clock className="w-4 h-4"/> Late</p>
          <p className="text-2xl font-bold text-yellow-700">{lateCount}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-blue-600 mb-1 flex items-center gap-1"><FileText className="w-4 h-4"/> Leave</p>
          <p className="text-2xl font-bold text-blue-700">{leaveCount}</p>
        </div>
      </div>

      {/* Recent Records */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Recent Records</h4>
        {records.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            No attendance records found.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.slice(0, 30).map((record: any) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {format(new Date(record.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
