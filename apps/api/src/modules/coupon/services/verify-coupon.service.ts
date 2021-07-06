import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { v4 } from 'uuid';

import type {
  Order,
  VerifyCouponBodyDto,
  VerifyCouponParamsDto,
} from '../dto/requests/verify-coupon.dto';
import {
  assertAmountDiscountCoupon,
  assertPercentDiscountCoupon,
} from '../entities/assert-coupon';
import { Coupon } from '../entities/coupon.entity';
import { InConsistentTrackingIdException } from '../exceptions/InConsistentTrackingIdException';
import { UnknownCouponCodeException } from '../exceptions/UnknownCouponCodeException';
import { computeTrackingId } from '../utils/computeTrackingId';

export class VerifyCouponService {
  constructor(
    @InjectRepository(Coupon) private couponRepository: Repository<Coupon>,
    private config: ConfigService,
  ) {}

  async verifyCoupon(payload: VerifyCouponBodyDto & VerifyCouponParamsDto) {
    const trackingIdSecrets = this.config.get('secret.trackingID');
    if (!compareTrackingId(trackingIdSecrets, payload))
      throw new InConsistentTrackingIdException({
        errors: ['TrackingId mismatch'],
        meta: {
          payload,
        },
      });
    const products = payload.order.items.map(item => item.productId);
    const coupon = await this.couponRepository
      .createQueryBuilder('coupon')
      .where('active = true')
      .andWhere('code = :code')
      .andWhere(
        new Brackets(qb =>
          qb.where('end_date IS NULL').orWhere('end_date >= NOW()'),
        ),
      )
      .andWhere('product IN (:...productIds)')
      .andWhere('start_date <= NOW()')
      .setParameters({
        code: payload.code,
        productIds: products,
      })
      .getOneOrFail()
      .catch(err => {
        throw new UnknownCouponCodeException({
          debugDetails: { err },
          errors: ['coupon code not found'],
          meta: {
            payload,
            products,
          },
        });
      });

    const discount = computeDiscountForOrder(coupon, payload.order);
    return {
      amountOff: discount.amountOff,
      code: payload.code,
      discountType: coupon.discountType,
      metadata: {},
      order: {
        ...payload.order,
        totalAmount: payload.order.amount - discount.discount,
        totalDiscountAmount: discount.discount,
      },
      percentOff: discount.percentOff,
      sessionId: v4(),
      trackingId: computeTrackingId({
        coupon,
        customer: payload.customer,
        order: payload.order,
        secretKey: trackingIdSecrets[0],
      }),
      valid: true,
    };
  }
}

function computeDiscountForOrder(coupon: Coupon, order: Order) {
  if (assertPercentDiscountCoupon(coupon)) {
    const discount = Math.round(order.amount * (coupon.percentOff / 100));
    // From business requirement, it should always integer amount
    return {
      discount: Math.floor(discount / 100) * 100,
      percentOff: coupon.percentOff,
    };
  } else if (assertAmountDiscountCoupon(coupon)) {
    return { amountOff: coupon.amountOff, discount: coupon.amountOff };
  }
  return { amountOff: 0, discount: 0 };
}

function compareTrackingId(
  secretKeys: string[],
  payload: VerifyCouponBodyDto & VerifyCouponParamsDto,
) {
  if (payload.trackingId) {
    const givenTrackingId = payload.trackingId;
    return (
      secretKeys
        .map(key =>
          computeTrackingId({
            coupon: { code: payload.code },
            customer: { id: payload.customer.id },
            order: { id: payload.order.id },
            secretKey: key,
          }),
        )
        .find(id => id === givenTrackingId) !== undefined
    );
  }
  return true;
}
