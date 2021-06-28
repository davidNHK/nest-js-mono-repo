import type { Provider } from '@nestjs/common';
import winston, { LoggerOptions } from 'winston';

import { WINSTON_LOGGER, WINSTON_LOGGER_CONFIG } from './logging.constants';

export const WinstonLoggerProvider: Provider = {
  inject: [WINSTON_LOGGER_CONFIG],
  provide: WINSTON_LOGGER,
  useFactory: (options: LoggerOptions) => winston.createLogger(options),
};
