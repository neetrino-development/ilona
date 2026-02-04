'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import type { Lesson } from '@/features/lessons';
import type { StudentWithAttendance, AbsenceType } from '@/features/attendance';

type AttendanceStatus = 'present' | 'absent_justified' | 'absent_unjustified' | 'not_marked';

interface AttendanceCell {
  studentId: string;
  lessonId: string;
  status: AttendanceStatus;
  isPresent: boolean;
  absenceType?: AbsenceType;
}

interface AttendanceGridProps {
  students: Array<{
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl?: string;
    };
  }>;
  lessons: Lesson[];
  initialAttendance?: Record<string, Record<string, AttendanceCell>>; // lessonId -> studentId -> cell
  onCellChange?: (studentId: string, lessonId: string, status: AttendanceStatus) => void;
  onLessonSave?: (lessonId: string, attendances: Array<{ studentId: string; isPresent: boolean; absenceType?: AbsenceType }>) => Promise<void>;
  isLoading?: boolean;
  isSaving?: Record<string, boolean>; // lessonId -> isSaving
  dateRange?: { from: string; to: string };
  onSaveSuccess?: (lessonId: string) => void;
  onSaveError?: (lessonId: string, error: string) => void;
  onUnsavedChangesChange?: (hasUnsavedChanges: boolean) => void;
}

