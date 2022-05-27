import { Application } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AppEntity implements Application {
  constructor(app: Application) {
    this.id = app.id;
    this.name = app.name;
    this.description = app.description;
    this.userId = app.userId;
  }


  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  userId: string;


}
