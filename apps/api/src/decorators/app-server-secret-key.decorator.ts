import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { AppServerSecretKeyGuard } from '../guards/app-server-secret-key.guard';

export function AppServerSecretKey() {
  return applyDecorators(
    UseGuards(AppServerSecretKeyGuard),
    ApiSecurity('app-server-name'),
    ApiSecurity('app-server-secret-key'),
  );
}
