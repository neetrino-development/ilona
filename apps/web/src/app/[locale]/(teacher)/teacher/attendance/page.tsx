'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { useTodayLessons, useMyLessons } from '@/features/lessons';
import {
  useLessonAttendance,
  useMarkBulkAttendance,
  type StudentWithAttendance,
  type AbsenceType,
} from '@/features/attendance';
import { cn } from '@/shared/lib/utils';

type AttendanceStatus = 'present' | 'absent_justified' | 'absent_unjustified' | 'not_marked';

interface AttendanceState {
  studentId: string;
  isPresent: boolean;
  absenceType?: AbsenceType;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    SCHEDULED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scheduled' },
    IN_PROGRESS: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Progress' },
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
  };

  const style = styles[status] || { bg: 'bg-slate-100', text: 'text-slate-700', label: status };

  return (
    <span className={cn('px-2 py-1 text-xs font-medium rounded-full', style.bg, style.text)}>
      {style.label}
    </span>
  );
}

function AttendanceButton({
  status,
  onClick,
  disabled,
}: {
  status: AttendanceStatus;
  onClick: () => void;
  disabled?: boolean;
}) {
  const styles: Record<AttendanceStatus, { bg: string; activeBg: string; icon: string }> = {
    present: { bg: 'bg-green-100', activeBg: 'bg-green-500', icon: '✓' },
    absent_justified: { bg: 'bg-yellow-100', activeBg: 'bg-yellow-500', icon: 'J' },
    absent_unjustified: { bg: 'bg-red-100', activeBg: 'bg-red-500', icon: '✗' },
    not_marked: { bg: 'bg-slate-100', activeBg: 'bg-slate-300', icon: '?' },
  };

  const style = styles[status];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all',
        style.activeBg,
        'text-white hover:opacity-80 disabled:opacity-50'
      )}
    >
      {style.icon}
    </button>
  );
}

