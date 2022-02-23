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
import { Role } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CanCUDUserGuard } from './guards/canCUDUser.guard';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CanCUDUserGuard)
  @Post('create')
  create(@Body() { email, password, role }: CreateUserDto) {
    return this.userService.create(email, password, role);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  @Get('all')
  findAll() {
    return this.userService.getAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @UseGuards(CanCUDUserGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() { email, password, role }: UpdateUserDto,
  ) {
    return this.userService.updateById(id, email, password, role);
  }

  @UseGuards(CanCUDUserGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeById(id);
  }
}
