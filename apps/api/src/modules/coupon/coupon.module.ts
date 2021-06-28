import { VerifyCouponService } from '@api/modules/coupon/services/verify-coupon.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationModule } from '../application/application.module';
import { ClientCouponController } from './client-coupon.controller';
import { CouponController } from './coupon.controller';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponService } from './services/create-coupon.service';
import { FindManyCouponService } from './services/find-many-coupon.service';

@Module({
  controllers: [CouponController, ClientCouponController],
  imports: [TypeOrmModule.forFeature([Coupon]), ApplicationModule],
  providers: [CreateCouponService, FindManyCouponService, VerifyCouponService],
})
export class CouponModule {}