export function AttendanceGrid({
  students,
  lessons,
  initialAttendance = {},
  onCellChange,
  onLessonSave,
  isLoading = false,
  isSaving = {},
  dateRange,
  onSaveSuccess,
  onSaveError,
  onUnsavedChangesChange,
}: AttendanceGridProps) {
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, AttendanceCell>>>(
    initialAttendance
  );
  const [focusedCell, setFocusedCell] = useState<{ studentId: string; lessonId: string } | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Set<string>>>({}); // lessonId -> Set of studentIds
  const [saveError, setSaveError] = useState<Record<string, string>>({}); // lessonId -> error message
  const [saveSuccess, setSaveSuccess] = useState<Record<string, boolean>>({}); // lessonId -> success
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Record<string, HTMLTableCellElement>>({});
  const initialDataRef = useRef<Record<string, Record<string, AttendanceCell>>>(initialAttendance);

  // Initialize attendance data
  useEffect(() => {
    if (Object.keys(initialAttendance).length > 0) {
      setAttendanceData(initialAttendance);
      initialDataRef.current = initialAttendance;
      // Clear pending changes when initial data changes (e.g., after save or data refresh)
      setPendingChanges({});
      setSaveError({});
      setSaveSuccess({});
    }
  }, [initialAttendance]);

  // Track unsaved changes for navigation warning
  const hasUnsavedChanges = useMemo(() => {
    return Object.values(pendingChanges).some((set) => set.size > 0);
  }, [pendingChanges]);

  // Notify parent component about unsaved changes state
  useEffect(() => {
    if (onUnsavedChangesChange) {
      onUnsavedChangesChange(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Get cell status
  const getCellStatus = useCallback(
    (studentId: string, lessonId: string): AttendanceStatus => {
      const cell = attendanceData[lessonId]?.[studentId];
      if (!cell) return 'not_marked';
      return cell.status;
    },
    [attendanceData]
  );

  // Toggle cell status
  const toggleCellStatus = useCallback(
    (studentId: string, lessonId: string) => {
      const currentStatus = getCellStatus(studentId, lessonId);
      const statuses: AttendanceStatus[] = ['present', 'absent_justified', 'absent_unjustified'];
      const currentIndex = statuses.indexOf(currentStatus);
      const nextIndex = (currentIndex + 1) % statuses.length;
      const newStatus = statuses[nextIndex];

      setAttendanceData((prev) => {
        const lessonData = prev[lessonId] || {};
        return {
          ...prev,
          [lessonId]: {
            ...lessonData,
            [studentId]: {
              studentId,
              lessonId,
              status: newStatus,
              isPresent: newStatus === 'present',
              absenceType: newStatus === 'absent_justified' ? 'JUSTIFIED' : newStatus === 'absent_unjustified' ? 'UNJUSTIFIED' : undefined,
            },
          },
        };
      });

      // Add to pending changes for this lesson
      setPendingChanges((prev) => {
        const lessonChanges = prev[lessonId] || new Set();
        return {
          ...prev,
          [lessonId]: new Set(lessonChanges).add(studentId),
        };
      });

      // Clear success/error state for this lesson when new changes are made
      setSaveSuccess((prev) => {
        const next = { ...prev };
        delete next[lessonId];
        return next;
      });
      setSaveError((prev) => {
        const next = { ...prev };
        delete next[lessonId];
        return next;
      });

      if (onCellChange) {
        onCellChange(studentId, lessonId, newStatus);
      }
    },
    [getCellStatus, onCellChange]
  );

  // Handle manual save for a specific lesson
  const handleManualSave = useCallback(
    async (lessonId: string) => {
      if (!onLessonSave || !pendingChanges[lessonId] || pendingChanges[lessonId].size === 0) return;

      const attendances: Array<{ studentId: string; isPresent: boolean; absenceType?: AbsenceType }> = [];

      pendingChanges[lessonId].forEach((studentId) => {
        const cell = attendanceData[lessonId]?.[studentId];
        if (cell) {
          attendances.push({
            studentId,
            isPresent: cell.isPresent,
            absenceType: cell.absenceType,
          });
        }
      });

      if (attendances.length > 0) {
        try {
          // Clear previous errors
          setSaveError((prev) => {
            const next = { ...prev };
            delete next[lessonId];
            return next;
          });
          setSaveSuccess((prev) => {
            const next = { ...prev };
            delete next[lessonId];
            return next;
          });

          await onLessonSave(lessonId, attendances);

          // Mark as saved
          setPendingChanges((prev) => {
            const next = { ...prev };
            delete next[lessonId];
            return next;
          });
          setSaveSuccess((prev) => ({ ...prev, [lessonId]: true }));

          // Call success callback
          if (onSaveSuccess) {
            onSaveSuccess(lessonId);
          }

          // Clear success message after 3 seconds
          setTimeout(() => {
            setSaveSuccess((prev) => {
              const next = { ...prev };
              delete next[lessonId];
              return next;
            });
          }, 3000);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to save attendance';
          setSaveError((prev) => ({
            ...prev,
            [lessonId]: errorMessage,
          }));

          // Call error callback
          if (onSaveError) {
            onSaveError(lessonId, errorMessage);
          }

          console.error('Save failed:', error);
        }
      }
    },
    [onLessonSave, pendingChanges, attendanceData, onSaveSuccess, onSaveError]
  );

  // Handle save all lessons with pending changes
  const handleSaveAll = useCallback(async () => {
    const lessonsWithChanges = Object.keys(pendingChanges).filter(
      (lessonId) => pendingChanges[lessonId] && pendingChanges[lessonId].size > 0
    );

    for (const lessonId of lessonsWithChanges) {
      await handleManualSave(lessonId);
    }
  }, [pendingChanges, handleManualSave]);

  // Scroll to focused cell
  useEffect(() => {
    if (focusedCell) {
      const cellKey = `${focusedCell.studentId}-${focusedCell.lessonId}`;
      const cellElement = cellRefs.current[cellKey];
      if (cellElement && gridRef.current) {
        cellElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        cellElement.focus();
      }
    }
  }, [focusedCell]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, studentId: string, lessonId: string) => {
      if (isLoading || isSaving) return;

      const studentIndex = students.findIndex((s) => s.id === studentId);
      const filteredLessonsList = dateRange
        ? lessons.filter((l) => {
            const lessonDate = new Date(l.scheduledAt).toISOString().split('T')[0];
            return lessonDate >= dateRange.from && lessonDate <= dateRange.to;
          })
        : lessons;
      const lessonIndex = filteredLessonsList.findIndex((l) => l.id === lessonId);

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          toggleCellStatus(studentId, lessonId);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (studentIndex > 0) {
            const prevStudent = students[studentIndex - 1];
            setFocusedCell({ studentId: prevStudent.id, lessonId });
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (studentIndex < students.length - 1) {
            const nextStudent = students[studentIndex + 1];
            setFocusedCell({ studentId: nextStudent.id, lessonId });
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (lessonIndex > 0) {
            const prevLesson = filteredLessonsList[lessonIndex - 1];
            setFocusedCell({ studentId, lessonId: prevLesson.id });
          }
          break;
        case 'ArrowRight':
        case 'Tab':
          e.preventDefault();
          if (lessonIndex < filteredLessonsList.length - 1) {
            const nextLesson = filteredLessonsList[lessonIndex + 1];
            setFocusedCell({ studentId, lessonId: nextLesson.id });
          }
          break;
      }
    },
    [students, lessons, toggleCellStatus, isLoading, isSaving, dateRange]
  );

  // Filter lessons by date range if provided
  const filteredLessons = useMemo(() => {
    if (!dateRange) return lessons;
    return lessons.filter((lesson) => {
      const lessonDate = new Date(lesson.scheduledAt).toISOString().split('T')[0];
      return lessonDate >= dateRange.from && lessonDate <= dateRange.to;
    });
  }, [lessons, dateRange]);

  // Group lessons by date
  const lessonsByDate = useMemo(() => {
    const grouped: Record<string, Lesson[]> = {};
    filteredLessons.forEach((lesson) => {
      const date = new Date(lesson.scheduledAt).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(lesson);
    });
    return grouped;
  }, [filteredLessons]);

  // Get status styles
  const getStatusStyles = (status: AttendanceStatus) => {
    const styles = {
      present: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
      absent_justified: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700',
      absent_unjustified: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700',
      not_marked: 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500',
    };
    return styles[status];
  };

  // Get status icon
  const getStatusIcon = (status: AttendanceStatus) => {
    const icons = {
      present: '✓',
      absent_justified: 'J',
      absent_unjustified: '✗',
      not_marked: '',
    };
    return icons[status];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-500">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  const totalPendingChanges = Object.values(pendingChanges).reduce((sum, set) => sum + set.size, 0);
  const hasAnySaving = isSaving && Object.values(isSaving).some((saving) => saving);
  const lessonsWithChanges = Object.keys(pendingChanges).filter(
    (lessonId) => pendingChanges[lessonId] && pendingChanges[lessonId].size > 0
  );

  return (
    <div className="space-y-4">
      {/* Status indicator and Save button */}
      {(hasAnySaving || totalPendingChanges > 0 || Object.keys(saveSuccess).length > 0) && (
        <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3 text-sm border border-blue-200">
          <div className="flex items-center gap-3 flex-1">
            {hasAnySaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-blue-700 font-medium">Saving changes...</span>
              </>
            ) : totalPendingChanges > 0 ? (
              <>
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span className="text-amber-700 font-medium">
                  {totalPendingChanges} unsaved {totalPendingChanges === 1 ? 'change' : 'changes'}
                </span>
              </>
            ) : Object.keys(saveSuccess).length > 0 ? (
              <>
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700 font-medium">Changes saved successfully</span>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {Object.keys(saveError).length > 0 && (
              <span className="text-red-600 text-xs font-medium">
                {Object.values(saveError)[0]} {Object.keys(saveError).length > 1 && `(+${Object.keys(saveError).length - 1} more)`}
              </span>
            )}
            {totalPendingChanges > 0 && !hasAnySaving && (
              <Button
                onClick={handleSaveAll}
                disabled={lessonsWithChanges.length === 0 || hasAnySaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Save All Changes
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      <div
        ref={gridRef}
        className="overflow-auto rounded-lg border border-slate-200 bg-white"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        <div className="inline-block min-w-full">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                {/* Student name column (frozen) */}
                <th className="sticky left-0 z-20 bg-slate-50 border-b border-r border-slate-200 px-3 md:px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider min-w-[150px] md:min-w-[200px]">
                  Student
                </th>
                {/* Date/Lesson columns */}
                {Object.entries(lessonsByDate).map(([date, dateLessons]) => (
                  <th
                    key={date}
                    colSpan={dateLessons.length}
                    className="border-b border-r border-slate-200 px-1 md:px-2 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100"
                  >
                    <div className="font-medium text-[10px] md:text-xs">{formatDate(date)}</div>
                  </th>
                ))}
              </tr>
              <tr>
                <th className="sticky left-0 z-20 bg-slate-50 border-b border-r border-slate-200"></th>
                {Object.entries(lessonsByDate).map(([date, dateLessons]) =>
                  dateLessons.map((lesson) => (
                    <th
                      key={lesson.id}
                      className="border-b border-r border-slate-200 px-1 md:px-2 py-2 text-center text-xs text-slate-600 bg-slate-50 min-w-[60px] md:min-w-[80px]"
                    >
                      <div className="font-normal text-[10px] md:text-xs">{formatTime(lesson.scheduledAt)}</div>
                      {lesson.topic && (
                        <div className="text-[9px] md:text-[10px] text-slate-500 truncate max-w-[60px] md:max-w-[80px]" title={lesson.topic}>
                          {lesson.topic}
                        </div>
                      )}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {students.map((student) => {
                const initials = `${student.user.firstName[0] || ''}${student.user.lastName[0] || ''}` || '?';
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    {/* Student name cell (frozen) */}
                    <td className="sticky left-0 z-10 bg-white border-r border-slate-200 px-3 md:px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs md:text-sm font-medium text-slate-900 truncate max-w-[100px] md:max-w-none">
                            {student.user.firstName} {student.user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Attendance cells */}
                {Object.entries(lessonsByDate).map(([date, dateLessons]) =>
                  dateLessons.map((lesson) => {
                    const status = getCellStatus(student.id, lesson.id);
                    const isFocused = focusedCell?.studentId === student.id && focusedCell?.lessonId === lesson.id;
                    const hasPendingChange = pendingChanges[lesson.id]?.has(student.id) || false;
                    const isLessonSaving = isSaving?.[lesson.id] || false;
                    const hasLessonChanges = pendingChanges[lesson.id] && pendingChanges[lesson.id].size > 0;

                    const cellKey = `${student.id}-${lesson.id}`;
                    return (
                      <td
                        key={lesson.id}
                        ref={(el) => {
                          if (el) cellRefs.current[cellKey] = el;
                        }}
                        className={cn(
                          'border-r border-b border-slate-200 px-1 md:px-2 py-2 text-center cursor-pointer transition-all relative',
                          getStatusStyles(status),
                          isFocused && 'ring-2 ring-blue-500 ring-offset-1',
                          hasPendingChange && 'ring-1 ring-amber-400',
                          isLessonSaving && 'opacity-75'
                        )}
                        onClick={() => !isLessonSaving && toggleCellStatus(student.id, lesson.id)}
                        onKeyDown={(e) => !isLessonSaving && handleKeyDown(e, student.id, lesson.id)}
                        tabIndex={isLessonSaving ? -1 : 0}
                        role="gridcell"
                        aria-label={`${student.user.firstName} ${student.user.lastName} - ${formatDate(lesson.scheduledAt)} ${formatTime(lesson.scheduledAt)} - ${status}`}
                        aria-disabled={isLessonSaving}
                      >
                        <div className="flex items-center justify-center h-7 w-7 md:h-8 md:w-8 mx-auto rounded text-xs md:text-sm font-semibold relative">
                          {getStatusIcon(status)}
                          {isLessonSaving && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-2.5 w-2.5 md:h-3 md:w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            </div>
                          )}
                        </div>
                        {hasPendingChange && !isLessonSaving && (
                          <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                        )}
                      </td>
                    );
                  })
                )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lesson-specific Save buttons */}
      {Object.entries(lessonsByDate).map(([date, dateLessons]) =>
        dateLessons.map((lesson) => {
          const hasLessonChanges = pendingChanges[lesson.id] && pendingChanges[lesson.id].size > 0;
          const isLessonSaving = isSaving?.[lesson.id] || false;
          const lessonSaveError = saveError[lesson.id];
          const lessonSaveSuccess = saveSuccess[lesson.id];

          if (!hasLessonChanges && !isLessonSaving && !lessonSaveError && !lessonSaveSuccess) {
            return null;
          }

          return (
            <div
              key={lesson.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm border border-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">
                  {formatDate(lesson.scheduledAt)} {formatTime(lesson.scheduledAt)}
                </span>
                {lesson.topic && <span className="text-slate-500">• {lesson.topic}</span>}
                {hasLessonChanges && (
                  <span className="text-amber-600">
                    ({pendingChanges[lesson.id].size} {pendingChanges[lesson.id].size === 1 ? 'change' : 'changes'})
                  </span>
                )}
                {lessonSaveSuccess && (
                  <span className="text-green-600 font-medium">✓ Saved</span>
                )}
                {lessonSaveError && (
                  <span className="text-red-600 text-xs">{lessonSaveError}</span>
                )}
              </div>
              {hasLessonChanges && !isLessonSaving && (
                <Button
                  onClick={() => handleManualSave(lesson.id)}
                  disabled={isLessonSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                  isLoading={isLessonSaving}
                >
                  Save
                </Button>
              )}
            </div>
          );
        })
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 rounded-lg px-4 py-2">
        <span className="font-medium">Legend:</span>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-50 border border-green-200 rounded text-green-700 flex items-center justify-center text-[10px] font-semibold">
            ✓
          </span>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 flex items-center justify-center text-[10px] font-semibold">
            J
          </span>
          <span>Justified</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-red-50 border border-red-200 rounded text-red-700 flex items-center justify-center text-[10px] font-semibold">
            ✗
          </span>
          <span>Unjustified</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-slate-50 border border-slate-200 rounded"></span>
          <span>Not Marked</span>
        </div>
        <div className="ml-auto text-slate-500">
          Use arrow keys or click to navigate • Enter/Space to toggle
        </div>
      </div>
    </div>
  );
}

