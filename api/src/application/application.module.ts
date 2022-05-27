import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ApplicationController],
  providers: [ApplicationService, JwtGuard]
})
export class ApplicationModule {}
