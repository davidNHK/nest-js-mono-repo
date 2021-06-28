import { BadRequestException } from '@api/exceptions/BadRequestException';
import { UnprocessableEntityException } from '@api/exceptions/UnprocessableEntityException';
import type { CouponRequestDto } from '@api/modules/coupon/dto/requests/coupon-request.dto';
import { couponBuilder } from '@api-test-helpers/seeders/coupons';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Coupon, DiscountType } from '../entities/coupon.entity';
import { CreateCouponService } from './create-coupon.service';

describe('CreateCouponService', () => {
  it('createCoupon', async () => {
    const mockRepository = {
      save: jest.fn().mockResolvedValue({}),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCouponService,
        {
          provide: getRepositoryToken(Coupon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    const service = app.get<CreateCouponService>(CreateCouponService);
    const payload = couponBuilder({
      amountOff: 10,
      code: 'fake-code',
      discountType: DiscountType.Amount,
      endDate: new Date(),
      product: '',
      startDate: new Date(),
    }) as CouponRequestDto;
    await service.createCoupon(payload);
    expect(mockRepository.save).toHaveBeenCalledWith(payload);
  });

  it('createCoupon with throw UnProcessableEntity', async () => {
    const mockRepository = {
      save: jest.fn().mockRejectedValue({ code: '23505' }),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCouponService,
        {
          provide: getRepositoryToken(Coupon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    const service = app.get<CreateCouponService>(CreateCouponService);
    const payload = couponBuilder({
      code: 'fake-code',
      discountType: DiscountType.Amount,
      endDate: new Date(),
      startDate: new Date(),
    }) as CouponRequestDto;
    await expect(service.createCoupon(payload)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  it('createCoupon with throw BadRequestException', async () => {
    const mockRepository = {
      save: jest.fn().mockRejectedValue({ code: '23514' }),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCouponService,
        {
          provide: getRepositoryToken(Coupon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    const service = app.get<CreateCouponService>(CreateCouponService);
    const payload = couponBuilder({
      code: 'fake-code',
      discountType: DiscountType.Amount,
      endDate: new Date(),
      startDate: new Date(),
    }) as CouponRequestDto;
    await expect(service.createCoupon(payload)).rejects.toThrow(
      BadRequestException,
    );
  });
});