function AttendanceRow({
  student,
  currentStatus,
  onStatusChange,
  disabled,
}: {
  student: StudentWithAttendance;
  currentStatus: AttendanceStatus;
  onStatusChange: (status: AttendanceStatus) => void;
  disabled?: boolean;
}) {
  const initials = `${student.student.user.firstName[0]}${student.student.user.lastName[0]}`;

  const cycleStatus = () => {
    const statuses: AttendanceStatus[] = ['present', 'absent_justified', 'absent_unjustified'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    onStatusChange(statuses[nextIndex]);
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
          {initials}
        </div>
        <div>
          <p className="font-medium text-slate-800">
            {student.student.user.firstName} {student.student.user.lastName}
          </p>
          <p className="text-xs text-slate-500">
            {currentStatus === 'present' && 'Present'}
            {currentStatus === 'absent_justified' && 'Absent (Justified)'}
            {currentStatus === 'absent_unjustified' && 'Absent (Unjustified)'}
            {currentStatus === 'not_marked' && 'Not marked'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <AttendanceButton
          status={currentStatus}
          onClick={cycleStatus}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default function TeacherAttendancePage() {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [attendanceStates, setAttendanceStates] = useState<Record<string, AttendanceState>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Get today's and week's lessons
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);

  const { data: todayLessons = [], isLoading: isLoadingToday } = useTodayLessons();
  const { data: weekLessons, isLoading: isLoadingWeek } = useMyLessons(
    weekStart.toISOString(),
    today.toISOString()
  );

  // Combine and sort lessons
  const allLessons = [
    ...todayLessons,
    ...(weekLessons?.items || []).filter(
      (l) => !todayLessons.some((t) => t.id === l.id)
    ),
  ].sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  // Filter to completed and in-progress lessons only
  const lessonsForAttendance = allLessons.filter(
    (l) => l.status === 'COMPLETED' || l.status === 'IN_PROGRESS'
  );

  // Fetch attendance for selected lesson
  const { data: attendanceData, isLoading: isLoadingAttendance } = useLessonAttendance(
    selectedLessonId || '',
    !!selectedLessonId
  );

  const markBulkAttendance = useMarkBulkAttendance();

  // Initialize attendance states when data loads
  useEffect(() => {
    if (attendanceData?.studentsWithAttendance) {
      const states: Record<string, AttendanceState> = {};
      attendanceData.studentsWithAttendance.forEach((s) => {
        if (s.attendance) {
          states[s.student.id] = {
            studentId: s.student.id,
            isPresent: s.attendance.isPresent,
            absenceType: s.attendance.absenceType || undefined,
          };
        }
      });
      setAttendanceStates(states);
      setHasChanges(false);
    }
  }, [attendanceData]);

  const getAttendanceStatus = (studentId: string): AttendanceStatus => {
    const state = attendanceStates[studentId];
    if (!state) return 'not_marked';
    if (state.isPresent) return 'present';
    if (state.absenceType === 'JUSTIFIED') return 'absent_justified';
    return 'absent_unjustified';
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceStates((prev) => ({
      ...prev,
      [studentId]: {
        studentId,
        isPresent: status === 'present',
        absenceType: status === 'absent_justified' ? 'JUSTIFIED' : status === 'absent_unjustified' ? 'UNJUSTIFIED' : undefined,
      },
    }));
    setHasChanges(true);
  };

  const handleSaveAttendance = async () => {
    if (!selectedLessonId || !attendanceData) return;

    const attendances = attendanceData.studentsWithAttendance.map((s) => {
      const state = attendanceStates[s.student.id];
      return {
        studentId: s.student.id,
        isPresent: state?.isPresent ?? false,
        absenceType: state?.absenceType,
      };
    });

    await markBulkAttendance.mutateAsync({
      lessonId: selectedLessonId,
      attendances,
    });

    setHasChanges(false);
  };

  const handleMarkAllPresent = () => {
    if (!attendanceData) return;
    const states: Record<string, AttendanceState> = {};
    attendanceData.studentsWithAttendance.forEach((s) => {
      states[s.student.id] = {
        studentId: s.student.id,
        isPresent: true,
      };
    });
    setAttendanceStates(states);
    setHasChanges(true);
  };

  const selectedLesson = lessonsForAttendance.find((l) => l.id === selectedLessonId);

  return (
    <DashboardLayout
      title="Attendance"
      subtitle="Mark attendance for your lessons"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lessons List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Recent Lessons</h3>
              <p className="text-sm text-slate-500">Select a lesson to mark attendance</p>
            </div>

            <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
              {isLoadingToday || isLoadingWeek ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : lessonsForAttendance.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No lessons to mark attendance</p>
                </div>
              ) : (
                lessonsForAttendance.map((lesson) => {
                  const date = new Date(lesson.scheduledAt);
                  const isToday = date.toDateString() === today.toDateString();

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={cn(
                        'w-full p-4 text-left transition-colors',
                        selectedLessonId === lesson.id
                          ? 'bg-blue-50 border-l-2 border-blue-600'
                          : 'hover:bg-slate-50'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-slate-800">{lesson.group?.name}</p>
                        <StatusBadge status={lesson.status} />
                      </div>
                      <p className="text-sm text-slate-500">
                        {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
                        at {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {lesson.topic && (
                        <p className="text-xs text-slate-400 mt-1 truncate">{lesson.topic}</p>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Attendance Marking */}
        <div className="lg:col-span-2">
          {!selectedLessonId ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">Select a Lesson</h3>
              <p className="text-sm text-slate-500">Choose a lesson from the list to mark attendance</p>
            </div>
          ) : isLoadingAttendance ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-slate-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-40 mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-24" />
                    </div>
                    <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-800">{selectedLesson?.group?.name}</h3>
                    <p className="text-sm text-slate-500">
                      {selectedLesson && new Date(selectedLesson.scheduledAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <StatusBadge status={selectedLesson?.status || 'SCHEDULED'} />
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleMarkAllPresent}
                    className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Mark All Present
                  </button>
                  <div className="flex items-center gap-1 ml-4 text-xs text-slate-500">
                    <span className="w-4 h-4 bg-green-500 rounded text-white flex items-center justify-center text-[10px]">✓</span>
                    <span>Present</span>
                    <span className="w-4 h-4 bg-yellow-500 rounded text-white flex items-center justify-center text-[10px] ml-2">J</span>
                    <span>Justified</span>
                    <span className="w-4 h-4 bg-red-500 rounded text-white flex items-center justify-center text-[10px] ml-2">✗</span>
                    <span>Unjustified</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {attendanceData && (
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-600">
                      <span className="font-medium">{attendanceData.summary.total}</span> students
                    </span>
                    <span className="text-green-600">
                      <span className="font-medium">{attendanceData.summary.present}</span> present
                    </span>
                    <span className="text-red-600">
                      <span className="font-medium">{attendanceData.summary.absent}</span> absent
                    </span>
                    {attendanceData.summary.notMarked > 0 && (
                      <span className="text-slate-500">
                        <span className="font-medium">{attendanceData.summary.notMarked}</span> not marked
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Students List */}
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {attendanceData?.studentsWithAttendance.map((s) => (
                  <AttendanceRow
                    key={s.student.id}
                    student={s}
                    currentStatus={getAttendanceStatus(s.student.id)}
                    onStatusChange={(status) => handleStatusChange(s.student.id, status)}
                    disabled={markBulkAttendance.isPending}
                  />
                ))}
              </div>

              {/* Save Button */}
              {hasChanges && (
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={handleSaveAttendance}
                    disabled={markBulkAttendance.isPending}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {markBulkAttendance.isPending ? 'Saving...' : 'Save Attendance'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
