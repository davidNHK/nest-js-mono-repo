import { ApplicationModule } from '@api/modules/application/application.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CouponModule } from '../coupon/coupon.module';
import { Redemption } from './entities/redemption.entity';
import { PublicRedemptionController } from './public-redemption.controller';
import { ManipulateRedemptionService } from './services/manipulate-redemption.service';

@Module({
  controllers: [PublicRedemptionController],
  imports: [
    ApplicationModule,
    CouponModule,
    TypeOrmModule.forFeature([Redemption]),
  ],
  providers: [ManipulateRedemptionService],
})
export class RedemptionModule {}
