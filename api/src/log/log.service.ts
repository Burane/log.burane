import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogLevels, Prisma, Role } from '@prisma/client';
import { Order, Sort } from '../utils/types/pagination';

@Injectable()
export class LogService {
  constructor(
    private prisma: PrismaService,
  ) {
  }

  async create(message: string, level: LogLevels, date: Date, appId: string) {
    return await this.prisma.logMessage.create({ data: { date, level, message, applicationId: appId } });
  }

  async getById(id: string) {
    return await this.prisma.logMessage.findUnique({where: {id}});
  }


  async getAll(pageSize = 15, pageIndex = 0, search: string, sort: Sort[], appId: string) {
    const parameters: Prisma.LogMessageFindManyArgs = {
      skip: pageIndex * pageSize,
      take: pageSize,
      where: {
        applicationId: appId
      }
    };

    if (sort) {
      parameters.orderBy = sort.map(({ orderBy, sortBy }) => {
        return { [sortBy]: Order[orderBy] };
      });
    } else {
      parameters.orderBy = [{ date: 'asc' }];
    }

    if (search && search?.length > 0) {
      parameters.where = {
        OR: [
          {
            level: {
              in: [Role[search.toUpperCase()]],
            },
          },
          {
            message: {
              search: search
            },
          },
        ],
      };
    }

    const logMessages = await this.prisma.logMessage.findMany(parameters);

    const countParamsNoSearch: Prisma.LogMessageCountArgs = {};
    const countParamsSearch: Prisma.LogMessageCountArgs = { where: parameters.where };

    const countParams = parameters.where
      ? countParamsSearch
      : countParamsNoSearch;

    const totalSize = await this.prisma.logMessage.count(countParams);
    return {
      logMessages,
      totalSize,
      pageSize: pageSize,
      pageIndex,
      isPreviousPage: pageIndex > 0,
      isNextPage: pageIndex * pageSize < totalSize - pageSize,
      pageCount: Math.ceil(totalSize / pageSize),
    };
  }

}
