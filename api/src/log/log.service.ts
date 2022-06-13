import { forwardRef,  Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogLevels, Prisma, Role } from '@prisma/client';
import { Order, Sort } from '../utils/types/pagination';
import { JwtService } from '@nestjs/jwt';
import { ApplicationService } from '../application/application.service';
import { HttpService } from '@nestjs/axios';
import { switchAll } from 'rxjs';

@Injectable()
export class LogService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => ApplicationService))
    private appService: ApplicationService,
    private httpService: HttpService
  ) {
  }

  async create(message: string, level: LogLevels, date: Date, token: string) {
    const payload: { [p: string]: any } | string =
      this.jwtService.decode(token);

    const app = await this.appService.getById(payload['appId']);

    if (!app)
      throw new NotFoundException(
        `No application found for id: ${payload['appId']}`,
      );

    try {
      this.jwtService.verify(token, {
        secret: app.id + app.userId + app.webhookSecret,
      });
    } catch (error) {
      throw new UnauthorizedException('Unable to verify the token');
    }

    if ((level === LogLevels.ERROR || level === LogLevels.FATAL) && app.discordWebhookUrl) {
      // send webhook
      this.httpService.post(app.discordWebhookUrl,
        {
          content: null,
          embeds: [
            {
              title: `A log of level ${level} has occurred on your application : ${app.name}`,
              description: message,
              url: process.env.CLIENT_URL,
              color: () => {
                switch (level) {
                  case LogLevels.ERROR: return 14038823;
                  case LogLevels.FATAL: return 8388736;
                  default: return 5814783
                }
              },
              footer: {
                text: "Log.Burane"
              },
              timestamp: date,
            }
          ],
          username: "Log.Burane",
          attachments: []
        })
    }

    return await this.prisma.logMessage.create({ data: { date, level, message, applicationId: app.id } });
  }

  async getById(id: string) {
    return await this.prisma.logMessage.findUnique({ where: { id } });
  }


  async getAll(pageSize = 15, pageIndex = 0, search: string, sort: Sort[], appId: string) {
    const parameters: Prisma.LogMessageFindManyArgs = {
      skip: pageIndex * pageSize,
      take: pageSize,
      where: {
        applicationId: appId,
      },
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
              search: search,
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
