import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { PrismaService } from "../database/prisma.service";
import { LoginDto, SignupDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  private async issueTokens(userId: string, email: string) {
    const accessSecret = this.config.get<string>("JWT_SECRET") ?? "change-me";
    const refreshSecret = this.config.get<string>("JWT_REFRESH_SECRET") ?? "change-me-too";
    const accessTtl = this.config.get<string>("ACCESS_TOKEN_TTL") ?? "15m";
    const refreshTtl = this.config.get<string>("REFRESH_TOKEN_TTL") ?? "7d";

    const accessToken = await this.jwt.signAsync(
      { sub: userId, email },
      { secret: accessSecret, expiresIn: accessTtl }
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, email },
      { secret: refreshSecret, expiresIn: refreshTtl }
    );

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    const hash = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash }
    });
  }

  async signup(dto: SignupDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException("Email already exists");

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name ?? null,
        passwordHash,
        profile: {
          create: { timezone: "UTC" }
        }
      }
    });

    const tokens = await this.issueTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitize(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("No account found for this email. Create an account first.");
    }

    const matches = await argon2.verify(user.passwordHash, dto.password);
    if (!matches) throw new UnauthorizedException("Incorrect password");

    const tokens = await this.issueTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitize(user), ...tokens };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException("Invalid refresh token");

    const valid = await argon2.verify(user.refreshTokenHash, refreshToken);
    if (!valid) throw new UnauthorizedException("Invalid refresh token");

    const tokens = await this.issueTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitize(user), ...tokens };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null }
    });
    return { status: "ok" };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
    if (!user) throw new UnauthorizedException();
    return { user: this.sanitize(user), profile: user.profile };
  }

  sanitize(user: { id: string; email: string; name?: string | null }) {
    return { id: user.id, email: user.email, name: user.name ?? null };
  }
}
