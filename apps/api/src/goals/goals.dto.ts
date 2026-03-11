import { IsDateString, IsEnum, IsNumber, IsOptional } from "class-validator";
import { GoalType } from "@prisma/client";

export class SetGoalDto {
  @IsEnum(GoalType)
  goalType!: GoalType;

  @IsNumber()
  targetCalories!: number;

  @IsNumber()
  targetProteinG!: number;

  @IsNumber()
  targetCarbsG!: number;

  @IsNumber()
  targetFatG!: number;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}
