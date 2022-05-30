import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../utils/decorator/trim.decorator';
import { LogLevels, LogMessage } from '@prisma/client';
import { logLevelArray } from '../../utils/types/logLevel.array';

export class CreateLogDto implements Omit<LogMessage, 'id' | 'applicationId'> {

  @ApiProperty()
  @IsString()
  @Trim()
  @MaxLength(4048)
  message: string;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiPropertyOptional({ enum: logLevelArray })
  @IsOptional()
  @IsEnum(LogLevels, { message: 'LogLevel is not valid' })
  level: LogLevels;
}
