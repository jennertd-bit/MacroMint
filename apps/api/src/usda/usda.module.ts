import { Module } from "@nestjs/common";
import { UsdaService } from "./usda.service";

@Module({
  providers: [UsdaService],
  exports: [UsdaService]
})
export class UsdaModule {}
