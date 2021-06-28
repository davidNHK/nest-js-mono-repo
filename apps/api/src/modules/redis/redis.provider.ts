import { Inject, OnApplicationShutdown } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import type { Redis } from 'ioredis';

import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisProvider implements OnApplicationShutdown {
  constructor(@Inject(REDIS_CLIENT) private _redisClient: Redis) {}

  get redisClient() {
    return this._redisClient;
  }

  async onApplicationShutdown(): Promise<void> {
    await this._redisClient.disconnect();
  }
}
