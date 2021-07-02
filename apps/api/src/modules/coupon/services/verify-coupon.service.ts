import type {
  Order,
  VerifyCouponBodyDto,
  VerifyCouponParamsDto,
} from '@api/modules/coupon/dto/requests/verify-coupon.dto';
import {
  Coupon,
  DiscountType,
} from '@api/modules/coupon/entities/coupon.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import { Brackets, Repository } from 'typeorm';
import { v4 } from 'uuid';

import { InConsistentTrackingIdException } from '../exceptions/InConsistentTrackingIdException';
import { UnknownCouponCodeException } from '../exceptions/UnknownCouponCodeException';

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
      .printSql()
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
  if (coupon.discountType === DiscountType.Percent) {
    const discount = Math.round(order.amount * (coupon.percentOff / 100));
    // From business requirement, it should alway integer amount
    return Math.floor(discount / 100) * 100;
  } else if (coupon.discountType === DiscountType.Amount) {
    return coupon.amountOff;
  }
  return 0;
}

function computeTrackingId({
  coupon,
  customer,
  order,
  secretKey,
}: {
  coupon: { code: string };
  customer: { id: string };
  order: { amount: number; id: string };
  secretKey: string;
}) {
  return createHmac('SHA256', secretKey)
    .update(`${customer.id}/${order.id}/${coupon.code}/${order.amount}`)
    .digest('hex');
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
            order: { amount: payload.order.amount, id: payload.order.id },
            secretKey: key,
          }),
        )
        .find(id => id === givenTrackingId) !== undefined
    );
  }
  return true;
}
