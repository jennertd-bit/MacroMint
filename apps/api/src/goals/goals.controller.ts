import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { SetGoalDto } from "./goals.dto";
import { GoalsService } from "./goals.service";

@Controller("goals")
export class GoalsController {
  constructor(private readonly goals: GoalsService) {}

  @UseGuards(JwtAuthGuard)
  @Get("current")
  getCurrent(@Req() req: any, @Query("date") date?: string) {
    return this.goals.getCurrentGoal(req.user.userId, date);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  setGoal(@Req() req: any, @Body() dto: SetGoalDto) {
    return this.goals.setGoal(req.user.userId, dto);
  }
}
