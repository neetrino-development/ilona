'use client';

import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import { useAuthStore } from '@/features/auth';
import { CalendarDays, Users, DollarSign, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function TeacherDashboardPage() {
  const t = useTranslations('dashboard');
  const tTeacher = useTranslations('teachers');
  const { user } = useAuthStore();

  const todayLessons = [
    { time: '09:00', group: 'Beginners A1 - Morning', students: 8, status: 'completed' },
    { time: '11:00', group: 'Intermediate B1', students: 10, status: 'completed' },
    { time: '14:00', group: 'Advanced C1', students: 6, status: 'in_progress' },
    { time: '16:00', group: 'Beginners A2', students: 12, status: 'scheduled' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">
          {t('welcome', { name: user?.firstName || 'Teacher' })}
        </h1>
        <p className="text-muted-foreground">Your teaching day overview</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today&apos;s Lessons
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">2 completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <p className="text-xs text-muted-foreground">Across 4 groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tTeacher('feedbackCompletion')}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month Salary
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">180,000 ֏</div>
            <p className="text-xs text-muted-foreground">-5,000 deductions</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today&apos;s Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayLessons.map((lesson, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold text-primary">{lesson.time}</div>
                  <div>
                    <p className="font-medium">{lesson.group}</p>
                    <p className="text-sm text-muted-foreground">{lesson.students} students</p>
                  </div>
                </div>
                <div>
                  {lesson.status === 'completed' && (
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </span>
                  )}
                  {lesson.status === 'in_progress' && (
                    <span className="flex items-center gap-1 text-sm text-blue-600">
                      <Clock className="h-4 w-4" />
                      In Progress
                    </span>
                  )}
                  {lesson.status === 'scheduled' && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      Scheduled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Pending Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
              <span className="text-sm">Submit feedback for Intermediate B1 (10 students)</span>
              <span className="text-xs text-orange-600">Due today</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
              <span className="text-sm">Send vocabulary for Beginners A1</span>
              <span className="text-xs text-orange-600">Due today</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

