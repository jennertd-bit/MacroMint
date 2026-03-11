import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { CreateFoodDto } from "./foods.dto";
import { FoodsService } from "./foods.service";

@Controller("foods")
export class FoodsController {
  constructor(private readonly foods: FoodsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  search(@Query("query") query?: string, @Query("barcode") barcode?: string) {
    return this.foods.search(query, barcode);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getFood(@Param("id") id: string) {
    return this.foods.getFood(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateFoodDto) {
    return this.foods.createFood(req.user.userId, dto);
  }
}
