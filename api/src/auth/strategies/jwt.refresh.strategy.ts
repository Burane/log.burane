import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: (request: Request) => {
        const refreshToken = request?.cookies?.['refreshToken'];
        if (!refreshToken) return null;
        return refreshToken;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET_KEY,
    });
  }

  async validate(payload: { userId: string }) {
    const user = await this.userService.getById(payload.userId);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
