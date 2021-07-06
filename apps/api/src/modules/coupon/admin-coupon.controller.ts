import { OpenIdClientCredentialsGrant } from '@api/decorators/open-id-client-credentials-grant.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateCouponBodyDto } from './dto/requests/create-coupon.dto';
import { FindManyCouponQueryDto } from './dto/requests/find-many-coupon.dto';
import { ManyCouponResponseDto } from './dto/responses/many-coupon-response.dto';
import { SingleCouponResponseDto } from './dto/responses/single-coupon-response.dto';
import { FindCouponService } from './services/find-coupon.service';
import { ManipulateCouponService } from './services/manipulate-coupon.service';

@Controller('/admin/v1')
@ApiTags('Coupon Admin')
export class AdminCouponController {
  constructor(
    private manipulateCouponService: ManipulateCouponService,
    private findManyCouponService: FindCouponService,
  ) {}

  @OpenIdClientCredentialsGrant()
  @Get('/coupons')
  async getManyCoupon(@Query() query: FindManyCouponQueryDto) {
    const records = await this.findManyCouponService.findManyCoupon(query);
    return new ManyCouponResponseDto(records.matchedCoupon, {
      limit: query.limit,
      skip: query.skip,
      total: records.total,
    });
  }

  @OpenIdClientCredentialsGrant()
  @Post('/coupons')
  async createCoupon(
    @Body() body: CreateCouponBodyDto,
  ): Promise<SingleCouponResponseDto> {
    const createdCoupon = await this.manipulateCouponService.createCoupon({
      ...body,
    });

    return new SingleCouponResponseDto(createdCoupon);
  }
}
