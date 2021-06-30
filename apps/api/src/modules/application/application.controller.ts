import { OpenIdClientCredentialsGrant } from '@api/decorators/open-id-client-credentials-grant.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/v1')
@ApiTags('Application')
export class ApplicationController {
  @OpenIdClientCredentialsGrant()
  @Get('/applications')
  async verifyCoupon(): Promise<any> {
    return {};
  }
}
