import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OAuthModule } from '../oauth/oauth.module';
import { ApplicationController } from './application.controller';
import { Application } from './entities/application.entity';
import { FindApplicationService } from './services/find-application.service';

@Module({
  controllers: [ApplicationController],
  exports: [FindApplicationService],
  imports: [TypeOrmModule.forFeature([Application]), OAuthModule],
  providers: [FindApplicationService],
})
export class ApplicationModule {}
