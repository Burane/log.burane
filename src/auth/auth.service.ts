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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
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
}
