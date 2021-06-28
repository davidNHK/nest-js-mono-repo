import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { AppClientSecretKeyGuard } from '../guards/app-client-secret-key.guard';

export function AppClientSecretKey() {
  return applyDecorators(
    UseGuards(AppClientSecretKeyGuard),
    ApiSecurity('app-client-secret-key'),
    ApiSecurity('app-client-name'),
  );
}
