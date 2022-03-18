import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
    private mailerService: MailerService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.getByEmail(email);

    if (!user) throw new NotFoundException(`No user found for email: ${email}`);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    await this.userService.updateRefreshTokenById(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
      user: new UserEntity(user),
    };
  }

  async logout(user: User) {
    await this.userService.updateRefreshTokenById(null, user.id);
  }

  generateAccessToken(user: User) {
    return this.jwtService.sign(
      { userId: user.id },
      {
        secret: process.env.JWT_ACCESS_SECRET_KEY,
        expiresIn: process.env.JWT_ACCESS_SECRET_EXPIRATION,
      },
    );
  }

  generateRefreshToken(user: User) {
    return this.jwtService.sign(
      { userId: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET_KEY,
        expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRATION,
      },
    );
  }

  async register(email: string, password: string, role: Role = Role.USER) {
    await this.userService.create(email, password, role);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.getByEmail(email);

    if (!user) throw new NotFoundException(`No user found for email: ${email}`);

    const token = this.jwtService.sign(
      { email: user.email },
      { secret: user.password + user.id + user.createdAt, expiresIn: 3600 },
    );

    await this.mailerService.sendMail({
      to: user.email,
      from: process.env.RESET_PASSWORD_SENDER_EMAIL,
      subject: 'Password reset',
      template: path.join(process.cwd(), 'resetPasswordMail'),
      context: { user, token },
    });
  }

  async resetPassword(password: string, token: string) {
    const payload: { [p: string]: any } | string =
      this.jwtService.decode(token);

    const user = await this.userService.getByEmail(payload['email']);

    if (!user)
      throw new NotFoundException(
        `No user found for email: ${payload['email']}`,
      );

    try {
      this.jwtService.verify(token, {
        secret: user.password + user.id + user.createdAt,
      });
    } catch (error) {
      throw new UnauthorizedException('Unable to verify the token');
    }

    await this.userService.updatePasswordById(user.id, password);
  }

  async refreshToken(user: User, refreshToken: string) {
    if (!user) throw new UnauthorizedException();

    const isRefreshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenMatch) throw new UnauthorizedException();

    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken(user);
    await this.userService.updateRefreshTokenById(refreshToken, user.id);

    return {
      newAccessToken,
      newRefreshToken,
    };
  }
}
