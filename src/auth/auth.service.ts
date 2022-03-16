import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';

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

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
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
}
