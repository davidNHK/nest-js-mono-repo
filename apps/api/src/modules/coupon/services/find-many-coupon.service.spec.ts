import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { Coupon } from '../entities/coupon.entity';
import { FindManyCouponService } from './find-many-coupon.service';

describe('FindManyCouponService', () => {
  it('findManyCoupon', async () => {
    const mockRepository = {
      findAndCount: jest.fn().mockResolvedValue([[{}, {}], 4]),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        FindManyCouponService,
        {
          provide: getRepositoryToken(Coupon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    const service = app.get<FindManyCouponService>(FindManyCouponService);
    const filter = {
      limit: 10,
      products: ['abc', 'efg'],
      skip: 0,
    };
    const results = await service.findManyCoupon(filter);
    expect(mockRepository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      where: {
        product: In(filter.products),
      },
    });
    expect(results.total).toEqual(4);
    expect(results.matchedCoupon).toHaveLength(2);
  });

  it('findManyCoupon allow skip productIds', async () => {
    const mockRepository = {
      findAndCount: jest.fn().mockResolvedValue([[{}, {}], 4]),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        FindManyCouponService,
        {
          provide: getRepositoryToken(Coupon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    const service = app.get<FindManyCouponService>(FindManyCouponService);
    const filter = {
      application: 'mock-app-name',
      limit: 20,
      skip: 0,
    };
    await service.findManyCoupon(filter);
    expect(mockRepository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 20,
      where: {},
    });
  });
});
