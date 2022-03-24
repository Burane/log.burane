import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(email, password, role: Role = Role.USER) {
    const user = await this.getByEmail(email);

    if (user) throw new ConflictException('User already exist');

    await this.prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        role,
      },
    });
  }

  async getAll() {
    return await this.prisma.user.findMany();
  }

  async getById(userId: string) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email: email } });
  }

  async updateRefreshTokenById(refreshToken: string, id: string) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        refreshToken: refreshToken ? await bcrypt.hash(refreshToken, 10) : null,
      },
    });
  }

  async updateById(id: string, email: string, role: Role) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        email,
        role,
      },
    });
  }

  async updatePasswordById(id: string, password: string) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        password: await bcrypt.hash(password, 10),
      },
    });
  }

  async removeById(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
