import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { SetGoalDto } from "./goals.dto";

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentGoal(userId: string, date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    return this.prisma.goal.findFirst({
      where: {
        userId,
        effectiveFrom: { lte: targetDate },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: targetDate } }]
      },
      orderBy: { effectiveFrom: "desc" }
    });
  }

  async setGoal(userId: string, dto: SetGoalDto) {
    const effectiveFrom = dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date();
    await this.prisma.goal.updateMany({
      where: {
        userId,
        effectiveTo: null,
        effectiveFrom: { lte: effectiveFrom }
      },
      data: { effectiveTo: effectiveFrom }
    });

    return this.prisma.goal.create({
      data: {
        userId,
        goalType: dto.goalType,
        targetCalories: Math.round(dto.targetCalories),
        targetProteinG: Math.round(dto.targetProteinG),
        targetCarbsG: Math.round(dto.targetCarbsG),
        targetFatG: Math.round(dto.targetFatG),
        effectiveFrom
      }
    });
  }
}
