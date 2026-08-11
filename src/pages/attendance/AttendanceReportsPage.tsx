import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { useGetStudentAttendanceQuery } from '@/features/attendance/attendanceApi';
import { useGetClassesQuery } from '@/features/academics/academicApi';
import { DataTable, type Column } from '@/components/common/DataTable';
import { format } from 'date-fns';

const monthlyData = [
  { month: 'Jan', present: 92, absent: 8, late: 3 },
  { month: 'Feb', present: 88, absent: 12, late: 5 },
  { month: 'Mar', present: 95, absent: 5, late: 2 },
  { month: 'Apr', present: 90, absent: 10, late: 4 },
  { month: 'May', present: 93, absent: 7, late: 3 },
  { month: 'Jun', present: 91, absent: 9, late: 4 },
  { month: 'Jul', present: 89, absent: 11, late: 6 },
  { month: 'Aug', present: 94, absent: 6, late: 2 },
];

const pieData = [
  { name: 'Present', value: 92, fill: '#22c55e' },
  { name: 'Absent', value: 8, fill: '#ef4444' },
];

const classSummary = [
  { id: 'c1', class: 'Class 10', total: 40, present: 37, absent: 3, rate: 92.5 },
  { id: 'c2', class: 'Class 9', total: 38, present: 34, absent: 4, rate: 89.5 },
  { id: 'c3', class: 'Class 8', total: 35, present: 33, absent: 2, rate: 94.3 },
  { id: 'c4', class: 'Class 7', total: 40, present: 36, absent: 4, rate: 90.0 },
  { id: 'c5', class: 'Class 6', total: 42, present: 38, absent: 4, rate: 90.5 },
];

export default function AttendanceReportsPage() {
  const [period, setPeriod] = useState('monthly');
  const { data: classesRes } = useGetClassesQuery();

  const columns = [
    { header: 'Class', cell: (row: typeof classSummary[0]) => <span className="font-semibold text-gray-900">{row.class}</span> },
    { header: 'Total Students', cell: (row: typeof classSummary[0]) => row.total },
    { header: 'Present', cell: (row: typeof classSummary[0]) => <span className="text-green-600 font-semibold">{row.present}</span> },
    { header: 'Absent', cell: (row: typeof classSummary[0]) => <span className="text-red-600 font-semibold">{row.absent}</span> },
    { header: 'Attendance Rate', cell: (row: typeof classSummary[0]) => (
      <div className="flex items-center gap-2">
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${row.rate >= 90 ? 'bg-green-500' : row.rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${row.rate}%` }}
          />
        </div>
        <span className="text-sm font-bold">{row.rate}%</span>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
          <p className="text-sm text-gray-500">Comprehensive analysis of student and staff attendance</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="input-field max-w-[160px]">
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Attendance Rate', value: '91.8%', color: 'text-green-600' },
          { label: 'Total Present (Today)', value: '195', color: 'text-blue-600' },
          { label: 'Total Absent (Today)', value: '10', color: 'text-red-600' },
          { label: 'Students on Leave', value: '5', color: 'text-amber-600' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
            <p className={`text-3xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance Trend (%)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} name="Present %" />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Class-wise Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Class-Wise Attendance Summary</h2>
        </div>
        <DataTable
          columns={columns as any}
          data={classSummary}
          keyExtractor={(row) => row.id}
          isLoading={false}
        />
      </div>
    </div>
  );
}
