import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogLevels } from '@prisma/client';

@Injectable()
export class LogService {
  constructor(
    private prisma: PrismaService,
  ) {
  }

  async create(message: string, level: LogLevels, date: Date, appId: string) {
    return await this.prisma.logMessage.create({ data: { date, level, message, applicationId: appId } });
  }
}
