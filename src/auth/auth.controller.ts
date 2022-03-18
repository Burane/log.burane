import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @ApiBearerAuth()
  logout(@GetUser() user: User) {
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
  resetPassword(@Body() { password, token }: ResetPasswordDto) {
    return this.authService.resetPassword(password, token);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refreshToken')
  @ApiBearerAuth()
  async refreshToken(
    @GetUser() user: User,
    @Body() { refreshToken }: RefreshTokenDto,
  ) {
    return this.authService.refreshToken(user, refreshToken);
  }
}
