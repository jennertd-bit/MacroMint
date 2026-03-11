import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { MealSlot, ServingUnit } from "@prisma/client";

export class CreateMealDto {
  @IsDateString()
  loggedAt!: string;

  @IsEnum(MealSlot)
  mealSlot!: MealSlot;

  @IsOptional()
  @IsString()
  customSlotName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddMealItemDto {
  @IsString()
  foodId!: string;

  @IsNumber()
  servingQty!: number;

  @IsEnum(ServingUnit)
  servingUnit!: ServingUnit;
}
