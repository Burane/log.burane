import { Prisma } from '@prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { appWithStats } from '../../utils/types/AppWithStats';
import { Exclude } from 'class-transformer';

export class AppEntity implements appWithStats {
  constructor(app: appWithStats) {
    this.id = app.id;
    this.name = app.name;
    this.description = app.description;
    this.userId = app.userId;
    this.logMessagesCount = app.logMessagesCount;
    this._count = app._count;
    this.webhookToken = app.webhookToken ? app.webhookToken : "";
    this.webhookSecret = app.webhookSecret ? app.webhookSecret : "";
    this.discordWebhookUrl = app.discordWebhookUrl ? app.discordWebhookUrl : "";
  }

  @ApiProperty()
  discordWebhookUrl: string;

  @ApiProperty()
  webhookToken: string;

  @ApiHideProperty()
  @Exclude()
  webhookSecret: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  _count: { logMessages: number };

  @ApiProperty()
  logMessagesCount: (Prisma.PickArray<Prisma.LogMessageGroupByOutputType, 'level'[]> & { _count: number })[];


}
