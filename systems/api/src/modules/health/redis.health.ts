import { RedisProvider } from '@api/modules/redis/redis.provider';
import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private redisProvider: RedisProvider) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isRedisAlive = await this.redisProvider.redisClient
      .ping()
      .then(() => true)
      .catch(() => false);

    const result = this.getStatus(key, isRedisAlive, {});

    if (isRedisAlive) {
      return result;
    }
    throw new HealthCheckError('Redis failed', result);
  }
}
