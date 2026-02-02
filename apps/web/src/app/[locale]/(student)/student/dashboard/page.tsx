'use client';

import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import { useAuthStore } from '@/features/auth';
import { CalendarDays, BookOpen, DollarSign, CheckCircle, Clock, Mic } from 'lucide-react';

export default function StudentDashboardPage() {
  const t = useTranslations('dashboard');
  const { user } = useAuthStore();

  const upcomingLessons = [
    { date: 'Today', time: '14:00', topic: 'Present Perfect Tense', teacher: 'John Smith' },
    { date: 'Tomorrow', time: '14:00', topic: 'Vocabulary: Travel', teacher: 'John Smith' },
    { date: 'Wed', time: '14:00', topic: 'Reading Comprehension', teacher: 'John Smith' },
  ];

  const recentRecordings = [
    { date: 'Feb 1', topic: 'Daily Vocabulary: Food', duration: '2:30' },
    { date: 'Jan 31', topic: 'Lesson Summary: Past Tense', duration: '3:15' },
    { date: 'Jan 30', topic: 'Daily Vocabulary: Weather', duration: '2:45' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">
          {t('welcome', { name: user?.firstName || 'Student' })}
        </h1>
        <p className="text-muted-foreground">Track your learning progress</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Lesson
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today 14:00</div>
            <p className="text-xs text-muted-foreground">Present Perfect Tense</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">19/20 lessons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lessons This Month
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">12 total this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Payment
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40,000 ֏</div>
            <p className="text-xs text-muted-foreground">Due Feb 5</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Lessons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingLessons.map((lesson, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{lesson.topic}</p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.date} at {lesson.time} • {lesson.teacher}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Recordings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Recent Recordings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecordings.map((recording, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Mic className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{recording.topic}</p>
                      <p className="text-sm text-muted-foreground">
                        {recording.date} • {recording.duration}
                      </p>
                    </div>
                  </div>
                  <button className="text-sm text-primary hover:underline">Play</button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group Info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">Beginners A1 - Morning</p>
              <p className="text-muted-foreground">Teacher: John Smith • Center: Downtown</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Schedule</p>
              <p className="font-medium">Mon, Wed, Fri • 14:00 - 15:00</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

