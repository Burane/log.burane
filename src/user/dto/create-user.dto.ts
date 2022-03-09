import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';
import { Match } from '../../utils/decorator/match.decorator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty()
  @IsEnum(Role, { message: 'Role is not valid' })
  role?: Role;
}
