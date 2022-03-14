import { IsString, Matches } from 'class-validator';
import { Match } from '../../utils/decorator/match.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
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
  @IsString()
  token: string;
}
