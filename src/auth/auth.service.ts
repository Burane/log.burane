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
import path from 'path';

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
      { id: user.id, email: user.email },
      { secret: user.password + user.id, expiresIn: 3600 },
    );

    const mail = await this.mailerService.sendMail({
      to: user.email,
      from: 'AB-Resto',
      subject: 'Password reset',
      template: path.join(process.cwd(), 'templates', 'resetPasswordMail'),
      context: { user, token },
    });
  }
}
