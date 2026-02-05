'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Label, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui';
import { useUpdateTeacher, useTeacher, type UpdateTeacherDto, type Teacher } from '@/features/teachers';
import { useState, useEffect } from 'react';
import type { UserStatus } from '@/types';

const updateTeacherSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name must be at most 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be at most 50 characters'),
  phone: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive').optional(),
  workingDays: z.array(z.string()).optional(),
  workingHours: z.object({
    start: z.string(),
    end: z.string(),
  }).optional(),
});

type UpdateTeacherFormData = z.infer<typeof updateTeacherSchema>;

interface EditTeacherFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
}

export function EditTeacherForm({ open, onOpenChange, teacherId }: EditTeacherFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const updateTeacher = useUpdateTeacher();
  const { data: teacher, isLoading: isLoadingTeacher } = useTeacher(teacherId, open);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateTeacherFormData>({
    resolver: zodResolver(updateTeacherSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      hourlyRate: 0,
      workingDays: [],
      workingHours: {
        start: '09:00',
        end: '18:00',
      },
    },
  });

  // Pre-fill form when teacher data is loaded
  useEffect(() => {
    if (teacher && open) {
      setValue('firstName', teacher.user.firstName || '');
      setValue('lastName', teacher.user.lastName || '');
      setValue('phone', teacher.user.phone || '');
      setValue('status', teacher.user.status);
      setValue('hourlyRate', teacher.hourlyRate || 0);
      setValue('workingDays', teacher.workingDays || []);
      setValue('workingHours', teacher.workingHours || { start: '09:00', end: '18:00' });
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [teacher, open, setValue]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [open, reset]);

  const onSubmit = async (data: UpdateTeacherFormData) => {
    setErrorMessage(null);
    
    try {
      const payload: UpdateTeacherDto = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        status: data.status,
        hourlyRate: data.hourlyRate,
        workingDays: data.workingDays,
        workingHours: data.workingHours,
      };

      await updateTeacher.mutateAsync({ id: teacherId, data: payload });
      
      // Show success message
      setSuccessMessage('Teacher updated successfully!');
      setErrorMessage(null);
      
      // Close modal after a brief delay
      setTimeout(() => {
        onOpenChange(false);
        setSuccessMessage(null);
      }, 1500);
    } catch (error: any) {
      // Handle error
      const message = error?.response?.data?.message || error?.message || 'Failed to update teacher. Please try again.';
      setErrorMessage(message);
      setSuccessMessage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogDescription>
            Update the teacher information below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        {isLoadingTeacher ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...register('status')}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">
                Hourly Rate (AMD) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                min="0"
                {...register('hourlyRate', { valueAsNumber: true })}
                error={errors.hourlyRate?.message}
                placeholder="25.00"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workingHoursStart">Working Hours Start</Label>
                <Input
                  id="workingHoursStart"
                  type="time"
                  {...register('workingHours.start')}
                  error={errors.workingHours?.start?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHoursEnd">Working Hours End</Label>
                <Input
                  id="workingHoursEnd"
                  type="time"
                  {...register('workingHours.end')}
                  error={errors.workingHours?.end?.message}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  onOpenChange(false);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                disabled={isSubmitting || updateTeacher.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting || updateTeacher.isPending}>
                {isSubmitting || updateTeacher.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

