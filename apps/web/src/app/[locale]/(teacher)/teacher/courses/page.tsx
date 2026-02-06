'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { useMyLessons, type Lesson } from '@/features/lessons';
import { useLessonFeedback, useCreateOrUpdateFeedback } from '@/features/feedback';
import { useUpdateLesson } from '@/features/lessons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

type LessonStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'MISSED';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function StatusBadge({ status }: { status: LessonStatus }) {
  const statusConfig: Record<LessonStatus, { label: string; className: string }> = {
    SCHEDULED: { label: 'Scheduled', className: 'bg-blue-100 text-blue-700' },
    IN_PROGRESS: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700' },
    COMPLETED: { label: 'Completed', className: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
    MISSED: { label: 'Missed', className: 'bg-slate-100 text-slate-700' },
  };

  const config = statusConfig[status] || statusConfig.SCHEDULED;

  return (
    <span className={cn('px-2 py-1 rounded-md text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
}

interface SessionDetailsModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
}

function SessionDetailsModal({ lesson, isOpen, onClose }: SessionDetailsModalProps) {
  const t = useTranslations('courses');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: feedbackData, isLoading: isLoadingFeedback } = useLessonFeedback(
    lesson?.id || '',
    isOpen && !!lesson
  );

  const createOrUpdateFeedback = useCreateOrUpdateFeedback();
  const updateLesson = useUpdateLesson();

  // Initialize feedback content when data loads
  useMemo(() => {
    if (feedbackData && selectedStudentId) {
      const studentFeedback = feedbackData.studentsWithFeedback.find(
        (s) => s.student.id === selectedStudentId
      );
      setFeedbackContent(studentFeedback?.feedback?.content || '');
      setHasUnsavedChanges(false);
    }
  }, [feedbackData, selectedStudentId]);

  // Initialize general feedback
  useMemo(() => {
    if (feedbackData?.lesson.notes) {
      setGeneralFeedback(feedbackData.lesson.notes);
      setHasUnsavedChanges(false);
    } else {
      setGeneralFeedback('');
    }
  }, [feedbackData]);

  const handleOpenFeedback = (studentId: string) => {
    if (hasUnsavedChanges && selectedStudentId) {
      if (!confirm(t('unsavedChangesWarning'))) {
        return;
      }
    }
    setSelectedStudentId(studentId);
    const studentFeedback = feedbackData?.studentsWithFeedback.find(
      (s) => s.student.id === studentId
    );
    setFeedbackContent(studentFeedback?.feedback?.content || '');
    setHasUnsavedChanges(false);
  };

  const handleCloseFeedback = () => {
    if (hasUnsavedChanges) {
      if (!confirm(t('unsavedChangesWarning'))) {
        return;
      }
    }
    setSelectedStudentId(null);
    setFeedbackContent('');
    setHasUnsavedChanges(false);
  };

  const handleSaveFeedback = async () => {
    if (!lesson || !selectedStudentId || !feedbackContent.trim()) return;

    try {
      await createOrUpdateFeedback.mutateAsync({
        lessonId: lesson.id,
        studentId: selectedStudentId,
        content: feedbackContent.trim(),
      });
      setHasUnsavedChanges(false);
      setSelectedStudentId(null);
      setFeedbackContent('');
    } catch (error) {
      console.error('Failed to save feedback:', error);
      alert(t('errorSavingFeedback'));
    }
  };

  const handleSaveGeneralFeedback = async () => {
    if (!lesson) return;

    try {
      await updateLesson.mutateAsync({
        id: lesson.id,
        data: { notes: generalFeedback.trim() || undefined },
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save general feedback:', error);
      alert(t('errorSavingFeedback'));
    }
  };

  const handleCloseModal = () => {
    if (hasUnsavedChanges || (selectedStudentId && feedbackContent.trim() !== '')) {
      if (!confirm(t('unsavedChangesWarning'))) {
        return;
      }
    }
    setSelectedStudentId(null);
    setFeedbackContent('');
    setGeneralFeedback('');
    setHasUnsavedChanges(false);
    onClose();
  };

  if (!lesson) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('sessionDetails')}</DialogTitle>
          <DialogDescription>
            {formatDateDisplay(new Date(lesson.scheduledAt))} at {formatTime(lesson.scheduledAt)}
            {' - '}
            {lesson.group.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Session Info */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">{t('course')}</p>
                <p className="font-medium">{lesson.group.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">{t('status')}</p>
                <StatusBadge status={lesson.status} />
              </div>
              {lesson.topic && (
                <div>
                  <p className="text-sm text-slate-600">{t('topic')}</p>
                  <p className="font-medium">{lesson.topic}</p>
                </div>
              )}
            </div>
          </div>

          {/* Students List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('students')}</h3>
            {isLoadingFeedback ? (
              <p className="text-slate-500">{t('loading')}</p>
            ) : feedbackData?.studentsWithFeedback.length === 0 ? (
              <p className="text-slate-500">{t('noStudents')}</p>
            ) : (
              <div className="space-y-2">
                {feedbackData?.studentsWithFeedback.map(({ student, feedback }) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      {student.user.avatarUrl ? (
                        <img
                          src={student.user.avatarUrl}
                          alt={`${student.user.firstName} ${student.user.lastName}`}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {student.user.firstName[0]}
                            {student.user.lastName[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {student.user.firstName} {student.user.lastName}
                        </p>
                        {feedback && (
                          <p className="text-xs text-slate-500">{t('feedbackProvided')}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenFeedback(student.id)}
                    >
                      {feedback ? t('editFeedback') : t('feedback')}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* General Feedback */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('generalFeedback')}</h3>
            <textarea
              value={generalFeedback}
              onChange={(e) => {
                setGeneralFeedback(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder={t('generalFeedbackPlaceholder')}
              className="w-full min-h-[120px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleSaveGeneralFeedback}
                disabled={updateLesson.isPending}
                isLoading={updateLesson.isPending}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      </Dialog>

      {/* Student Feedback Modal - Separate Dialog */}
      <Dialog open={!!selectedStudentId} onOpenChange={handleCloseFeedback}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('feedbackFor')}{' '}
              {feedbackData?.studentsWithFeedback.find(
                (s) => s.student.id === selectedStudentId
              )?.student.user.firstName}{' '}
              {feedbackData?.studentsWithFeedback.find(
                (s) => s.student.id === selectedStudentId
              )?.student.user.lastName}
            </DialogTitle>
            <DialogDescription>{t('feedbackDescription')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <textarea
              value={feedbackContent}
              onChange={(e) => {
                setFeedbackContent(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder={t('feedbackPlaceholder')}
              className="w-full min-h-[200px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseFeedback}>
                {t('cancel')}
              </Button>
              <Button
                onClick={handleSaveFeedback}
                disabled={!feedbackContent.trim() || createOrUpdateFeedback.isPending}
                isLoading={createOrUpdateFeedback.isPending}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function TeacherCoursesPage() {
  const t = useTranslations('courses');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Calculate date range for the selected date (single day)
  const dateFrom = useMemo(() => {
    const date = new Date(selectedDate);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }, [selectedDate]);

  const dateTo = useMemo(() => {
    const date = new Date(selectedDate);
    date.setHours(23, 59, 59, 999);
    return date.toISOString();
  }, [selectedDate]);

  // Fetch lessons for the selected date
  const { data: lessonsData, isLoading } = useMyLessons(dateFrom, dateTo);

  const lessons = lessonsData?.items || [];

  // Sort lessons by time
  const sortedLessons = useMemo(() => {
    return [...lessons].sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  }, [lessons]);

  const handleDateChange = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const handleGoToToday = () => {
    setSelectedDate(new Date());
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsDetailsOpen(true);
  };

  const isToday = formatDate(selectedDate) === formatDate(new Date());

  return (
    <DashboardLayout title={t('title')} subtitle={t('subtitle')}>
      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleDateChange(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center min-w-[200px]">
            <h2 className="text-lg font-semibold text-slate-800">
              {formatDateDisplay(selectedDate)}
            </h2>
            {isToday && (
              <p className="text-xs text-blue-600 font-medium">{t('today')}</p>
            )}
          </div>
          <button
            onClick={() => handleDateChange(1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={handleGoToToday}
            className="ml-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('today')}
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">{t('loading')}</div>
        ) : sortedLessons.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500 mb-2">{t('noSessions')}</p>
            <p className="text-sm text-slate-400">{t('noSessionsDescription')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {sortedLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className="w-full p-4 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-right min-w-[80px]">
                      <p className="text-lg font-semibold text-slate-900">
                        {formatTime(lesson.scheduledAt)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {lesson.duration} {t('minutes')}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{lesson.group.name}</p>
                      {lesson.topic && (
                        <p className="text-sm text-slate-600 mt-1">{lesson.topic}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={lesson.status} />
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      <SessionDetailsModal
        lesson={selectedLesson}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedLesson(null);
        }}
      />
    </DashboardLayout>
  );
}

