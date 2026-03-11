import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { GetWeightHistoryDto, LogWeightDto } from "./weight.dto";

@Injectable()
export class WeightService {
  constructor(private readonly prisma: PrismaService) {}

  async logWeight(userId: string, dto: LogWeightDto) {
    const date = new Date(dto.date);
    date.setUTCHours(0, 0, 0, 0);

    return this.prisma.weightLog.upsert({
      where: { userId_date: { userId, date } },
      update: { weightKg: dto.weightKg, notes: dto.notes ?? null },
      create: { userId, date, weightKg: dto.weightKg, notes: dto.notes ?? null },
    });
  }

  async getHistory(userId: string, dto: GetWeightHistoryDto) {
    const from = dto.from ? new Date(dto.from) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const to = dto.to ? new Date(dto.to) : new Date();

    from.setUTCHours(0, 0, 0, 0);
    to.setUTCHours(23, 59, 59, 999);

    const entries = await this.prisma.weightLog.findMany({
      where: { userId, date: { gte: from, lte: to } },
      orderBy: { date: "asc" },
    });

    return entries.map((e) => ({
      date: e.date.toISOString().slice(0, 10),
      weightKg: e.weightKg,
      notes: e.notes,
    }));
  }

  async deleteEntry(userId: string, date: string) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    await this.prisma.weightLog.delete({ where: { userId_date: { userId, date: d } } });
    return { deleted: true };
  }
}
