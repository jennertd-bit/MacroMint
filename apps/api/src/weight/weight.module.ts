import { Module } from "@nestjs/common";
import { WeightController } from "./weight.controller";
import { WeightService } from "./weight.service";

@Module({
  controllers: [WeightController],
  providers: [WeightService],
  exports: [WeightService],
})
export class WeightModule {}
