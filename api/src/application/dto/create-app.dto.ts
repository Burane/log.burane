import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { Trim } from '../../utils/decorator/trim.decorator';
import { Application } from '@prisma/client';

export class CreateAppDto implements Omit<Application, 'id' | 'userId'> {

  @ApiProperty()
  @IsString()
  @Trim()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(1024)
  @Trim()
  description: string;

}
