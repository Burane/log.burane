import { Application, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { appWithStats } from '../../utils/types/AppWithStats';

export class AppEntity implements appWithStats {
  constructor(app: appWithStats) {
    this.id = app.id;
    this.name = app.name;
    this.description = app.description;
    this.userId = app.userId;
    this.logMessagesCount = app.logMessagesCount
    this._count = app._count
    this.webhookSecret = app.webhookSecret
  }


  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  webhookSecret: string;

  @ApiProperty()
  _count: { logMessages: number };

  @ApiProperty()
  logMessagesCount: (Prisma.PickArray<Prisma.LogMessageGroupByOutputType, "level"[]> & { _count: number })[];


}
