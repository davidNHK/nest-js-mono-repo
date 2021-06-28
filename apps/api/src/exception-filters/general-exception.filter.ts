import { ErrorCode } from '@api/exceptions/ErrorCode';
import { http } from '@api/modules/logger/formats/http';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { err } from '../modules/logger/formats/err';
import { Logger } from '../modules/logger/logger';
import { Level } from '../modules/logger/logging.constants';

@Catch()
export class GeneralExceptionFilter implements ExceptionFilter {
  constructor(private accessLogger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();

    const response = ctx.getResponse<Response>();

    const httpException =
      exception instanceof HttpException
        ? exception
        : new InternalServerErrorException({
            code: ErrorCode.UnhandledError,
            errors: [exception.message],
            meta: { exception },
          });
    httpException.stack = exception.stack;

    const stack =
      process.env.NODE_ENV !== 'production' ? { stack: exception.stack } : {};

    const { status, body } = {
      body: {
        ...(httpException.getResponse() as Record<string, unknown>),
        ...stack,
      },
      status: httpException.getStatus(),
    };
    const { startAt } = response.locals;
    const end = new Date().getTime();
    // accessLog repeated here Because NestJS interceptor can't capture error throw from guard
    // https://stackoverflow.com/questions/61087776/interceptor-not-catching-error-thrown-by-guard-in-nestjs
    // https://docs.nestjs.com/faq/request-lifecycle
    response.status(status).json(body);

    this.accessLogger.log(`access log`, {
      duration: end - startAt,
      err: err(httpException),
      http: http(
        {
          ...request,
        } as any,
        {
          ...response,
          body,
        } as any,
      ),
      level: Level.error,
    });
  }
}
