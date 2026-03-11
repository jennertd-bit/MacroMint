import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { FoodSource } from "@prisma/client";

export class FoodServingDto {
  @IsString()
  @IsNotEmpty()
  labelServingName!: string;

  @IsOptional()
  @IsNumber()
  gramsPerServing?: number;

  @IsOptional()
  @IsNumber()
  mlPerServing?: number;

  @IsOptional()
  @IsNumber()
  servingCountPerContainer?: number;
}

export class FoodNutritionDto {
  @IsNumber()
  caloriesPerServing!: number;

  @IsNumber()
  proteinG!: number;

  @IsNumber()
  carbsG!: number;

  @IsNumber()
  fatG!: number;

  @IsOptional()
  @IsNumber()
  fiberG?: number;

  @IsOptional()
  @IsNumber()
  sugarG?: number;

  @IsOptional()
  @IsNumber()
  sodiumMg?: number;
}

export class CreateFoodDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsEnum(FoodSource)
  source?: FoodSource;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodServingDto)
  servings!: FoodServingDto[];

  @ValidateNested()
  @Type(() => FoodNutritionDto)
  nutrition!: FoodNutritionDto;
}
