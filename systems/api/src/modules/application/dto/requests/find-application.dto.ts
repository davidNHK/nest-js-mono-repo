import { PickType } from '@nestjs/swagger';

import { ApplicationRequestDto } from './application-request.dto';

export class FindApplicationParamsDto extends PickType(ApplicationRequestDto, [
  'id',
] as const) {}
