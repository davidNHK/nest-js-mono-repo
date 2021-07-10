import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminApplicationController } from './admin-application.controller';
import { Application } from './entities/application.entity';
import { FindApplicationService } from './services/find-application.service';
import { ManipulateApplicationService } from './services/manipulate-application.service';

@Module({
  controllers: [AdminApplicationController],
  exports: [FindApplicationService],
  imports: [TypeOrmModule.forFeature([Application])],
  providers: [FindApplicationService, ManipulateApplicationService],
})
export class ApplicationModule {}
