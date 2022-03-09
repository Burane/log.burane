import { Role, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { roleArray } from '../../utils/types/role.array';

export class UserEntity implements Omit<User, 'password'> {
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: roleArray })
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
