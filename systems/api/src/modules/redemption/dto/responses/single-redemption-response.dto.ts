import { BaseAPIResponse } from '@api/dto/responses/base-api-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

import { RedemptionResponseDto } from './redemption-response.dto';

@Exclude()
export class SingleRedemptionResponseDto extends BaseAPIResponse<RedemptionResponseDto> {
  @Type(() => RedemptionResponseDto)
  @Expose()
  data: RedemptionResponseDto;

  @Expose()
  meta: Record<string, unknown>;

  constructor(redemption: RedemptionResponseDto) {
    super();
    this.data = redemption;
    this.meta = {};
  }
}
