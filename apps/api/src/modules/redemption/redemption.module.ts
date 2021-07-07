import { ApplicationModule } from '@api/modules/application/application.module';
import { Module } from '@nestjs/common';

import { CouponModule } from '../coupon/coupon.module';
import { PublicRedemptionController } from './public-redemption.controller';
import { ManipulateRedemptionService } from './services/manipulate-redemption.service';

@Module({
  controllers: [PublicRedemptionController],
  imports: [ApplicationModule, CouponModule],
  providers: [ManipulateRedemptionService],
})
export class RedemptionModule {}
