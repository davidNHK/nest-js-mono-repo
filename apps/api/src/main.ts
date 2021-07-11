import { FindApplicationService } from '@api/modules/application/services/find-application.service';
import { Logger } from '@api/modules/logger/logger';
import { NestLogger } from '@api/modules/logger/nest-logger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { BadRequestException } from './exceptions/BadRequestException';
import { ErrorCode } from './exceptions/ErrorCode';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new NestLogger(new Logger()),
  });
  app.enableCors({
    origin: async (origin, callback) => {
      const applications = await app
        .get<FindApplicationService>(FindApplicationService)
        .findByOrigin(origin)
        .catch(e => {
          callback(e);
          return null;
        });
      if (!applications || applications?.length === 0)
        return callback(null, false);
      return callback(null, origin);
    },
  });
  app.use(helmet());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors) {
        throw new BadRequestException({
          code: ErrorCode.ValidationError,
          errors: errors.map(error => error.toString()),
          meta: { errors },
        });
      },
      transform: true,
      whitelist: true,
    }),
  );

  app.enableShutdownHooks();
  const config = app.get(ConfigService);
  const logger = app.get(NestLogger);
  app.useLogger(logger);
  const options = new DocumentBuilder()
    .setTitle('Promotion API')
    .setDescription('promotion related API')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurity('app-server-name', {
      in: 'header',
      name: 'X-APP',
      type: 'apiKey',
    })
    .addSecurity('app-server-secret-key', {
      in: 'header',
      name: 'X-APP-TOKEN',
      type: 'apiKey',
    })
    .addSecurity('app-client-name', {
      in: 'header',
      name: 'X-CLIENT-APPLICATION',
      type: 'apiKey',
    })
    .addSecurity('app-client-secret-key', {
      in: 'header',
      name: 'X-CLIENT-TOKEN',
      type: 'apiKey',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  await SwaggerModule.setup('/docs', app, document, {});

  await app.listen(config.get<number>('port')!);
}
bootstrap();
