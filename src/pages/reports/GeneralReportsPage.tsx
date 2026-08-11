import { useGetGeneralReportsQuery } from '@/features/reports/reportsApi';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function GeneralReportsPage() {
  const { data: reportsRes, isLoading } = useGetGeneralReportsQuery();
  
  if (isLoading) return <div className="p-8">Loading reports...</div>;

  const data = reportsRes?.data;
  if (!data) return <div className="p-8 text-red-500">Failed to load report data.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">General Analytical Reports</h1>
        <p className="text-sm text-gray-500">Visual breakdown of school performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview (Monthly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.attendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} name="Present %" />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Finance Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Collection vs Pending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.finance}>
              <defs>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip contentStyle={{ borderRadius: '8px' }} formatter={(value) => `$${value}`} />
              <Legend />
              <Area type="monotone" dataKey="collected" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCollected)" name="Collected" />
              <Area type="monotone" dataKey="pending" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPending)" name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
