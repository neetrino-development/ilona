'use client';

import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import { useAuthStore } from '@/features/auth';
import { Users, GraduationCap, Building2, CalendarDays, DollarSign, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const t = useTranslations('dashboard');
  const { user } = useAuthStore();

  const stats = [
    {
      title: t('totalTeachers'),
      value: '12',
      icon: Users,
      change: '+2 this month',
      color: 'bg-blue-500',
    },
    {
      title: t('totalStudents'),
      value: '248',
      icon: GraduationCap,
      change: '+15 this month',
      color: 'bg-green-500',
    },
    {
      title: t('activeGroups'),
      value: '18',
      icon: Building2,
      change: '4 centers',
      color: 'bg-purple-500',
    },
    {
      title: t('todayLessons'),
      value: '24',
      icon: CalendarDays,
      change: '8 completed',
      color: 'bg-orange-500',
    },
    {
      title: t('totalIncome'),
      value: '4,500,000 ֏',
      icon: DollarSign,
      change: 'This month',
      color: 'bg-emerald-500',
    },
    {
      title: t('alerts'),
      value: '5',
      icon: AlertTriangle,
      change: 'Need attention',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">{t('welcome', { name: user?.firstName || 'Admin' })}</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: 'New student enrolled: Anna H.', time: '5 min ago' },
                { text: 'Teacher John completed lesson', time: '15 min ago' },
                { text: 'Payment received: 40,000 ֏', time: '1 hour ago' },
                { text: 'Absence marked: Student missed class', time: '2 hours ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <span className="text-sm">{item.text}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('alerts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: '3 students with overdue payments', type: 'warning' },
                { text: '2 teachers missing vocabulary today', type: 'error' },
                { text: '5 students at risk (frequent absences)', type: 'warning' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 text-sm ${
                    item.type === 'error'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-yellow-500/10 text-yellow-700'
                  }`}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

