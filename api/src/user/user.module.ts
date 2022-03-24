import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtGuard],
  exports: [UserService],
})
export class UserModule {}
