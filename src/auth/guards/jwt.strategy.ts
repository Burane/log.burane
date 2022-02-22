import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as Process from 'process';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: { userId: string }) {
    const user = await this.userService.getById(payload.userId);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
