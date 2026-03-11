import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class GenerateWorkoutDto {
  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  tdeeValue?: number;

  @IsOptional()
  @IsNumber()
  adaptiveTdeeValue?: number;

  @IsOptional()
  @IsString()
  goalPreset?: string;

  @IsOptional()
  @IsNumber()
  activityLevel?: number;
}
