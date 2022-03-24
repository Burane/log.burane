import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { roleArray } from '../../utils/types/role.array';

export class UpdateUserDto {
  @ApiProperty()
  @IsEmail()
  email?: string;

  @ApiProperty({ enum: roleArray })
  @IsEnum(Role, { message: 'Role is not valid' })
  role?: Role;
}
