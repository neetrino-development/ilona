'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTeachers,
  fetchTeacher,
  fetchTeacherStatistics,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../api/teachers.api';
import type {
  TeacherFilters,
  CreateTeacherDto,
  UpdateTeacherDto,
} from '../types';

// Query keys
export const teacherKeys = {
  all: ['teachers'] as const,
  lists: () => [...teacherKeys.all, 'list'] as const,
  list: (filters?: TeacherFilters) => [...teacherKeys.lists(), filters] as const,
  details: () => [...teacherKeys.all, 'detail'] as const,
  detail: (id: string) => [...teacherKeys.details(), id] as const,
  statistics: (id: string) => [...teacherKeys.detail(id), 'statistics'] as const,
};

/**
 * Hook to fetch teachers list
 */
export function useTeachers(filters?: TeacherFilters) {
  return useQuery({
    queryKey: teacherKeys.list(filters),
    queryFn: () => fetchTeachers(filters),
  });
}

/**
 * Hook to fetch a single teacher
 */
export function useTeacher(id: string, enabled = true) {
  return useQuery({
    queryKey: teacherKeys.detail(id),
    queryFn: () => fetchTeacher(id),
    enabled: enabled && !!id,
  });
}

/**
 * Hook to fetch teacher statistics
 */
export function useTeacherStatistics(
  id: string,
  dateFrom?: string,
  dateTo?: string,
  enabled = true
) {
  return useQuery({
    queryKey: teacherKeys.statistics(id),
    queryFn: () => fetchTeacherStatistics(id, dateFrom, dateTo),
    enabled: enabled && !!id,
  });
}

/**
 * Hook to create a teacher
 */
export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherDto) => createTeacher(data),
    onSuccess: () => {
      // Invalidate teachers list to refetch
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
    },
  });
}

/**
 * Hook to update a teacher
 */
export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherDto }) =>
      updateTeacher(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific teacher and list
      queryClient.invalidateQueries({ queryKey: teacherKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
    },
  });
}

/**
 * Hook to delete a teacher
 */
export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTeacher(id),
    onSuccess: () => {
      // Invalidate teachers list
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
    },
  });
}
