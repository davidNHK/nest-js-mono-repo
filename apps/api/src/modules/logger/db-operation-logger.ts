import { err } from '@api/modules/logger/formats/err';
import { Level } from '@api/modules/logger/logging.constants';
import { Inject } from '@nestjs/common';
import type { Logger as TypeORMLogger } from 'typeorm';
import type { Logform } from 'winston';

import { Logger } from './logger';

export class DbOperationLogger implements TypeORMLogger {
  constructor(@Inject(Logger) private logger: Logger) {}

  private logToWinston(
    message: string,
    infoObj: Omit<Logform.TransformableInfo, 'message'> & {
      level: Level;
    },
  ) {
    const { level, ...info } = infoObj;
    this.logger.log('DB Operation', {
      ...info,
      level,
      message,
    });
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    this.logToWinston(message, {
      level: level === 'log' ? Level.info : Level[level],
    });
  }

  logMigration(message: string) {
    this.logToWinston(message, {
      level: Level.info,
    });
  }

  logQuery(query: string, parameters?: any[]) {
    this.logToWinston('DB Operation', {
      db: {
        parameters,
        query,
      },
      level: Level.info,
    });
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    this.logToWinston('DB Operation', {
      db: {
        err: typeof error === 'string' ? error : err(error),
        parameters,
        query,
      },
      level: Level.error,
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logToWinston('DB Operation', {
      db: {
        parameters,
        query,
        time,
      },
      level: Level.warn,
    });
  }

  logSchemaBuild(message: string) {
    this.logToWinston(message, {
      level: Level.info,
    });
  }
  // implement all methods from logger class
}
