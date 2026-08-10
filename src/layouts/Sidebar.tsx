import { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePermission } from '@/hooks/usePermission';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  Briefcase,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  DollarSign,
  Wallet,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  UserPlus,
  School,
  X,
  type LucideIcon,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  icon?: LucideIcon;
  href?: string;
  permission?: string;
  children?: {
    label: string;
    href: string;
    permission?: string;
  }[];
}

const sidebarConfig: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    permission: 'dashboard.view',
  },
  {
    label: 'Admissions',
    icon: UserPlus,
    permission: 'admissions.view',
    children: [
      { label: 'Applications', href: '/admissions', permission: 'admissions.view' },
      { label: 'New Admission', href: '/admissions/new', permission: 'admissions.manage' },
    ],
  },
  {
    label: 'Students',
    icon: GraduationCap,
    permission: 'students.view',
    children: [
      { label: 'All Students', href: '/students', permission: 'students.view' },
      { label: 'Add Student', href: '/students/new', permission: 'students.create' },
      { label: 'Student ID Cards', href: '/documents/id-cards', permission: 'documents.manage' },
    ],
  },
  {
    label: 'Teachers',
    icon: Users,
    permission: 'teachers.view',
    children: [
      { label: 'Teacher Register', href: '/teachers', permission: 'teachers.view' },
      { label: 'Add Teacher', href: '/teachers/new', permission: 'teachers.create' },
    ],
  },
  {
    label: 'Employees',
    icon: Briefcase,
    permission: 'employees.view',
    children: [
      { label: 'Employee Register', href: '/employees', permission: 'employees.view' },
      { label: 'Add Employee', href: '/employees/new', permission: 'employees.create' },
    ],
  },
  {
    label: 'Academics',
    icon: BookOpen,
    permission: 'dashboard.view',
    children: [
      { label: 'Academic Year', href: '/academics/years' },
      { label: 'Classes', href: '/academics/classes' },
      { label: 'Subjects', href: '/academics/subjects' },
      { label: 'Course Assignment', href: '/academics/assignments' },
      { label: 'Class Routine', href: '/academics/routine' },
    ],
  },
  {
    label: 'Attendance',
    icon: CalendarCheck,
    permission: 'attendance.view',
    children: [
      { label: 'Student Attendance', href: '/attendance/students', permission: 'attendance.view' },
      { label: 'Teacher Attendance', href: '/attendance/teachers', permission: 'attendance.view' },
      { label: 'Employee Attendance', href: '/attendance/employees', permission: 'attendance.view' },
      { label: 'Attendance Reports', href: '/attendance/reports', permission: 'reports.view' },
    ],
  },
  {
    label: 'Examinations',
    icon: ClipboardList,
    permission: 'exams.view',
    children: [
      { label: 'Exam Setup', href: '/exams', permission: 'exams.view' },
      { label: 'Exam Schedule', href: '/exams/schedule', permission: 'exams.view' },
      { label: 'Marks Entry', href: '/exams/marks', permission: 'marks.enter' },
      { label: 'Result Processing', href: '/exams/results', permission: 'marks.publish' },
      { label: 'Report Cards', href: '/exams/report-cards', permission: 'marks.view' },
    ],
  },
  {
    label: 'Finance',
    icon: DollarSign,
    permission: 'fees.view',
    children: [
      { label: 'Fee Structure', href: '/finance/fee-structure', permission: 'fees.view' },
      { label: 'Student Fees', href: '/finance/student-fees', permission: 'fees.view' },
      { label: 'Collect Fees', href: '/finance/collect', permission: 'fees.collect' },
      { label: 'Payment History', href: '/finance/payments', permission: 'fees.view' },
      { label: 'Fee Reports', href: '/finance/reports', permission: 'fees.report' },
      { label: 'Refunds', href: '/finance/refunds', permission: 'fees.refund' },
    ],
  },
  {
    label: 'Payroll',
    icon: Wallet,
    permission: 'payroll.view',
    children: [
      { label: 'Salary Structure', href: '/payroll/salary-structure', permission: 'payroll.view' },
      { label: 'Process Payroll', href: '/payroll/process', permission: 'payroll.process' },
      { label: 'Payslips', href: '/payroll/payslips', permission: 'payroll.view' },
      { label: 'Payroll Reports', href: '/payroll/reports', permission: 'payroll.view' },
    ],
  },
  {
    label: 'Documents',
    icon: FileText,
    permission: 'documents.manage',
    children: [
      { label: 'Admit Cards', href: '/documents/admit-cards' },
      { label: 'ID Cards', href: '/documents/id-cards' },
      { label: 'Certificates', href: '/documents/certificates' },
    ],
  },
  {
    label: 'Reports',
    icon: BarChart3,
    permission: 'reports.view',
    children: [
      { label: 'Student Reports', href: '/reports/students', permission: 'reports.view' },
      { label: 'Attendance Reports', href: '/reports/attendance', permission: 'reports.view' },
      { label: 'Academic Reports', href: '/reports/academic', permission: 'reports.view' },
      { label: 'Finance Reports', href: '/reports/finance', permission: 'reports.view' },
      { label: 'Payroll Reports', href: '/reports/payroll', permission: 'reports.view' },
    ],
  },
  {
    label: 'Settings',
    icon: Settings,
    permission: 'settings.manage',
    children: [
      { label: 'School Profile', href: '/settings/school', permission: 'settings.manage' },
      { label: 'Academic Settings', href: '/settings/academic', permission: 'settings.manage' },
      { label: 'Fee Settings', href: '/settings/fees', permission: 'settings.manage' },
      { label: 'Users & Roles', href: '/settings/users', permission: 'users.manage' },
      { label: 'Audit Logs', href: '/settings/audit-logs', permission: 'audit.view' },
      { label: 'System Settings', href: '/settings/system', permission: 'settings.manage' },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { hasPermission } = usePermission();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    // Auto-expand the section containing the current route
    const expanded = new Set<string>();
    for (const item of sidebarConfig) {
      if (item.children?.some((child) => location.pathname === child.href)) {
        expanded.add(item.label);
      }
    }
    return expanded;
  });

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    return sidebarConfig
      .filter((item) => !item.permission || hasPermission(item.permission))
      .map((item) => ({
        ...item,
        children: item.children?.filter(
          (child) => !child.permission || hasPermission(child.permission)
        ),
      }));
  }, [hasPermission]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-[var(--sidebar-width)] bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-[var(--header-height)] flex items-center justify-between px-5 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <School className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Green Valley</h1>
              <p className="text-[10px] text-gray-400 leading-tight">School ERP</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <ul className="space-y-0.5">
            {filteredItems.map((item) => (
              <li key={item.label}>
                {item.href && !item.children ? (
                  <NavLink
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )
                    }
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          'w-[18px] h-[18px] shrink-0',
                          location.pathname === item.href
                            ? 'text-primary-600'
                            : 'text-gray-400'
                        )}
                      />
                    )}
                    {item.label}
                  </NavLink>
                ) : (
                  <>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        item.children?.some((c) => location.pathname === c.href)
                          ? 'text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      {item.icon && (
                        <item.icon
                          className={cn(
                            'w-[18px] h-[18px] shrink-0',
                            item.children?.some((c) => location.pathname === c.href)
                              ? 'text-primary-600'
                              : 'text-gray-400'
                          )}
                        />
                      )}
                      <span className="flex-1 text-left">{item.label}</span>
                      {expandedItems.has(item.label) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {expandedItems.has(item.label) && item.children && (
                      <ul className="mt-0.5 ml-[30px] border-l border-gray-100 pl-3 space-y-0.5">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <NavLink
                              to={child.href}
                              onClick={onClose}
                              className={({ isActive }) =>
                                cn(
                                  'block px-3 py-1.5 rounded-md text-sm transition-colors',
                                  isActive
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                )
                              }
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 shrink-0">
          <p className="text-[11px] text-gray-400 text-center">
            © 2026 Green Valley International School
          </p>
        </div>
      </aside>
    </>
  );
}
