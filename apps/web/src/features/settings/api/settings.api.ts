import { api } from '@/shared/lib/api';
import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from '../types';

/**
 * Get current user profile
 */
export async function fetchProfile(): Promise<UserProfile> {
  return api.get<UserProfile>('/users/me');
}

/**
 * Update user profile
 */
export async function updateProfile(data: UpdateProfileDto): Promise<UserProfile> {
  return api.patch<UserProfile>('/users/me', data);
}

/**
 * Change password
 */
export async function changePassword(data: ChangePasswordDto): Promise<{ success: boolean }> {
  return api.post<{ success: boolean }>('/auth/change-password', data);
}

/**
 * Upload avatar
 */
export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append('avatar', file);
  
  // Note: This would need special handling for multipart/form-data
  return api.post<{ avatarUrl: string }>('/users/me/avatar', formData);
}

/**
 * Delete avatar
 */
export async function deleteAvatar(): Promise<{ success: boolean }> {
  return api.delete<{ success: boolean }>('/users/me/avatar');
}
