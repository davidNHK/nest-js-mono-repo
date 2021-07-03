import { AppServerSecretKey } from '@api/decorators/app-server-secret-key.decorator';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  RedeemCouponBodyDto,
  RedeemCouponParamsDto,
} from './dto/requests/redeem-coupon.dto';

@Controller('/v1')
@ApiTags('Redemption')
export class PublicRedemptionController {
  @AppServerSecretKey()
  @Post('/coupons/:code/redemption')
  async redeemCoupon(
    @Param() params: RedeemCouponParamsDto,
    @Body() body: RedeemCouponBodyDto,
  ) {
    return {
      data: { body, params },
    };
  }
}
