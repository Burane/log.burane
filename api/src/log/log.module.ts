import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ApplicationService } from '../application/application.service';
import { default as tsQuery } from '../utils/tsQuery';
import { TsqueryOptions } from 'pg-tsquery';

const TsQuery = {
  provide: 'TS_QUERY',
  useFactory: (options?: TsqueryOptions) => {
    return tsQuery(options);
  },
};

@Module({
  imports: [HttpModule, JwtModule.register({})],
  controllers: [LogController],
  providers: [LogService, ApplicationService, TsQuery],
})
export class LogModule {
}
