import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { GetUser } from './decorators/get.user.decorator';
import { User } from '@prisma/client';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshTokenGuard } from './guards/refresh.token.guard';
import { UserEntity } from 'src/user/entities/user.entity';
import { getRefreshTokenExpiration } from 'src/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...user } = await this.authService.login(
      email,
      password,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: getRefreshTokenExpiration(),
      secure: process.env.NODE_ENV === 'development',
      sameSite: 'none',
    });

    return user;
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @ApiBearerAuth()
  logout(@GetUser() user: User, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return this.authService.logout(user);
  }

  @Post('register')
  register(@Body() { email, password }: CreateUserDto) {
    return this.authService.register(email, password);
  }

  @Post('forgotPassword')
  forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @Post('resetPassword')
  async resetPassword(
    @Body() { password, token }: ResetPasswordDto,
    @Res({ passthrough: true }) res,
  ) {
    res.clearCookie('refreshToken');
    return new UserEntity(await this.authService.resetPassword(password, token));
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refreshToken')
  @ApiBearerAuth()
  async refreshToken(
    @GetUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    const tokens = await this.authService.refreshToken(user, refreshToken);

    res.cookie('refreshToken', tokens.newRefreshToken, {
      httpOnly: true,
      expires: getRefreshTokenExpiration(),
      secure: process.env.NODE_ENV === 'development',
      sameSite: 'none',
    });

    return {
      accessToken: tokens.newAccessToken,
      user: new UserEntity(user),
    };
  }

  @UseGuards(JwtGuard)
  @Get('me')
  @ApiBearerAuth()
  async me(@GetUser() user: User) {
    return new UserEntity(user);
  }
}
