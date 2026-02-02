'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { UserRole } from '@ilona/types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Settings,
  DollarSign,
  BookOpen,
  ClipboardList,
  Mic,
  Clock,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  key: string;
  href: string;
  icon: LucideIcon;
}

const adminNavItems: NavItem[] = [
  { key: 'dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { key: 'teachers', href: '/admin/teachers', icon: Users },
  { key: 'students', href: '/admin/students', icon: GraduationCap },
  { key: 'groups', href: '/admin/groups', icon: Building2 },
  { key: 'centers', href: '/admin/centers', icon: Building2 },
  { key: 'calendar', href: '/admin/calendar', icon: CalendarDays },
  { key: 'attendance', href: '/admin/attendance', icon: ClipboardList },
  { key: 'finance', href: '/admin/finance', icon: DollarSign },
  { key: 'analytics', href: '/admin/analytics', icon: BarChart3 },
  { key: 'chat', href: '/admin/chat', icon: MessageSquare },
  { key: 'settings', href: '/admin/settings', icon: Settings },
];

const teacherNavItems: NavItem[] = [
  { key: 'dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
  { key: 'dailyPlan', href: '/teacher/daily-plan', icon: Clock },
  { key: 'students', href: '/teacher/students', icon: GraduationCap },
  { key: 'attendance', href: '/teacher/attendance', icon: ClipboardList },
  { key: 'calendar', href: '/teacher/calendar', icon: CalendarDays },
  { key: 'salary', href: '/teacher/salary', icon: DollarSign },
  { key: 'analytics', href: '/teacher/analytics', icon: BarChart3 },
  { key: 'chat', href: '/teacher/chat', icon: MessageSquare },
  { key: 'settings', href: '/teacher/settings', icon: Settings },
];

const studentNavItems: NavItem[] = [
  { key: 'dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { key: 'lessons', href: '/student/lessons', icon: BookOpen },
  { key: 'recordings', href: '/student/recordings', icon: Mic },
  { key: 'payments', href: '/student/payments', icon: DollarSign },
  { key: 'absence', href: '/student/absence', icon: ClipboardList },
  { key: 'analytics', href: '/student/analytics', icon: BarChart3 },
  { key: 'chat', href: '/student/chat', icon: MessageSquare },
  { key: 'settings', href: '/student/settings', icon: Settings },
];

const navItemsByRole: Record<UserRole, NavItem[]> = {
  ADMIN: adminNavItems,
  TEACHER: teacherNavItems,
  STUDENT: studentNavItems,
};

interface SidebarProps {
  role: UserRole;
  locale: string;
}

export function Sidebar({ role, locale }: SidebarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const navItems = navItemsByRole[role];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href={`/${locale}/${role.toLowerCase()}/dashboard`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">I</span>
          </div>
          <span className="text-lg font-semibold">Ilona</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

