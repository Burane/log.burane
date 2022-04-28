import { IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Match } from '../../utils/decorator/match.decorator';
import { Role } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { roleArray } from '../../utils/types/role.array';
import { Trim } from '../../utils/decorator/trim.decorator';
import { PASSWORD_REGEX } from '../../constants';

export class  CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @Trim()
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_REGEX, {
    message: 'Password is too weak',
  })
  @MinLength(8)
  @Trim()
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Match('password', { message: "Passwords don't match each other" })
  @Trim()
  passwordConfirmation: string;

  @ApiPropertyOptional({ enum: roleArray })
  @IsOptional()
  @IsEnum(Role, { message: 'Role is not valid' })
  role?: Role;
}
