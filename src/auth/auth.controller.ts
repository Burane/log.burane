import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('register')
  register(@Body() { email, password }: CreateUserDto) {
    return this.authService.register(email, password);
  }

  @Post('forgotPassword')
  forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this;
  }
}
