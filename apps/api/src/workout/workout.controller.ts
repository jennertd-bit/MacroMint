import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { GenerateWorkoutDto } from "./workout.dto";
import { WorkoutService } from "./workout.service";

@Controller("workout")
export class WorkoutController {
  constructor(private readonly workout: WorkoutService) {}

  @UseGuards(JwtAuthGuard)
  @Post("generate")
  generate(@Req() _req: any, @Body() dto: GenerateWorkoutDto) {
    return this.workout.generate(dto);
  }
}
