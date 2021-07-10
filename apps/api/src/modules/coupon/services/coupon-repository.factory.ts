import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { DiscountType } from '../constants/discount-type.constants';
import { AmountDiscountCoupon } from '../entities/amount-discount-coupon.entity';
import {
  assertAmountDiscountCoupon,
  assertPercentDiscountCoupon,
} from '../entities/assert-coupon';
import { Coupon } from '../entities/coupon.entity';
import { PercentDiscountCoupon } from '../entities/percent-discount-coupon.entity';
import { UnknownDiscountTypeException } from '../exceptions/UnknownDiscountTypeException';

export class CouponRepositoryFactory {
  constructor(
    @InjectRepository(AmountDiscountCoupon)
    private amountCouponRepository: Repository<AmountDiscountCoupon>,
    @InjectRepository(PercentDiscountCoupon)
    private percentCouponRepository: Repository<PercentDiscountCoupon>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  getRepository({
    discountType,
  }: {
    discountType?: DiscountType;
  } = {}): Repository<Coupon | AmountDiscountCoupon | PercentDiscountCoupon> {
    if (!discountType) {
      return this.couponRepository;
    }
    if (assertPercentDiscountCoupon({ discountType }))
      return this.percentCouponRepository;
    if (assertAmountDiscountCoupon({ discountType }))
      return this.amountCouponRepository;
    throw new UnknownDiscountTypeException({
      errors: [`Unknown discount type: ${discountType}`],
    });
  }
}
