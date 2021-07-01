import { BaseAPIResponse } from '@api/dto/responses/base-api-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

import { ApplicationResponse } from './application-response';

@Exclude()
export class SingleApplicationResponseDto extends BaseAPIResponse<ApplicationResponse> {
  @Type(() => ApplicationResponse)
  @Expose()
  data: ApplicationResponse;

  @Expose()
  meta: Record<string, unknown>;

  constructor(application: ApplicationResponse) {
    super();
    this.data = application;
    this.meta = {};
  }
}
