import { PickType } from '@nestjs/swagger';

import { ApplicationRequestDto } from './application-request.dto';

export class UpdateApplicationParamsDto extends PickType(
  ApplicationRequestDto,
  ['id'] as const,
) {}

export class UpdateApplicationBodyDto extends PickType(ApplicationRequestDto, [
  'serverSecretKey',
  'clientSecretKey',
  'origins',
] as const) {}
