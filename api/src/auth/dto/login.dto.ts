import { IsEmail, IsString, Length, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '../../utils/decorator/trim.decorator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(255)
  @Trim()
  email: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @Trim()
  password: string;
}
