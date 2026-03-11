import { Module } from "@nestjs/common";
import { FoodsController } from "./foods.controller";
import { FoodsService } from "./foods.service";
import { UsdaModule } from "../usda/usda.module";

@Module({
  imports: [UsdaModule],
  controllers: [FoodsController],
  providers: [FoodsService],
  exports: [FoodsService]
})
export class FoodsModule {}
