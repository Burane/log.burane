import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CanCUDUserGuard } from './guards/canCUDUser.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@Controller('user')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CanCUDUserGuard)
  @Post('create')
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() { email, password, role }: CreateUserDto) {
    return this.userService.create(email, password, role);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  @Get('all')
  @ApiOkResponse({ type: [UserEntity] })
  async findAll() {
    return (await this.userService.getAll()).map((u) => new UserEntity(u));
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
    @Body() { email, role }: UpdateUserDto,
  ) {
    return new UserEntity(await this.userService.updateById(id, email, role));
  }

  @UseGuards(CanCUDUserGuard)
  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id') id: string) {
    return new UserEntity(await this.userService.removeById(id));
  }
}
