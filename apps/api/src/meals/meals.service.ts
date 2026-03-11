import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DateTime } from "luxon";
import { PrismaService } from "../database/prisma.service";
import { AddMealItemDto, CreateMealDto } from "./meals.dto";
import { ServingUnit } from "@prisma/client";

@Injectable()
export class MealsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getUserTimezone(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    return profile?.timezone ?? "UTC";
  }

  private computeMacros(
    servingQty: number,
    servingUnit: ServingUnit,
    nutrition: { caloriesPerServing: number; proteinG: number; carbsG: number; fatG: number },
    serving: { gramsPerServing?: number | null; mlPerServing?: number | null }
  ) {
    let multiplier = servingQty;

    if (servingUnit === ServingUnit.GRAMS) {
      if (!serving.gramsPerServing) {
        throw new BadRequestException("Missing grams per serving for this food");
      }
      multiplier = servingQty / serving.gramsPerServing;
    }

    if (servingUnit === ServingUnit.ML) {
      if (!serving.mlPerServing) {
        throw new BadRequestException("Missing ml per serving for this food");
      }
      multiplier = servingQty / serving.mlPerServing;
    }

    return {
      calories: nutrition.caloriesPerServing * multiplier,
      proteinG: nutrition.proteinG * multiplier,
      carbsG: nutrition.carbsG * multiplier,
      fatG: nutrition.fatG * multiplier
    };
  }

  async createMeal(userId: string, dto: CreateMealDto) {
    return this.prisma.mealLog.create({
      data: {
        userId,
        loggedAt: new Date(dto.loggedAt),
        mealSlot: dto.mealSlot,
        customSlotName: dto.customSlotName,
        notes: dto.notes
      }
    });
  }

  async addMealItem(userId: string, mealLogId: string, dto: AddMealItemDto) {
    const meal = await this.prisma.mealLog.findFirst({
      where: { id: mealLogId, userId },
      include: { items: true }
    });
    if (!meal) throw new NotFoundException("Meal log not found");

    const food = await this.prisma.food.findUnique({
      where: { id: dto.foodId },
      include: { nutrition: true, servings: true }
    });

    if (!food || !food.nutrition) throw new NotFoundException("Food not found");
    const serving = food.servings[0];
    if (!serving) throw new BadRequestException("Food has no serving definition");

    const macros = this.computeMacros(dto.servingQty, dto.servingUnit, food.nutrition, serving);
    const timezone = await this.getUserTimezone(userId);
    const dateKey = DateTime.fromJSDate(meal.loggedAt).setZone(timezone).startOf("day").toJSDate();

    return this.prisma.$transaction(async (tx) => {
      const item = await tx.mealLogItem.create({
        data: {
          mealLogId,
          foodId: dto.foodId,
          servingQty: dto.servingQty,
          servingUnit: dto.servingUnit,
          computedCalories: macros.calories,
          computedProteinG: macros.proteinG,
          computedCarbsG: macros.carbsG,
          computedFatG: macros.fatG
        }
      });

      await tx.dailyTotal.upsert({
        where: { userId_date: { userId, date: dateKey } },
        update: {
          calories: { increment: macros.calories },
          proteinG: { increment: macros.proteinG },
          carbsG: { increment: macros.carbsG },
          fatG: { increment: macros.fatG }
        },
        create: {
          userId,
          date: dateKey,
          calories: macros.calories,
          proteinG: macros.proteinG,
          carbsG: macros.carbsG,
          fatG: macros.fatG
        }
      });

      return item;
    });
  }

  async getMeals(userId: string, date: string) {
    const timezone = await this.getUserTimezone(userId);
    const start = DateTime.fromISO(date).setZone(timezone).startOf("day");
    const end = start.endOf("day");

    return this.prisma.mealLog.findMany({
      where: {
        userId,
        loggedAt: {
          gte: start.toJSDate(),
          lte: end.toJSDate()
        }
      },
      include: {
        items: { include: { food: true } }
      },
      orderBy: { loggedAt: "asc" }
    });
  }

  async getDailyTotals(userId: string, from: string, to: string) {
    const start = DateTime.fromISO(from).startOf("day").toJSDate();
    const end = DateTime.fromISO(to).endOf("day").toJSDate();

    return this.prisma.dailyTotal.findMany({
      where: {
        userId,
        date: { gte: start, lte: end }
      },
      orderBy: { date: "asc" }
    });
  }
}
