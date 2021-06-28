import type { CreateCouponBodyDto } from '@api/modules/coupon/dto/requests/create-coupon.dto';
import { Coupon } from '@api/modules/coupon/entities/coupon.entity';
import type { TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';
import { Connection } from 'typeorm';

export async function createCouponInDB(
  testingModule: TestingModule,
  coupons: Partial<Coupon>[],
) {
  const conn = testingModule.get<Connection>(Connection);
  const createdCoupons = await conn
    .createQueryBuilder()
    .insert()
    .into(Coupon)
    .values(coupons)
    .output('*')
    .execute();
  return createdCoupons.raw;
}

export function couponBuilder(override?: Partial<CreateCouponBodyDto>): any {
  const now = DateTime.now();
  const result = {
    endDate: now.plus({ month: 1 }).startOf('month').toJSDate(),
    metadata: {},
    startDate: now.startOf('month').toJSDate(),
    ...override,
    product: 'template',
  };
  return result;
}
