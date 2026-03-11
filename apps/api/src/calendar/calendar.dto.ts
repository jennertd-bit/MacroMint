import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PlannerEventSource, PlannerEventType } from "@prisma/client";

export class CreateEventDto {
  @IsDateString()
  date!: string;

  @IsEnum(PlannerEventType)
  eventType!: PlannerEventType;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  plannedCalories!: number;

  @IsNumber()
  plannedProteinG!: number;

  @IsNumber()
  plannedCarbsG!: number;

  @IsNumber()
  plannedFatG!: number;

  @IsOptional()
  @IsEnum(PlannerEventSource)
  source?: PlannerEventSource;
}
