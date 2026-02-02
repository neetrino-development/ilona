import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  level?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  maxStudents?: number;

  @IsString()
  centerId!: string;

  @IsString()
  @IsOptional()
  teacherId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
