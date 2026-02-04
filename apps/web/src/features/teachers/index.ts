// Hooks
export {
  useTeachers,
  useTeacher,
  useTeacherStatistics,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
  teacherKeys,
} from './hooks';

// Components
export { AddTeacherForm } from './components/AddTeacherForm';

// Types
export type {
  Teacher,
  TeacherGroup,
  TeachersResponse,
  TeacherFilters,
  CreateTeacherDto,
  UpdateTeacherDto,
  TeacherStatistics,
} from './types';
