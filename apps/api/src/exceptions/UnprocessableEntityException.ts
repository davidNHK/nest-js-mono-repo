import { HttpException, HttpStatus } from '@nestjs/common';

import type { ErrorCode } from './ErrorCode';

interface InputResponse {
  code: ErrorCode;
  debugDetails?: Record<string, unknown>;
  errors: string[];
  meta?: Record<string, unknown>;
}

export class UnprocessableEntityException extends HttpException {
  debugDetails?: Record<string, unknown>; // Only visible on access log

  constructor(response: InputResponse) {
    const { errors, meta, debugDetails, code } = response;
    super(
      {
        code,
        errors,
        meta,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
    this.debugDetails = debugDetails;
  }
}
