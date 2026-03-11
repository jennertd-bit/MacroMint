import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { CreateEventDto } from "./calendar.dto";
import { CalendarService } from "./calendar.service";

@Controller("calendar")
export class CalendarController {
  constructor(private readonly calendar: CalendarService) {}

  @UseGuards(JwtAuthGuard)
  @Post("events")
  create(@Req() req: any, @Body() dto: CreateEventDto) {
    return this.calendar.createEvent(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("events")
  list(@Req() req: any, @Query("from") from: string, @Query("to") to: string) {
    return this.calendar.listEvents(req.user.userId, from, to);
  }
}
