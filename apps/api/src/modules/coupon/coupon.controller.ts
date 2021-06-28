import { AppServerSecretKey } from '@api/decorators/app-server-secret-key.decorator';
import {
  VerifyCouponBodyDto,
  VerifyCouponParamsDto,
} from '@api/modules/coupon/dto/requests/verify-coupon.dto';
import { VerifyCouponResponseDto } from '@api/modules/coupon/dto/responses/verify-coupon-response.dto';
import { VerifyCouponService } from '@api/modules/coupon/services/verify-coupon.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateCouponBodyDto } from './dto/requests/create-coupon.dto';
import { FindManyCouponQueryDto } from './dto/requests/find-many-coupon.dto';
import { ManyCouponResponseDto } from './dto/responses/many-coupon-response.dto';
import { SingleCouponResponseDto } from './dto/responses/single-coupon-response.dto';
import { CreateCouponService } from './services/create-coupon.service';
import { FindManyCouponService } from './services/find-many-coupon.service';

@Controller('/v1')
@ApiTags('Coupon')
export class CouponController {
  constructor(
    private createCouponService: CreateCouponService,
    private findManyCouponService: FindManyCouponService,
    private verifyCouponService: VerifyCouponService,
  ) {}

  @AppServerSecretKey()
  @Get('/coupons')
  async getManyCoupon(@Query() query: FindManyCouponQueryDto) {
    const records = await this.findManyCouponService.findManyCoupon(query);
    return new ManyCouponResponseDto(records.matchedCoupon, {
      limit: query.limit,
      skip: query.skip,
      total: records.total,
    });
  }

  @AppServerSecretKey()
  @Post('/coupons')
  async createCoupon(
    @Body() body: CreateCouponBodyDto,
  ): Promise<SingleCouponResponseDto> {
    const createdCoupon = await this.createCouponService.createCoupon({
      ...body,
    });

    return new SingleCouponResponseDto(createdCoupon);
  }

  @AppServerSecretKey()
  @Post('/coupons/:code/validate')
  @HttpCode(200)
  async verifyCoupon(
    @Param() params: VerifyCouponParamsDto,
    @Body() body: VerifyCouponBodyDto,
  ): Promise<VerifyCouponResponseDto> {
    const verifiedResponse = await this.verifyCouponService.verifyCoupon({
      ...params,
      ...body,
    });
    return new VerifyCouponResponseDto(verifiedResponse);
  }
}
