import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Application } from './entities/application.entity';
import { FindApplicationService } from './services/find-application.service';

@Module({
  exports: [FindApplicationService],
  imports: [TypeOrmModule.forFeature([Application])],
  providers: [FindApplicationService],
})
export class ApplicationModule {}
