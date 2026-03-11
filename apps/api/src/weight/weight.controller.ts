import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { GetWeightHistoryDto, LogWeightDto } from "./weight.dto";
import { WeightService } from "./weight.service";

@Controller("weight")
export class WeightController {
  constructor(private readonly weight: WeightService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  log(@Req() req: any, @Body() dto: LogWeightDto) {
    return this.weight.logWeight(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  history(@Req() req: any, @Query() query: GetWeightHistoryDto) {
    return this.weight.getHistory(req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":date")
  delete(@Req() req: any, @Param("date") date: string) {
    return this.weight.deleteEntry(req.user.userId, date);
  }
}
