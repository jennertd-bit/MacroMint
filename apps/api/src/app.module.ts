import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { BillingModule } from "./billing/billing.module";
import { CalendarModule } from "./calendar/calendar.module";
import { FoodsModule } from "./foods/foods.module";
import { GoalsModule } from "./goals/goals.module";
import { HealthModule } from "./health/health.module";
import { MealsModule } from "./meals/meals.module";
import { PlansModule } from "./plans/plans.module";
import { ScansModule } from "./scans/scans.module";
import { UsersModule } from "./users/users.module";
import { WeightModule } from "./weight/weight.module";
import { WorkoutModule } from "./workout/workout.module";
import { PrismaModule } from "./database/prisma.module";
import { QueueModule } from "./queue/queue.module";
import { UsdaModule } from "./usda/usda.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    QueueModule,
    UsdaModule,
    AuthModule,
    UsersModule,
    FoodsModule,
    GoalsModule,
    MealsModule,
    ScansModule,
    PlansModule,
    CalendarModule,
    WeightModule,
    WorkoutModule,
    BillingModule,
    HealthModule
  ]
})
export class AppModule {}
