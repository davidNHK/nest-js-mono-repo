import { ChildEntity, Column } from 'typeorm';

import { DiscountType } from '../constants/discount-type.constants';
import { Coupon } from './coupon.entity';

@ChildEntity(DiscountType.EffectAmount)
export class EffectAmountDiscountCoupon extends Coupon {
  @Column()
  amountOff: number;

  @Column()
  effect: string;
}

export function assertEffectAmountDiscountCoupon(
  coupon: Partial<Coupon>,
): coupon is EffectAmountDiscountCoupon {
  return coupon.discountType === DiscountType.EffectAmount;
}
