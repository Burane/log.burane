import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';
import { Match } from '../../utils/decorator/match.decorator';
import { Role } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { roleArray } from '../../utils/types/role.array';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @Match('password', { message: "Passwords don't match each other" })
  passwordConfirmation: string;

  @ApiPropertyOptional({ enum: roleArray })
  @IsEnum(Role, { message: 'Role is not valid' })
  role?: Role;
}
