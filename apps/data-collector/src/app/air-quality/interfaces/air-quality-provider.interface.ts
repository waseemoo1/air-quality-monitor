import { RawApiResponse } from './air-quality-internal.interface';
import { City } from './city.interface';

export const AIR_QUALITY_PROVIDER = 'AIR_QUALITY_PROVIDER';

export interface IAirQualityProvider {
  fetchCityData(city: City): Promise<{ city: City; data: RawApiResponse }>;
}
