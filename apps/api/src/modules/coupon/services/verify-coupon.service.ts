import type {
  Customer,
  Order,
  VerifyCouponBodyDto,
  VerifyCouponParamsDto,
} from '@api/modules/coupon/dto/requests/verify-coupon.dto';
import {
  Coupon,
  DiscountType,
} from '@api/modules/coupon/entities/coupon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import { In, LessThan, MoreThanOrEqual, Repository } from 'typeorm';

import { UnknownCouponCodeException } from '../exceptions/UnknownCouponCodeException';

export class VerifyCouponService {
  constructor(
    @InjectRepository(Coupon) private couponRepository: Repository<Coupon>,
  ) {}

  async verifyCoupon(payload: VerifyCouponBodyDto & VerifyCouponParamsDto) {
    const now = new Date();
    const products = payload.order.items.map(item => item.productId);
    // const application = await this.findApplicationService.findByName(
    //   payload.application,
    // );
    const coupon = await this.couponRepository
      .findOneOrFail({
        active: true,
        code: payload.code,
        endDate: MoreThanOrEqual(now),
        product: In(products),
        startDate: LessThan(now),
      })
      .catch(() => {
        throw new UnknownCouponCodeException({
          errors: ['coupon code not found'],
          meta: {
            now,
            payload,
            products,
          },
        });
      });
    const discountAmount = computeDiscountForOrder(coupon, payload.order);
    return {
      amountOff: coupon.amountOff,
      code: payload.code,
      discountType: coupon.discountType,
      metadata: {},
      order: {
        ...payload.order,
        totalAmount: payload.order.amount - discountAmount,
        totalDiscountAmount: discountAmount,
      },
      percentOff: coupon.percentOff,
      trackingId: computeTrackingId({
        coupon,
        customer: payload.customer,
      }),
      valid: true,
    };
  }
}

function computeDiscountForOrder(coupon: Coupon, order: Order) {
  if (coupon.discountType === DiscountType.Percent) {
    const discount = Math.round(order.amount * (coupon.percentOff / 100));
    // From business requirement, it should alway integer amount
    return Math.floor(discount / 100) * 100;
  } else if (coupon.discountType === DiscountType.Amount) {
    return order.amount - coupon.amountOff;
  }
  return 0;
}

function computeTrackingId({
  coupon,
  customer,
}: {
  coupon: Coupon;
  customer: Customer;
}) {
  return createHmac('SHA256', 'fake-key')
    .update(`${customer.id}/${coupon.code}`)
    .digest('hex');
}
