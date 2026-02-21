import { Injectable, Logger } from '@nestjs/common';
import { IAirQualityProvider } from '../interfaces/air-quality-provider.interface';
import { City } from '../interfaces';
import { RawApiResponse } from '../interfaces/air-quality-internal.interface';

@Injectable()
export class MockAirQualityService implements IAirQualityProvider {
  private readonly logger = new Logger(MockAirQualityService.name);

  async fetchCityData(
    city: City,
  ): Promise<{ city: City; data: RawApiResponse }> {
    this.logger.log(`[MOCK] Generating random data for ${city.name}...`);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const randomUaqi = Math.floor(Math.random() * 150);
    const randomPm25 = Math.floor(Math.random() * 120);
    const randomPm10 = Math.floor(Math.random() * 180);

    const mockResponse: RawApiResponse = {
      indexes: [
        {
          code: 'uaqi',
          displayName: 'Universal AQI',
          aqi: randomUaqi,
          aqiDisplay: randomUaqi.toString(),
          category: randomUaqi > 100 ? 'Unhealthy' : 'Moderate air quality',
          dominantPollutant: 'pm25',
          color: {
            red: randomUaqi > 100 ? 1 : 0.5,
            green: randomUaqi > 100 ? 0 : 0.8,
            blue: 0,
          },
        },
      ],
      pollutants: [
        {
          code: 'pm25',
          concentration: { value: randomPm25, units: 'µg/m3' },
        },
        {
          code: 'pm10',
          concentration: { value: randomPm10, units: 'µg/m3' },
        },
      ],
    };

    return { city, data: mockResponse };
  }
}
