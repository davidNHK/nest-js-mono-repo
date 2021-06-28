import { AppClientSecretKey } from '@api/decorators/app-client-secret-key.decorator';
import { VerifyCouponResponseDto } from '@api/modules/coupon/dto/responses/verify-coupon-response.dto';
import { VerifyCouponService } from '@api/modules/coupon/services/verify-coupon.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  ClientVerifyCouponQueryDto,
  VerifyCouponParamsDto,
} from './dto/requests/verify-coupon.dto';

@Controller('/client/v1')
@ApiTags('Coupon Public')
export class ClientCouponController {
  constructor(private verifyCouponService: VerifyCouponService) {}

  @AppClientSecretKey()
  @Get('/coupons/:code/validate')
  async verifyCoupon(
    @Param() params: VerifyCouponParamsDto,
    @Query() query: ClientVerifyCouponQueryDto,
  ): Promise<VerifyCouponResponseDto> {
    const verifiedResponse = await this.verifyCouponService.verifyCoupon({
      ...params,
      ...query,
    });
    return new VerifyCouponResponseDto(verifiedResponse);
  }
}
