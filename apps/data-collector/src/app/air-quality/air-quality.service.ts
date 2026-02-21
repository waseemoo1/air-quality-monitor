import { Injectable, Inject, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';
import { AirQualityAlertPayload } from '@air-quality-monitor/shared-types';
import {
  AIR_QUALITY_PROVIDER,
  IAirQualityProvider,
} from './interfaces/air-quality-provider.interface';
import { MONITORED_CITIES } from './constants';
import { City } from './interfaces';
import {
  EvaluatedResult,
  ParsedResult,
  RawApiResponse,
} from './interfaces/air-quality-internal.interface';

@Injectable()
export class AirQualityService {
  private readonly logger = new Logger(AirQualityService.name);

  constructor(
    @Inject(AIR_QUALITY_PROVIDER)
    private readonly dataProvider: IAirQualityProvider,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  @Interval(10000)
  async pollAirQuality(): Promise<void> {
    try {
      const results = await Promise.all(
        MONITORED_CITIES.map((city) => this.dataProvider.fetchCityData(city)),
      );

      results
        .filter((res) => !!res.data?.indexes)
        .map(this.parseAirQuality)
        .map(this.evaluateCriticality)
        .forEach((res) => this.processSideEffects(res));
    } catch (error) {
      this.logger.error(`Polling failed: ${error.message}`);
    }
  }

  private parseAirQuality = ({
    city,
    data,
  }: {
    city: City;
    data: RawApiResponse;
  }): ParsedResult => {
    const uaqi = data.indexes.find((idx) => idx.code === 'uaqi')?.aqi ?? 0;
    const pm25 =
      data.pollutants?.find((p) => p.code === 'pm25')?.concentration?.value ??
      0;
    const pm10 =
      data.pollutants?.find((p) => p.code === 'pm10')?.concentration?.value ??
      0;

    return { city, rawData: data, stats: { uaqi, pm25, pm10 } };
  };

  private evaluateCriticality = (parsed: ParsedResult): EvaluatedResult => {
    const { uaqi, pm25, pm10 } = parsed.stats;
    const isCritical = uaqi > 100 || pm25 > 100 || pm10 > 150;
    return { ...parsed, isCritical };
  };

  private processSideEffects = (evaluated: EvaluatedResult): void => {
    const { city, rawData, isCritical } = evaluated;

    if (!isCritical) {
      this.logger.log(`Air quality in ${city.name} is normal.`);
      return;
    }

    this.logger.warn(
      `🚀 DISPATCHING CRITICAL ALERT: ${city.name.toUpperCase()}`,
    );

    // This now matches your required JSON structure exactly
    const payload: AirQualityAlertPayload = {
      dateTime: new Date().toISOString(),
      city: city.name,
      pm10: evaluated.stats.pm10,
      pm25: evaluated.stats.pm25,
      uaqi: evaluated.stats.uaqi,
      regionCode: city.code.toLowerCase(),
      indexes: rawData.indexes,
    };

    this.rabbitClient.emit('air_quality_alert', payload).subscribe({
      error: (err) => this.logger.error(`RabbitMQ Emit Error: ${err.message}`),
    });
  };
}
