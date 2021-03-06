import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateAppDto } from './dto/create-app.dto';
import { AppEntity } from './entities/app.entity';
import { GetUser } from '../auth/decorators/get.user.decorator';
import { User } from '@prisma/client';
import { PaginationQuery, PaginationResponse } from '../utils/types/pagination';
import { UpdateAppDto } from './dto/update-app.dto';
import { appWithStats } from '../utils/types/AppWithStats';

@UseGuards(JwtGuard)
@Controller('applications')
@ApiBearerAuth()
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {
  }

  @Post('create')
  @ApiCreatedResponse({ type: AppEntity })
  async create(@Body() { name, description, discordWebhookUrl }: CreateAppDto, @GetUser() user: User) {
    const app = await this.appService.create(name, description, discordWebhookUrl, user);
    return new AppEntity(app);
  }

  @Post(':id/createWebhook')
  @ApiCreatedResponse({ type: AppEntity })
  async createWebhook(@Param('id') id: string, @GetUser() user: User) {
    const app = await this.appService.createWebhook(id, user);
    return new AppEntity(app);

  }


  @ApiCreatedResponse({ type: PaginationResponse })
  @Get('')
  async findAll(
    @Query()
      { sort, search, pagination }: PaginationQuery,
    @GetUser() user: User,
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
    } = await this.appService.getAll(pageSize, pageIndex, search, sort, user);

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
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    return new AppEntity(await this.appService.getByIdAndUserId(id, user));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: AppEntity })
  async update(
    @Param('id') id: string,
    @Body() { name, description, discordWebhookUrl }: UpdateAppDto,
    @GetUser() user: User,
  ) {
    return await this.appService.updateById(id, user, name, description, discordWebhookUrl);
  }

  @Delete(':id')
  @ApiOkResponse({ type: AppEntity })
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return new AppEntity(await this.appService.removeById(id, user));
  }


}
