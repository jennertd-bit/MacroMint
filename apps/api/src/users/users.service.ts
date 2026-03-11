import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { UpdateAccountDto, UpdateProfileDto } from "./users.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (profile) return profile;
    return this.prisma.userProfile.create({
      data: { userId, timezone: "UTC", units: "us", goalPreset: "maintain", adjustment: 0 }
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        ...dto,
        units: dto.units ?? "us",
        goalPreset: dto.goalPreset ?? "maintain",
        adjustment: dto.adjustment ?? 0,
        timezone: dto.timezone ?? "UTC"
      }
    });
  }

  async updateAccount(userId: string, dto: UpdateAccountDto) {
    const email = dto.email?.toLowerCase();
    if (email) {
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== userId) {
        throw new BadRequestException("Email already in use");
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name ?? undefined,
        email: email ?? undefined
      }
    });
  }
}
