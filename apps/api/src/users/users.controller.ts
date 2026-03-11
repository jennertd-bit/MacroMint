import { Body, Controller, Get, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { UpdateAccountDto, UpdateProfileDto } from "./users.dto";
import { UsersService } from "./users.service";

@Controller("profile")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Req() req: any) {
    return this.users.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(req.user.userId, dto);
  }
}

@Controller("account")
export class AccountController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateAccount(@Req() req: any, @Body() dto: UpdateAccountDto) {
    const user = await this.users.updateAccount(req.user.userId, dto);
    return { user: { id: user.id, email: user.email, name: user.name ?? null } };
  }
}
