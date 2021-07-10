import { GeneralExceptionFilter } from '@api/exception-filters/general-exception.filter';
import { LoggingInterceptor } from '@api/interceptors/logging.interceptor';
import { ApplicationModule } from '@api/modules/application/application.module';
import { AuthModule } from '@api/modules/auth/auth.module';
import { HealthModule } from '@api/modules/health/health.module';
import { LoggingModule } from '@api/modules/logger/logging.module';
import { RedisModule } from '@api/modules/redis/redis.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { configuration } from './config/configuration';
import { getEnvFilePath } from './config/getEnvFilePath';
import { RequestIdMiddleware } from './middlewares/request-id.middleware';
import { RequestStartTimeMiddleware } from './middlewares/request-start-time.middleware';
import { CouponModule } from './modules/coupon/coupon.module';
import { RedemptionModule } from './modules/redemption/redemption.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      load: [configuration],
    }),
    LoggingModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        const { connectionURL, type } = configService.get('database');
        return {
          autoLoadEntities: true,
          migrations: [`${__dirname}/migrations/**/*.js`],
          migrationsRun: true,
          namingStrategy: new SnakeNamingStrategy() as any,
          type,
          url: connectionURL,
        };
      },
    }),
    RedisModule.forRootAsync(),
    AuthModule,
    TerminusModule,
    HealthModule,
    ApplicationModule,
    CouponModule,
    RedemptionModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GeneralExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestStartTimeMiddleware, RequestIdMiddleware)
      .forRoutes('*');
  }
}
