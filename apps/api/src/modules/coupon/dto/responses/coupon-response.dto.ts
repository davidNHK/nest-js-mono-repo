import { DiscountType } from '@api/modules/coupon/entities/coupon.entity';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CouponResponseDto {
  @Expose()
  id!: string;

  @Expose()
  active!: boolean;

  @Expose()
  product!: string;

  @Expose()
  code!: string;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => Date)
  startDate!: Date;

  @Expose()
  @Type(() => Date)
  endDate!: Date;

  @Expose()
  discountType: DiscountType;

  @Expose()
  amountOff?: number;

  @Expose()
  percentOff?: number;

  @Expose()
  metadata?: Record<string, unknown>;
}
