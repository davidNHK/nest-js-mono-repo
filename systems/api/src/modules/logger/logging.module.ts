import { DbOperationLogger } from '@api/modules/logger/db-operation-logger';
import { NestLogger } from '@api/modules/logger/nest-logger';
import { Module } from '@nestjs/common';

import { Logger } from './logger';

@Module({
  exports: [DbOperationLogger, NestLogger],
  providers: [Logger, DbOperationLogger, NestLogger],
})
export class LoggingModule {}
