import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import * as Process from 'process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: { userId: string }) {
    const user = await this.authService.getUserById(payload.userId);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
