import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { UserService } from '../user/user.service';
import { JwtRefreshStrategy } from './guards/jwt.refresh.strategy';

@Module({
  imports: [PassportModule.register({}), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtGuard,
    JwtStrategy,
    JwtRefreshStrategy,
    RolesGuard,
    UserService,
  ],
})
export class AuthModule {}
