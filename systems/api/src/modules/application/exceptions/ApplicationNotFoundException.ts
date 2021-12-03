import { HttpException, HttpStatus } from '@nestjs/common';

interface InputResponse {
  debugDetails?: Record<string, unknown>;
  errors: string[];
  meta?: Record<string, unknown>;
}

export class ApplicationNotFoundException extends HttpException {
  debugDetails?: Record<string, unknown> | undefined; // Only visible on access log

  constructor(response: InputResponse) {
    const { errors, meta, debugDetails } = response;
    super(
      {
        code: 'ERR_APPLICATION_NOT_FOUND',
        errors,
        meta,
      },
      HttpStatus.NOT_FOUND,
    );
    this.debugDetails = debugDetails;
  }
}
