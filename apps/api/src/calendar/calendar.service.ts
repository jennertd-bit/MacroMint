import { Injectable } from "@nestjs/common";
import { PlannerEventSource } from "@prisma/client";
import { DateTime } from "luxon";
import { PrismaService } from "../database/prisma.service";
import { CreateEventDto } from "./calendar.dto";

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(userId: string, dto: CreateEventDto) {
    return this.prisma.plannerEvent.create({
      data: {
        userId,
        date: new Date(dto.date),
        eventType: dto.eventType,
        title: dto.title,
        description: dto.description,
        plannedCalories: dto.plannedCalories,
        plannedProteinG: dto.plannedProteinG,
        plannedCarbsG: dto.plannedCarbsG,
        plannedFatG: dto.plannedFatG,
        source: dto.source ?? PlannerEventSource.USER
      }
    });
  }

  async listEvents(userId: string, from: string, to: string) {
    const start = DateTime.fromISO(from).startOf("day").toJSDate();
    const end = DateTime.fromISO(to).endOf("day").toJSDate();

    return this.prisma.plannerEvent.findMany({
      where: { userId, date: { gte: start, lte: end } },
      orderBy: { date: "asc" }
    });
  }
}
