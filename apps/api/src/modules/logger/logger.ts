import { Injectable } from '@nestjs/common';
import type { Logform } from 'winston';
import winston from 'winston';

import type { Level } from './logging.constants';
import { WinstonConfig } from './winston-config';

@Injectable()
export class Logger {
  private winstonLogger = winston.createLogger(WinstonConfig);

  log(
    level: Level,
    message: string,
    infoObj: Omit<Logform.TransformableInfo, 'message'>,
  ) {
    this.winstonLogger.log(level, message, infoObj);
  }
}
