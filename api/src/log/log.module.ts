import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ApplicationService } from '../application/application.service';

@Module({
  imports: [HttpModule, JwtModule.register({})],
  controllers: [LogController],
  providers: [LogService, ApplicationService],
})
export class LogModule {
}
