import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, MaxLength } from 'class-validator';
import { Trim } from '../../utils/decorator/trim.decorator';
import { Application } from '@prisma/client';
import { Optional } from '../../utils/types/Optional';

export class CreateAppDto implements Optional<Omit<Application, 'id' | 'userId' | 'webhookSecret' | 'webhookToken'>, 'discordWebhookUrl'> {

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

  @ApiProperty()
  @IsUrl()
  @MaxLength(1024)
  @Trim()
  discordWebhookUrl?: string;

}
