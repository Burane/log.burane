import { LogLevels, LogMessage } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class LogEntity implements LogMessage {
  constructor(log: LogMessage) {
    this.id = log.id;
    this.level = log.level;
    this.date = log.date
    this.message = log.message
    this.applicationId = log.applicationId
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  level: LogLevels;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  message: string;

  @ApiProperty()
  applicationId: string;

}
