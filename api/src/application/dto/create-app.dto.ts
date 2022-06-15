import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmpty, IsOptional, IsString, IsUrl, MaxLength, ValidateIf } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  @Trim()
  discordWebhookUrl?: string;

}
