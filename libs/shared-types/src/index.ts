export interface AirQualityAlertPayload {
  dateTime: string;
  regionCode: string;
  city: string;
  uaqi: number;
  pm25: number;
  pm10: number;
  indexes: Array<{
    code: string;
    displayName: string;
    aqi: number;
    aqiDisplay?: string;
    color?: {
      red: number;
      green: number;
      blue?: number;
    };
    category: string;
    dominantPollutant: string;
  }>;
}
