import { Module } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleAirQualityService } from './providers/google-air-quality.service';
import { MockAirQualityService } from './providers/mock-air-quality.service';
import { AIR_QUALITY_PROVIDER } from './interfaces/air-quality-provider.interface';

@Module({
  imports: [
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            exchange: 'air_quality_alerts_exchange',
            exchangeType: 'fanout',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    AirQualityService,
    GoogleAirQualityService,
    MockAirQualityService,
    {
      provide: AIR_QUALITY_PROVIDER,
      useFactory: (
        configService: ConfigService,
        googleProvider: GoogleAirQualityService,
        mockProvider: MockAirQualityService,
      ) => {
        return configService.get<string>('USE_MOCK_API') === 'true'
          ? mockProvider
          : googleProvider;
      },
      inject: [ConfigService, GoogleAirQualityService, MockAirQualityService],
    },
  ],
})
export class AirQualityModule {}
