import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { PlansService } from "./plans.service";

@Controller("plans")
export class PlansController {
  constructor(private readonly plans: PlansService) {}

  @UseGuards(JwtAuthGuard)
  @Post("generate")
  generate(@Req() req: any, @Query("date") date?: string, @Body() body?: { date?: string }) {
    return this.plans.generate(req.user.userId, body?.date || date);
  }

  @UseGuards(JwtAuthGuard)
  @Post("generate-ai")
  generateAi(@Req() req: any, @Query("date") date?: string, @Body() body?: { date?: string }) {
    return this.plans.generateAi(req.user.userId, body?.date || date);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/accept")
  accept(@Req() req: any, @Param("id") id: string) {
    return this.plans.accept(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/reject")
  reject(@Req() req: any, @Param("id") id: string, @Body() body: { reason?: string }) {
    return this.plans.reject(req.user.userId, id, body?.reason);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/swap")
  swap(@Req() req: any, @Param("id") id: string) {
    return this.plans.swap(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any, @Query("from") from: string, @Query("to") to: string) {
    return this.plans.listEvents(req.user.userId, from, to);
  }
}
