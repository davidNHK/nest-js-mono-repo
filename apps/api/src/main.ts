import { FindApplicationService } from '@api/modules/application/services/find-application.service';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { BadRequestException } from './exceptions/BadRequestException';
import { ErrorCode } from './exceptions/ErrorCode';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(async (req, callback) => {
    if (!req.headers.origin) return callback(null, { origin: true });
    const appName = req.headers['X-Client-Application'];
    const application = await app
      .get<FindApplicationService>(FindApplicationService)
      .findByName(appName)
      .catch<null>(e => {
        callback(e, { origin: false });
        return null;
      });
    if (!application?.origins) return callback(null, { origin: false });
    return callback(null, { origin: application.origins });
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
  const options = new DocumentBuilder()
    .setTitle('Promotion API')
    .setDescription('promotion related API')
    .setVersion('1.0')
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
