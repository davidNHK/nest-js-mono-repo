import { PickType } from '@nestjs/swagger';

import { ApplicationRequestDto } from './application-request.dto';

export class CreateApplicationBodyDto extends PickType(ApplicationRequestDto, [
  'name',
  'serverSecretKey',
  'clientSecretKey',
  'origins',
] as const) {}
