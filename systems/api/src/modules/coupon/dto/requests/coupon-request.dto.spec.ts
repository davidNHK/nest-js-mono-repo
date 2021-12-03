import { couponBuilder } from '@api-test-helpers/seeders/coupons';
import { describe, expect, it } from '@jest/globals';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { DiscountType } from '../../constants/discount-type.constants';
import { CouponRequestDto } from './coupon-request.dto';

describe('Test CouponDto', () => {
  it('resolve for given object', async () => {
    const raw = couponBuilder({
      active: true,
      amountOff: 10,
      code: 'fake-code',
      discountType: DiscountType.Amount,
    });
    const instance = plainToClass<CouponRequestDto, any>(CouponRequestDto, {
      ...raw,
      id: 'fake-id',
    });
    await expect(validateOrReject(instance)).resolves.toBeUndefined();
  });

  it.each([DiscountType.Amount, DiscountType.Percent])(
    'reject for when %s discount type object missing attributes',
    async discountType => {
      const raw = couponBuilder({
        active: true,
        code: 'fake-code',
        discountType,
      });
      const instance = plainToClass<CouponRequestDto, any>(CouponRequestDto, {
        ...raw,
        id: 'fake-id',
      });
      const err = await validateOrReject(instance).catch(e => e);
      expect(err.toString()).toMatchSnapshot();
    },
  );

  it('reject for when date not ISO8601 string', async () => {
    const raw = couponBuilder({
      active: true,
      amountOff: 10,
      application: 'sign-up',
      code: 'fake-code',
      discountType: DiscountType.Amount,
      endDate: '2021-04-01T00:00:aaZ',
      startDate: '2021-14-01T00:00:00Z',
    } as any);
    const instance = plainToClass<CouponRequestDto, any>(CouponRequestDto, {
      ...raw,
      id: 'fake-id',
    });
    const err = await validateOrReject(instance).catch(e => e);

    expect(err.toString()).toMatchInlineSnapshot(`
      "An instance of CouponRequestDto has failed the validation:
       - property startDate has failed the following constraints: isDate, BeforeDate 
      ,An instance of CouponRequestDto has failed the validation:
       - property endDate has failed the following constraints: isDate, minDate 
      "
    `);
  });

  it('reject for when endDate is less than startDate', async () => {
    const raw = couponBuilder({
      active: true,
      amountOff: 10,
      code: 'fake-code',
      discountType: DiscountType.Amount,
      endDate: new Date('2021-04-01T00:00:00Z'),
      startDate: new Date('2021-05-01T00:00:00Z'),
    });
    const instance = plainToClass<CouponRequestDto, any>(CouponRequestDto, {
      ...raw,
      id: 'fake-id',
    });
    const err = await validateOrReject(instance).catch(e => e);
    expect(err.toString()).toMatchInlineSnapshot(`
      "An instance of CouponRequestDto has failed the validation:
       - property startDate has failed the following constraints: BeforeDate 
      ,An instance of CouponRequestDto has failed the validation:
       - property endDate has failed the following constraints: minDate 
      "
    `);
  });
});
