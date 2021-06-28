import { catchDBError } from '@api/exceptions/catchDBError';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateCouponBodyDto } from '../dto/requests/create-coupon.dto';
import { Coupon } from '../entities/coupon.entity';

@Injectable()
export class CreateCouponService {
  constructor(
    @InjectRepository(Coupon) private couponRepository: Repository<Coupon>,
  ) {}

  async createCoupon(payload: CreateCouponBodyDto) {
    const createdCoupon = await this.couponRepository
      .save(payload)
      .catch<Coupon>(catchDBError);
    return createdCoupon;
  }
}
