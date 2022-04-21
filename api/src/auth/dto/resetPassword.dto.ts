import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../utils/decorator/match.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_REGEX } from '../../constants';
import { Trim } from '../../utils/decorator/trim.decorator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: 'Password is too weak',
  })
  @Trim()
  password: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @MinLength(8)
  @Match('password', { message: "Passwords don't match each other" })
  @Trim()
  passwordConfirmation: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @Trim()
  token: string;
}
