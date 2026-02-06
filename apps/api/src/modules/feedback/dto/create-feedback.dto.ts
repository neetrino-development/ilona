import { IsString, IsOptional, IsInt, Min, Max, MaxLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  lessonId!: string;

  @IsString()
  studentId!: string;

  @IsString()
  @MaxLength(5000)
  content!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  strengths?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  improvements?: string;
}

