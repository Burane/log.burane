import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Match } from '../../utils/decorator/match.decorator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Match('password', { message: "Passwords don't match each other" })
  passwordConfirmation: string;

  @IsEnum(Role, { message: 'Role is not valid' })
  role: Role;
}
