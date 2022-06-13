import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Application, Prisma, User } from '@prisma/client';
import { Order, Sort } from '../utils/types/pagination';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class ApplicationService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
  }

  async create(name: string, description: string, user: User) {
    const app = await this.prisma.application.create({
      data: { description, name, userId: user.id },
      include: {
        _count: {
          select: {
            logMessages: true,
          },
        },
      },
    });
    const count = await this.prisma.logMessage.groupBy({
      by: ['level'],
      _count: true,
      where: {
        applicationId: app.id,
      },
    });
    return { ...app, logMessagesCount: [...count] };

  }


  async getAll(pageSize = 15, pageIndex = 0, search: string, sort: Sort[], user: User) {
    const parameters: Prisma.ApplicationFindManyArgs = {
      skip: pageIndex * pageSize,
      take: pageSize,
      where: { userId: user.id },
    };

    if (sort) {
      parameters.orderBy = sort.map(({ orderBy, sortBy }) => {
        return { [sortBy]: Order[orderBy] };
      });
    } else {
      parameters.orderBy = [{ name: 'desc' }];
    }

    if (search && search?.length > 0) {
      parameters.where.OR = [
        {
          name: {
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
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const applications = await Promise.all((await this.prisma.application.findMany({
        ...parameters, include: {
          _count: {
            select: {
              logMessages: true,
            },
          },
        },
      })).map(async app => {
        const count = await this.prisma.logMessage.groupBy({
          by: ['level'],
          _count: true,
          where: {
            applicationId: app.id,
          },
        });
        return { ...app, logMessagesCount: [...count] };

      }),
    );

    const countParamsNoSearch: Prisma.ApplicationCountArgs = {};
    const countParamsSearch: Prisma.ApplicationCountArgs = { where: parameters.where };

    const countParams = parameters.where
      ? countParamsSearch
      : countParamsNoSearch;

    const totalSize = await this.prisma.application.count(countParams);
    return {
      applications,
      totalSize,
      pageSize: pageSize,
      pageIndex,
      isPreviousPage: pageIndex > 0,
      isNextPage: pageIndex * pageSize < totalSize - pageSize,
      pageCount: Math.ceil(totalSize / pageSize),
    };
  }

  async getById(id: string, user: User) {
    const app = await this.prisma.application.findUnique({
      where: { appUserId: { userId: user.id, id } },
      include: {
        _count: {
          select: {
            logMessages: true,
          },
        },
      },
    });
    const count = await this.prisma.logMessage.groupBy({
      by: ['level'],
      _count: true,
      where: {
        applicationId: app.id,
      },
    });
    return { ...app, logMessagesCount: [...count] };
  }

  async updateById(id: string, user: User, name: string, description: string) {
    const app = await this.prisma.application.update({
      where: { appUserId: { id, userId: user.id } },
      data: { name: name, description: description },
      include: {
        _count: {
          select: {
            logMessages: true,
          },
        },
      },
    });
    const count = await this.prisma.logMessage.groupBy({
      by: ['level'],
      _count: true,
      where: {
        applicationId: app.id,
      },
    });
    return { ...app, logMessagesCount: [...count] };
  }

  async removeById(id: string, user: User) {
    const app = await this.prisma.application.delete({
      where: { appUserId: { id, userId: user.id } },
      include: {
        _count: {
          select: {
            logMessages: true,
          },
        },
      },
    });
    const count = await this.prisma.logMessage.groupBy({
      by: ['level'],
      _count: true,
      where: {
        applicationId: app.id,
      },
    });
    return { ...app, logMessagesCount: [...count] };
  }

  async createWebhook(id: string, user: User) {
    const app = await this.prisma.application.findUnique({ where: { appUserId: { userId: user.id, id: id } } });

    if (!app) throw new NotFoundException('No application found');

    const token = this.jwtService.sign(
      { appId: app.id },
      { secret: app.id + app.userId },
    );

    const appUpdated = await this.prisma.application.update({
      where: { appUserId: { userId: user.id, id: id } },
      data: {
        webhookSecret: token
      },
      include: {
        _count: {
          select: {
            logMessages: true,
          },
        },
      },
    });

    const count = await this.prisma.logMessage.groupBy({
      by: ['level'],
      _count: true,
      where: {
        applicationId: appUpdated.id,
      },
    });
    return { ...appUpdated, logMessagesCount: [...count] };
  }
}
