import { Module } from "@nestjs/common";
import { BillingModule } from "../billing/billing.module";
import { UsdaModule } from "../usda/usda.module";
import { PlansController } from "./plans.controller";
import { PlansService } from "./plans.service";

@Module({
  controllers: [PlansController],
  providers: [PlansService],
  imports: [BillingModule, UsdaModule]
})
export class PlansModule {}
