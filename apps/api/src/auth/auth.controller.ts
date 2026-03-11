import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt.guard";
import { LoginDto, RefreshDto, SignupDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  @Post("signup")
  signup(@Body() dto: SignupDto) {
    return this.auth.signup(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post("refresh")
  async refresh(@Body() dto: RefreshDto) {
    try {
      const refreshSecret = this.config.get<string>("JWT_REFRESH_SECRET") ?? "change-me-too";
      const payload = await this.jwt.verifyAsync<{ sub: string }>(dto.refreshToken, {
        secret: refreshSecret
      });
      return this.auth.refresh(payload.sub, dto.refreshToken);
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@Req() req: any) {
    const user = req.user as { userId: string };
    return this.auth.logout(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req: any) {
    const user = req.user as { userId: string };
    return this.auth.me(user.userId);
  }
}
