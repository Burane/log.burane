import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AppEntity } from '../application/entities/app.entity';
import { GetUser } from '../auth/decorators/get.user.decorator';
import { LogMessage, User } from '@prisma/client';
import { PaginationQuery, PaginationResponse } from '../utils/types/pagination';
import { appWithStats } from '../utils/types/AppWithStats';
import { LogEntity } from './entities/log.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { UserOwnAppGuard } from './guards/UserOwnApp.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(UserOwnAppGuard)
@UseGuards(JwtGuard)
@Controller('applications/:appId/logs')
export class LogController {
  constructor(private readonly logService: LogService) {
  }

  @Post('create')
  @ApiCreatedResponse({ type: LogEntity })
  async create(@Body() { message, level, date }: CreateLogDto, @Param('appId') appId: string) {
    const log = await this.logService.create(message, level, date, appId);
    return new LogEntity(log);
  }

  @ApiCreatedResponse({ type: PaginationResponse })
  @Get('')
  async findAll(
    @Query()
      { sort, search, pagination }: PaginationQuery,
    @Param('appId') appId: string
  ) {
    const { pageSize, pageIndex } = pagination ?? {};
    const {
      logMessages,
      pageSize: size,
      pageCount,
      totalSize,
      pageIndex: index,
      isPreviousPage,
      isNextPage,
    } = await this.logService.getAll(pageSize, pageIndex, search, sort, appId);

    const response: PaginationResponse<LogMessage> = {
      results: logMessages.map(app => new LogEntity(app)),
      pagination: {
        totalSize,
        pageCount,
        pageSize: size,
        pageIndex: index,
        isNextPage,
        isPreviousPage,
      },
    };
    return response;
  }

  @Get(':id')
  @ApiOkResponse({ type: LogEntity })
  async findOne(@Param('id') id: string) {
    return new LogEntity(await this.logService.getById(id));
  }


}
