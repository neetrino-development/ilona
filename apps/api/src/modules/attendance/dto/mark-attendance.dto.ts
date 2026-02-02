import { IsString, IsBoolean, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { AbsenceType } from '@prisma/client';

export class MarkAttendanceDto {
  @IsString()
  lessonId!: string;

  @IsString()
  studentId!: string;

  @IsBoolean()
  isPresent!: boolean;

  @IsEnum(AbsenceType)
  @IsOptional()
  absenceType?: AbsenceType;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
