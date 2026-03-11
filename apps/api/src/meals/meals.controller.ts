import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { AddMealItemDto, CreateMealDto } from "./meals.dto";
import { MealsService } from "./meals.service";

@Controller()
export class MealsController {
  constructor(private readonly meals: MealsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("meals")
  create(@Req() req: any, @Body() dto: CreateMealDto) {
    return this.meals.createMeal(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("meals/:id/items")
  addItem(@Req() req: any, @Param("id") id: string, @Body() dto: AddMealItemDto) {
    return this.meals.addMealItem(req.user.userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("meals")
  getMeals(@Req() req: any, @Query("date") date: string) {
    return this.meals.getMeals(req.user.userId, date);
  }

  @UseGuards(JwtAuthGuard)
  @Get("totals/daily")
  getTotals(@Req() req: any, @Query("from") from: string, @Query("to") to: string) {
    return this.meals.getDailyTotals(req.user.userId, from, to);
  }
}
