import { AirQualityAlertPayload } from '@air-quality-monitor/shared-types';
import { City } from './city.interface';

export interface RawApiResponse {
  indexes: AirQualityAlertPayload['indexes'];
  pollutants?: Array<{
    code: string;
    concentration: { value: number; units: string };
  }>;
}

export interface ParsedResult {
  city: City;
  rawData: RawApiResponse;
  stats: {
    uaqi: number;
    pm25: number;
    pm10: number;
  };
}

export interface EvaluatedResult extends ParsedResult {
  isCritical: boolean;
}
