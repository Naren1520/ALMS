import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';
import { JwtPayload } from '../../common/interfaces';
import { UserEntity } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /auth/register — Req 1.2 */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** POST /auth/login — Req 1.6, 1.7, 1.8 */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateLocalUser(dto.email, dto.password);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: 401,
        error: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    const { accessToken, refreshToken, message } = await this.authService.loginAndIssueTokens(
      user,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/v1/auth/refresh',
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      message,
    };
  }

  /** POST /auth/refresh — Req 1.8 */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const opaqueToken = req.cookies?.['refresh_token'] as string | undefined;
    if (!opaqueToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: 401,
        error: 'UNAUTHORIZED',
        message: 'No refresh token provided',
      });
    }

    const { accessToken, refreshToken } = await this.authService.refreshTokens(opaqueToken);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh',
    });

    return { accessToken };
  }

  /** POST /auth/logout */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const opaqueToken = req.cookies?.['refresh_token'] as string | undefined;
    if (opaqueToken) {
      await this.authService.logout(opaqueToken);
    }
    res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
    return { message: 'Logged out successfully' };
  }

  /** GET /auth/me — returns current user info */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: JwtPayload) {
    return { id: user.sub, email: user.email, role: user.role };
  }
}
