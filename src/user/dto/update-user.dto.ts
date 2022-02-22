import { IsEmail, IsNotEmpty } from 'class-validator';
import { Match } from '../../utils/decorator/match.decorator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Match('password')
  passwordConfirmation: string;

  role: Role;
}
