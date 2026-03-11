import { Module } from "@nestjs/common";
import { AccountController, UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController, AccountController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
