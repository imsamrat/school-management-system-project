import { useAuth } from '@/hooks/useAuth';
import { getGreeting, formatCurrency, formatNumber, formatPercentage } from '@/utils/format';
import KPICard from '@/components/common/KPICard';
import { useGetDashboardMetricsQuery } from '@/features/dashboard/dashboardApi';
import {
  Users,
  GraduationCap,
  Briefcase,
  CalendarCheck,
  DollarSign,
  Receipt,
  UserCheck,
  UserX,
  Clock,
  ClipboardList,
  UserPlus,
  Plus,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// Demo data — will come from API in production
const enrollmentData = [
  { month: 'Jan', students: 180 },
  { month: 'Feb', students: 185 },
  { month: 'Mar', students: 190 },
  { month: 'Apr', students: 192 },
  { month: 'May', students: 195 },
  { month: 'Jun', students: 198 },
  { month: 'Jul', students: 200 },
  { month: 'Aug', students: 210 },
];

const attendanceData = [
  { month: 'Jan', present: 92, absent: 8 },
  { month: 'Feb', present: 88, absent: 12 },
  { month: 'Mar', present: 95, absent: 5 },
  { month: 'Apr', present: 90, absent: 10 },
  { month: 'May', present: 93, absent: 7 },
  { month: 'Jun', present: 91, absent: 9 },
  { month: 'Jul', present: 89, absent: 11 },
  { month: 'Aug', present: 94, absent: 6 },
];

const feeCollectionData = [
  { month: 'Jan', collected: 450000, pending: 120000 },
  { month: 'Feb', collected: 520000, pending: 95000 },
  { month: 'Mar', collected: 480000, pending: 130000 },
  { month: 'Apr', collected: 550000, pending: 80000 },
  { month: 'May', collected: 510000, pending: 110000 },
  { month: 'Jun', collected: 490000, pending: 100000 },
  { month: 'Jul', collected: 530000, pending: 90000 },
  { month: 'Aug', collected: 560000, pending: 75000 },
];

const classDistribution = [
  { name: 'Play Group', value: 18, fill: '#22c55e' },
  { name: 'Nursery', value: 32, fill: '#3b82f6' },
  { name: 'KG', value: 28, fill: '#f59e0b' },
  { name: 'Class 1', value: 40, fill: '#8b5cf6' },
  { name: 'Class 2', value: 35, fill: '#ec4899' },
  { name: 'Class 3', value: 30, fill: '#06b6d4' },
  { name: 'Class 4', value: 15, fill: '#f97316' },
  { name: 'Class 5', value: 12, fill: '#14b8a6' },
];

const upcomingEvents = [
  { title: 'Mid Term Examination', date: '15 Aug 2026', type: 'exam' },
  { title: 'Parent-Teacher Meeting', date: '20 Aug 2026', type: 'event' },
  { title: 'Monthly Fee Due Date', date: '10 Sep 2026', type: 'finance' },
  { title: 'Annual Sports Day', date: '25 Sep 2026', type: 'event' },
];

const quickActions = [
  { label: 'Add Student', icon: UserPlus, href: '/students/new', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
  { label: 'Add Teacher', icon: Users, href: '/teachers/new', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
  { label: 'Collect Fee', icon: Receipt, href: '/finance/collect', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
  { label: 'Mark Attendance', icon: CalendarCheck, href: '/attendance/students', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
  { label: 'Enter Marks', icon: ClipboardList, href: '/exams/marks', color: 'bg-pink-50 text-pink-700 hover:bg-pink-100' },
  { label: 'Process Payroll', icon: DollarSign, href: '/payroll/process', color: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: response } = useGetDashboardMetricsQuery();

  const stats = response?.data || {
    totalStudents: 0,
    activeTeachers: 0,
    totalEmployees: 0,
    todayAttendance: 0,
    pendingFees: 0,
    todayCollection: 0,
    booksIssued: 0,
    recentActivities: []
  };

  const recentActivities = stats.recentActivities && stats.recentActivities.length > 0 
    ? stats.recentActivities.map(a => ({ text: a.action, time: a.time, type: a.type }))
    : [];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="page-title">
          {getGreeting()}, {user?.fullName?.split(' ')[0] || 'Admin'} 👋
        </h1>
        <p className="page-subtitle">
          Here's what's happening at your school today.
        </p>
      </div>

      {/* KPI Cards — Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Students"
          value={formatNumber(stats.totalStudents)}
          icon={GraduationCap}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          trend={{ value: 5.2, isPositive: true, label: 'vs last month' }}
        />
        <KPICard
          title="Active Teachers"
          value={formatNumber(stats.activeTeachers)}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Total Employees"
          value={formatNumber(stats.totalEmployees)}
          icon={Briefcase}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KPICard
          title="Today's Attendance"
          value={formatPercentage(stats.todayAttendance)}
          icon={CalendarCheck}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          trend={{ value: 2.1, isPositive: true, label: 'vs yesterday' }}
        />
        <KPICard
          title="Pending Fees"
          value={formatCurrency(stats.pendingFees)}
          icon={DollarSign}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <KPICard
          title="Today's Collection"
          value={formatCurrency(stats.todayCollection)}
          icon={Receipt}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          trend={{ value: 12.3, isPositive: true, label: 'vs yesterday' }}
        />
      </div>

      {/* KPI Cards — Row 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="card-compact flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <UserCheck className="w-4.5 h-4.5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Present Today</p>
            <p className="text-lg font-bold text-gray-900">195</p>
          </div>
        </div>
        <div className="card-compact flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <UserX className="w-4.5 h-4.5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Absent Today</p>
            <p className="text-lg font-bold text-gray-900">10</p>
          </div>
        </div>
        <div className="card-compact flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
            <Clock className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Late Today</p>
            <p className="text-lg font-bold text-gray-900">5</p>
          </div>
        </div>
        <div className="card-compact flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <ClipboardList className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Upcoming Exams</p>
            <p className="text-lg font-bold text-gray-900">2</p>
          </div>
        </div>
        <div className="card-compact flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <UserPlus className="w-4.5 h-4.5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending Admissions</p>
            <p className="text-lg font-bold text-gray-900">3</p>
          </div>
        </div>
      </div>

      {/* Charts — Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Student Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={enrollmentData}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="students"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#colorStudents)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Trend */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} name="Present %" />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts — Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Collection */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Fee Collection Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={feeCollectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${(v / 1000)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => [formatCurrency(Number(value)), '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="collected" fill="#22c55e" radius={[4, 4, 0, 0]} name="Collected" />
              <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student Distribution */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Students by Class</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={classDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {classDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            {classDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
                <span className="text-gray-600 truncate">{entry.name}</span>
                <span className="text-gray-900 font-medium ml-auto">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.href)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${action.color}`}
              >
                <action.icon className="w-4 h-4 shrink-0" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Recent Activities</h3>
            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 leading-relaxed">{activity.text}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Upcoming Events</h3>
            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-medium text-gray-500 leading-none">
                    {event.date.split(' ')[1]}
                  </span>
                  <span className="text-sm font-bold text-gray-900 leading-tight">
                    {event.date.split(' ')[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{event.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
