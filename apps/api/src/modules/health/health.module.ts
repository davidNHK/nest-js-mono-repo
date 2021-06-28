import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { RedisModule } from '../redis/redis.module';
import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './redis.health';

@Module({
  controllers: [HealthController],
  imports: [TerminusModule, RedisModule],
  providers: [RedisHealthIndicator],
})
export class HealthModule {}
