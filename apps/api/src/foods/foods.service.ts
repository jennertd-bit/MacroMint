import { Injectable } from "@nestjs/common";
import { FoodSource } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { UsdaService } from "../usda/usda.service";
import { CreateFoodDto } from "./foods.dto";

@Injectable()
export class FoodsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usda: UsdaService
  ) {}

  async search(query?: string, barcode?: string) {
    const localFoods = await this.prisma.food.findMany({
      where: {
        OR: [
          barcode ? { barcode } : undefined,
          query
            ? {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { brand: { contains: query, mode: "insensitive" } }
                ]
              }
            : undefined
        ].filter(Boolean) as any
      },
      include: { nutrition: true, servings: true }
    });

    let usdaFoods: any[] = [];
    if (query) {
      try {
        const foods = await this.usda.searchFoods(query);
        usdaFoods = foods.map((food: any) => ({
          externalId: food.fdcId,
          name: food.description,
          brand: food.brandOwner,
          source: "USDA",
          nutrients: food.foodNutrients ?? []
        }));
      } catch (error) {
        usdaFoods = [];
      }
    }

    return { local: localFoods, usda: usdaFoods };
  }

  async getFood(id: string) {
    return this.prisma.food.findUnique({
      where: { id },
      include: { nutrition: true, servings: true }
    });
  }

  async createFood(userId: string, dto: CreateFoodDto) {
    const food = await this.prisma.food.create({
      data: {
        name: dto.name,
        brand: dto.brand,
        barcode: dto.barcode,
        source: dto.source ?? FoodSource.MANUAL,
        createdByUserId: userId,
        servings: {
          create: dto.servings
        },
        nutrition: {
          create: {
            caloriesPerServing: dto.nutrition.caloriesPerServing,
            proteinG: dto.nutrition.proteinG,
            carbsG: dto.nutrition.carbsG,
            fatG: dto.nutrition.fatG,
            fiberG: dto.nutrition.fiberG,
            sugarG: dto.nutrition.sugarG,
            sodiumMg: dto.nutrition.sodiumMg
          }
        }
      },
      include: { nutrition: true, servings: true }
    });

    return food;
  }
}
