import { AppServerSecretKey } from '@api/decorators/app-server-secret-key.decorator';
import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/v1')
@ApiTags('Redemption')
export class PublicRedemptionController {
  @AppServerSecretKey()
  @Post('/coupons/:code/redemption')
  async redeemCoupon() {
    return {};
  }
}
