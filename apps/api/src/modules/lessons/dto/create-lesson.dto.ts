import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateLessonDto {
  @IsString()
  groupId!: string;

  @IsString()
  teacherId!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsInt()
  @IsOptional()
  @Min(15)
  @Max(240)
  duration?: number; // minutes

  @IsString()
  @IsOptional()
  @MaxLength(200)
  topic?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
}
