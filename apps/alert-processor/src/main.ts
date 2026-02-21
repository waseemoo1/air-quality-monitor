import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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

  const rmqUrl = configService.get<string>('RABBITMQ_URL');
  // Connect the Microservice and bind it to our Exchange!
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: 'air_quality_alerts_queue',
      exchange: 'air_quality_alerts_exchange',
      exchangeType: 'fanout',

      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();

  const port = Number(configService.get<number>('PORT')) || 3001;
  await app.listen(port);

  Logger.log(
    `🚀 REST API is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(`🐰 RabbitMQ Microservice is listening for messages...`);
}

bootstrap();
