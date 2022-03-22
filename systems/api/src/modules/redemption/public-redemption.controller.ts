import { AppServerSecretKey } from '@api/modules/auth';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  CreateRedemptionBodyDto,
  CreateRedemptionParamsDto,
} from './dto/requests/create-redemption.dto';
import { SingleRedemptionResponseDto } from './dto/responses/single-redemption-response.dto';
import { ManipulateRedemptionService } from './services/manipulate-redemption.service';

@Controller('/v1')
@ApiTags('Redemption Public')
export class PublicRedemptionController {
  constructor(
    private manipulateRedemptionService: ManipulateRedemptionService,
  ) {}

  @AppServerSecretKey()
  @Post('/coupons/:code/redemption')
  async redeemCoupon(
    @Param() params: CreateRedemptionParamsDto,
    @Body() body: CreateRedemptionBodyDto,
  ) {
    const createdRedemption =
      await this.manipulateRedemptionService.createRedemption({
        ...params,
        ...body,
      });
    return new SingleRedemptionResponseDto(createdRedemption);
  }
}
