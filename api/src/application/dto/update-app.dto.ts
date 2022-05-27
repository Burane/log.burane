import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { Trim } from '../../utils/decorator/trim.decorator';
import { Application } from '@prisma/client';
import { Optional } from '../../utils/types/Optional';

export class UpdateAppDto implements Optional<Omit<Application, 'id' | 'userId'>, 'name' | 'description'> {

  @ApiProperty()
  @IsString()
  @Trim()
  @MaxLength(255)
  name?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(1024)
  @Trim()
  description?: string;

}
