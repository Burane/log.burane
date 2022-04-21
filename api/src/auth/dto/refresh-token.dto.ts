import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '../../utils/decorator/trim.decorator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @Trim()
  refreshToken: string;
}
