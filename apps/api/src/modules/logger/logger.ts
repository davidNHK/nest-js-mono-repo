import { Inject, Injectable } from '@nestjs/common';
import type { Logform, Logger as WinstonLogger } from 'winston';

import { Level, WINSTON_LOGGER } from './logging.constants';

@Injectable()
export class Logger {
  constructor(@Inject(WINSTON_LOGGER) private winstonLogger: WinstonLogger) {}

  log(
    message: string,
    infoObj: Omit<Logform.TransformableInfo, 'message'> & {
      level: Level;
    },
  ) {
    const { level, ...info } = infoObj;
    this.winstonLogger.log(level, message, info);
  }
}
