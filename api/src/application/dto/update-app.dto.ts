import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength, ValidateIf } from 'class-validator';
import { Trim } from '../../utils/decorator/trim.decorator';
import { Application } from '@prisma/client';
import { Optional } from '../../utils/types/Optional';

export class UpdateAppDto implements Optional<Omit<Application, 'id' | 'userId' | 'webhookSecret' | 'webhookToken'>, 'name' | 'description' | 'discordWebhookUrl'> {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  @Trim()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  @IsUrl()
  @MaxLength(1024)
  @Trim()
  discordWebhookUrl?: string | null;


}
