export interface AirQualityAlert {
  city: string;
  aqi: number;
  category: string;
  timestamp: string;
}

export const getSeverityClass = (
  category: string,
): 'critical' | 'warning' | 'info' => {
  if (
    category === 'Hazardous' ||
    category === 'Very Unhealthy' ||
    category === 'Unhealthy'
  ) {
    return 'critical';
  }
  if (
    category === 'Unhealthy for Sensitive Groups' ||
    category === 'Moderate'
  ) {
    return 'warning';
  }
  return 'info';
};
