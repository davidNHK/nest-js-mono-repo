import { DbOperationLogger } from '@api/modules/logger/db-operation-logger';
import { Module } from '@nestjs/common';

import { Logger } from './logger';
import { WINSTON_LOGGER_CONFIG } from './logging.constants';
import { WinstonConfig } from './winston-config';
import { WinstonLoggerProvider } from './winston-logger.provider';

@Module({
  exports: [Logger, DbOperationLogger],
  providers: [
    { provide: WINSTON_LOGGER_CONFIG, useValue: WinstonConfig },
    WinstonLoggerProvider,
    Logger,
    DbOperationLogger,
  ],
})
export class LoggingModule {}
