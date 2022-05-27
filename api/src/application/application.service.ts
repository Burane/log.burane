import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { Order, Sort } from '../utils/types/pagination';
import * as util from 'util';

@Injectable()
export class ApplicationService {
  constructor(
    private prisma: PrismaService,
  ) {
  }

  async create(name: string, description: string, user: User) {
    return await this.prisma.application.create({ data: { description, name, userId: user.id } });
  }


  async getAll(pageSize = 15, pageIndex = 0, search: string, sort: Sort[], user: User) {
    const parameters: Prisma.ApplicationFindManyArgs = {
      // const parameters: Prisma.ApplicationAggregateArgs = {
      skip: pageIndex * pageSize,
      take: pageSize,
      where: { userId: user.id },
      include: {
        _count: {
          select: {
            logMessages : true
          }
        }
      }
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


    const applications = await Promise.all((await this.prisma.application.findMany(parameters)).map(async a => {
        const count = await this.prisma.logMessage.groupBy({
          by: ['level'],
          _count: true,
          where: {
            applicationId:a.id,
          },
        });
        return { ...a, logMessagesCount : [...count] };

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
    return await this.prisma.application.findUnique({ where: { appUserId: { userId: user.id, id } } });
  }

  async updateById(id: string, user: User, name: string, description: string) {
    return await this.prisma.application.update({
      where: { appUserId: { id, userId: user.id } },
      data: { name: name, description: description },
    });
  }

  async removeById(id: string, user: User) {
    return await this.prisma.application.delete({ where: { appUserId: { id, userId: user.id } } });
  }
}
