import { catchDBError } from '@api/exceptions/catchDBError';
import { Injectable } from '@nestjs/common';

import type { CreateCouponBodyDto } from '../dto/requests/create-coupon.dto';
import type { Coupon } from '../entities/coupon.entity';
import { CouponRepositoryFactory } from './coupon-repository.factory';

@Injectable()
export class ManipulateCouponService {
  constructor(private couponRepositoryFactory: CouponRepositoryFactory) {}

  async createCoupon(payload: CreateCouponBodyDto) {
    const repository = this.couponRepositoryFactory.getRepository({
      discountType: payload.discountType,
    });
    const createdCoupon = await repository
      .save(payload)
      .catch<Coupon>(catchDBError);
    return createdCoupon;
  }
}
