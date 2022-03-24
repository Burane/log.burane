import { Injectable } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Injectable()
@ApiOkResponse()
export class AppService {
  getVersion() {
    return {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
    };
  }
}
