import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { roleArray } from '../../utils/types/role.array';
import { PASSWORD_REGEX } from 'src/constants';
import { Match } from 'src/utils/decorator/match.decorator';
import { CreateUserDto } from './create-user.dto';
import { Trim } from '../../utils/decorator/trim.decorator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @Trim()
  password?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @Matches(PASSWORD_REGEX, {
    message: 'New password is too weak',
    groups: ['updatePassword'],
  })
  @MinLength(8, {
    groups: ['updatePassword'],
  })
  @IsOptional()
  @Trim()
  newPassword?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @Trim()
  username?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @MinLength(8, {
    groups: ['updatePassword'],
  })
  @Match('newPassword', {
    message: "Passwords don't match each other",
    groups: ['updatePassword'],
  })
  @IsOptional()
  @Trim()
  confirmNewPassword?: string;

  @ApiProperty({ enum: roleArray })
  @IsEnum(Role, { message: 'Role is not valid' })
  role?: Role;
}
