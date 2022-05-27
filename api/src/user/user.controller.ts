import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res, UploadedFile,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CanCUDUserGuard } from './guards/canCUDUser.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { getRefreshTokenExpiration } from 'src/utils';
import { PaginationQuery, PaginationResponse } from '../utils/types/pagination';
import { users } from '../../prisma/seed/users';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CanCUDUserGuard)
  @Post('create')
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() { email, password, role, username }: CreateUserDto) {
    const user = await this.userService.create(email, password, role, username);
    return new UserEntity(user);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: PaginationResponse })
  @Get('')
  async findAll(
    @Query()
    { sort, search, pagination }: PaginationQuery,
  ) {
    const { pageSize, pageIndex } = pagination ?? {};
    const {
      users,
      pageSize: size,
      pageCount,
      totalSize,
      pageIndex: index,
      isPreviousPage,
      isNextPage,
    } = await this.userService.getAll(pageSize, pageIndex, search, sort);

    const response: PaginationResponse<UserEntity> = {
      results: users.map((u) => new UserEntity(u)),
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

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    return new UserEntity(await this.userService.getById(id));
  }

  @UseGuards(CanCUDUserGuard)
  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateById(id, updateUserDto);

    res.cookie('refreshToken', updatedUser.refreshToken, {
      httpOnly: true,
      expires: getRefreshTokenExpiration(),
      secure: true,
      sameSite: 'none',
    });

    return new UserEntity(updatedUser);
  }

  @UseGuards(CanCUDUserGuard)
  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id') id: string) {
    return new UserEntity(await this.userService.removeById(id));
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {

  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {

  }
}
