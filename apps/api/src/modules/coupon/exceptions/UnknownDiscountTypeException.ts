import { HttpException, HttpStatus } from '@nestjs/common';

interface InputResponse {
  debugDetails?: Record<string, unknown>;
  errors: string[];
  meta?: Record<string, unknown>;
}

export class UnknownDiscountTypeException extends HttpException {
  debugDetails?: Record<string, unknown>; // Only visible on access log

  constructor(response: InputResponse) {
    const { errors, meta, debugDetails } = response;
    super(
      {
        code: 'ERR_UNKNOWN_DISCOUNT_TYPE',
        errors,
        meta,
      },
      HttpStatus.BAD_REQUEST,
    );
    this.debugDetails = debugDetails;
  }
}
