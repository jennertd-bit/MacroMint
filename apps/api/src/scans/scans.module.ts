import { Module } from "@nestjs/common";
import { ScansController } from "./scans.controller";
import { ScansService } from "./scans.service";
import { QueueModule } from "../queue/queue.module";

@Module({
  imports: [QueueModule],
  controllers: [ScansController],
  providers: [ScansService]
})
export class ScansModule {}
