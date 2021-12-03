import type { DynamicModule } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { REDIS_CLIENT } from './redis.constants';
import { RedisProvider } from './redis.provider';

@Global()
@Module({})
export class RedisModule {
  public static forRootAsync(): DynamicModule {
    return {
      exports: [RedisProvider],
      imports: [ConfigModule],
      module: RedisModule,
      providers: [
        {
          inject: [ConfigService],
          provide: REDIS_CLIENT,
          useFactory(configService: ConfigService) {
            const { host } = configService.get('redis');
            const client = new Redis(host, {
              maxRetriesPerRequest: 3,
              retryStrategy(times: number) {
                const delay = Math.min(Math.pow(times, 2) * 100, 1000);
                return delay;
              },
            });
            return client;
          },
        },
        RedisProvider,
      ],
    };
  }
}
