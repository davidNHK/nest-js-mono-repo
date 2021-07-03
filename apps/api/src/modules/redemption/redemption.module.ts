import { ApplicationModule } from '@api/modules/application/application.module';
import { Module } from '@nestjs/common';

import { PublicRedemptionController } from './public-redemption.controller';

@Module({
  controllers: [PublicRedemptionController],
  imports: [ApplicationModule],
})
export class RedemptionModule {}
