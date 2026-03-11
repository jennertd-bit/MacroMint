import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { CreateScanDto } from "./scans.dto";
import { ScansService } from "./scans.service";

@Controller("scans")
export class ScansController {
  constructor(private readonly scans: ScansService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateScanDto) {
    return this.scans.createScan(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/process")
  process(@Req() req: any, @Param("id") id: string) {
    return this.scans.processScan(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  get(@Req() req: any, @Param("id") id: string) {
    return this.scans.getScan(req.user.userId, id);
  }
}
