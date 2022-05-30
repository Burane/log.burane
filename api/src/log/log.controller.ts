import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AppEntity } from '../application/entities/app.entity';
import { GetUser } from '../auth/decorators/get.user.decorator';
import { User } from '@prisma/client';
import { PaginationQuery, PaginationResponse } from '../utils/types/pagination';
import { appWithStats } from '../utils/types/AppWithStats';
import { LogEntity } from './entities/log.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { UserOwnAppGuard } from './guards/UserOwnApp.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@UseGuards(UserOwnAppGuard)
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
    @GetUser() user: User,
    @Param('appId') appId: string
  ) {
    const { pageSize, pageIndex } = pagination ?? {};
    const {
      applications,
      pageSize: size,
      pageCount,
      totalSize,
      pageIndex: index,
      isPreviousPage,
      isNextPage,
    } = await this.logService.getAll(pageSize, pageIndex, search, sort, appId);

    const response: PaginationResponse<appWithStats> = {
      results: applications.map(app => new AppEntity(app)),
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
  @ApiOkResponse({ type: AppEntity })
  async findOne(@Param('id') id: string) {
    return new AppEntity(await this.logService.getById(id));
  }


}
