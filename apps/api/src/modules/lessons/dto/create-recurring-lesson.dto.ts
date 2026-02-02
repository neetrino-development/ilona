import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
  MaxLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ScheduleSlotDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number; // 0-6 (Sunday-Saturday)

  @IsString()
  time!: string; // "09:00"
}

export class CreateRecurringLessonDto {
  @IsString()
  groupId!: string;

  @IsString()
  teacherId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  schedule!: ScheduleSlotDto[];

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsInt()
  @IsOptional()
  @Min(15)
  @Max(240)
  duration?: number;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  topic?: string;
}
