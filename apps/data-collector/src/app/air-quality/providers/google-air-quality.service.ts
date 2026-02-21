import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IAirQualityProvider } from '../interfaces/air-quality-provider.interface';
import { City } from '../interfaces';
import { RawApiResponse } from '../interfaces/air-quality-internal.interface';

@Injectable()
export class GoogleAirQualityService implements IAirQualityProvider {
  private readonly logger = new Logger(GoogleAirQualityService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async fetchCityData(
    city: City,
  ): Promise<{ city: City; data: RawApiResponse }> {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    const url = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, {
          location: { latitude: city.lat, longitude: city.lng },
        }),
      );
      return { city, data: response.data };
    } catch (error) {
      this.logger.error(
        `Failed to fetch real data for ${city.name}: ${error.message}`,
      );
      return { city, data: null };
    }
  }
}
