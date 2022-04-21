  import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { Order, Sort } from '../utils/types/pagination';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async create(email, password, role: Role = Role.USER) {
    const user = await this.getByEmail(email);

    if (user) throw new ConflictException('User already exist');

    return await this.prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        role,
      },
    });
  }

  async getAll(pageSize = 15, pageIndex = 0, search: string, sort: Sort[]) {
    const parameters: Prisma.UserFindManyArgs = {
      skip: pageIndex * pageSize,
      take: pageSize,
    };

    if (sort) {
      parameters.orderBy = sort.map(({ orderBy, sortBy }) => {
        return { [sortBy]: Order[orderBy] };
      });
    } else {
      parameters.orderBy = [{ createdAt: 'desc' }];
    }

    if (search && search?.length > 0) {
      parameters.where = {
        OR: [
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            id: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            role: {
              in: [Role[search.toUpperCase()]],
            },
          },
        ],
      };
    }

    const users = await this.prisma.user.findMany(parameters);

    const countParamsNoSearch: Prisma.UserCountArgs = {};
    const countParamsSearch: Prisma.UserCountArgs = { where: parameters.where };

    const countParams = parameters.where
      ? countParamsSearch
      : countParamsNoSearch;

    const totalSize = await this.prisma.user.count(countParams);
    return {
      users,
      totalSize,
      pageSize: pageSize,
      pageIndex,
      isPreviousPage: pageIndex > 0,
      isNextPage: pageIndex * pageSize < totalSize - pageSize,
      pageCount: Math.ceil(totalSize / pageSize),
    };
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

  async updateById(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const userExists = await this.getByEmail(updateUserDto.email);
      if (userExists) throw new ConflictException('Email is already in use');
    }

    const user = await this.getById(id);
    if (!user) throw new NotFoundException(`No user found for id: ${id}`);

    const formattedUser = { ...updateUserDto };

    if (updateUserDto.password) {
      const isPasswordValid = await bcrypt.compare(
        updateUserDto.password,
        user.password,
      );
      if (!isPasswordValid) throw new BadRequestException('Invalid password');

      const refreshToken = this.authService.generateRefreshToken(user);

      Object.assign(formattedUser, {
        password: await bcrypt.hash(updateUserDto.newPassword, 10),
        refreshToken: await bcrypt.hash(refreshToken, 10),
      });

      delete formattedUser.newPassword;
      delete formattedUser.confirmNewPassword;
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...formattedUser,
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
