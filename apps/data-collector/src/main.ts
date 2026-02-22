import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const configService = app.get<ConfigService>(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    credentials: true,
    origin: true,
    optionsSuccessStatus: 200,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    preflightContinue: false,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  const port = Number(configService.get<number>('PORT')) || 3000;

  const config = new DocumentBuilder()
    .setTitle('Data Collector API')
    .setDescription('The Data Collector API documentation')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
