import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateAppDto } from './dto/create-app.dto';
import { AppEntity } from './entities/app.entity';
import { GetUser } from '../auth/decorators/get.user.decorator';
import { Application, LogLevel, User } from '@prisma/client';
import { PaginationQuery, PaginationResponse } from '../utils/types/pagination';
import { UpdateAppDto } from './dto/update-app.dto';

@UseGuards(JwtGuard)
@Controller('applications')
@ApiBearerAuth()
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {
  }

  @Post('create')
  @ApiCreatedResponse({ type: AppEntity })
  async create(@Body() { name, description }: CreateAppDto, @GetUser() user: User) {
    const app = await this.appService.create(name, description, user);
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

    const response: PaginationResponse<typeof applications[0]> = {
      results: applications,
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
    return new AppEntity(await this.appService.getById(id, user));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: AppEntity })
  async update(
    @Param('id') id: string,
    @Body() { name, description }: UpdateAppDto,
    @GetUser() user: User,
  ) {
    const updatedUser = await this.appService.updateById(id, user, name, description);

    return new AppEntity(updatedUser);
  }

  @Delete(':id')
  @ApiOkResponse({ type: AppEntity })
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return new AppEntity(await this.appService.removeById(id, user));
  }


}
