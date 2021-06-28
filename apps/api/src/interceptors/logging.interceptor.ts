import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { http } from '../modules/logger/formats/http';
import { Logger } from '../modules/logger/logger';
import { Level } from '../modules/logger/logging.constants';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private accessLogger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      tap(data => {
        const { startAt } = response.locals;
        const end = new Date().getTime();
        this.accessLogger.log(`access log`, {
          duration: end - startAt,
          http: http(request, {
            ...response,
            body: data,
          }),
          level: Level.info,
        });
      }),
    );
  }
}
