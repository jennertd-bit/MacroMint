import { IsEmail, IsIn, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsIn(["us", "metric"])
  units?: string;

  @IsOptional()
  @IsInt()
  heightCm?: number;

  @IsOptional()
  @IsInt()
  weightKg?: number;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @IsNumber()
  activityLevel?: number;

  @IsOptional()
  @IsIn(["maintain", "diet", "lose", "shred", "gain", "bulk", "custom"])
  goalPreset?: string;

  @IsOptional()
  @IsInt()
  adjustment?: number;

  @IsOptional()
  @IsString()
  timezone?: string;
}
