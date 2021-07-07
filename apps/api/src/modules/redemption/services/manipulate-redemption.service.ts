import { catchDBError } from '@api/exceptions/catchDBError';
import { FindCouponService } from '@api/modules/coupon/services/find-coupon.service';
import { VerifyCouponService } from '@api/modules/coupon/services/verify-coupon.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type {
  CreateRedemptionBodyDto,
  CreateRedemptionParamsDto,
} from '../dto/requests/create-redemption.dto';
import { Redemption } from '../entities/redemption.entity';

@Injectable()
export class ManipulateRedemptionService {
  constructor(
    @InjectRepository(Redemption)
    private redemptionRepository: Repository<Redemption>,
    private verifyCouponService: VerifyCouponService,
    private findCouponService: FindCouponService,
  ) {}

  async createRedemption(
    data: CreateRedemptionBodyDto & CreateRedemptionParamsDto,
  ) {
    await this.verifyCouponService.verifyCoupon(data);
    const coupon = await this.findCouponService.findCouponByCode(data.code);
    return this.redemptionRepository
      .save({
        coupon,
        customerId: data.customer.id,
        metadata: data.metadata,
        orderId: data.order.id,
        trackingId: data.trackingId,
      })
      .catch<Redemption>(catchDBError);
  }
}
