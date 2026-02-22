import { Injectable, Logger } from '@nestjs/common';
import { AirQualityAlertPayload } from '@air-quality-monitor/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import { AlertsGateway } from './alerts.gateway';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly alertsGateway: AlertsGateway,
  ) {}

  public async getRecentAlerts() {
    const alerts = await this.prisma.alert.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    return alerts.map((alert) => ({
      city: alert.city,
      aqi: alert.uaqi,
      category: this.getAqiCategory(alert.uaqi),
      timestamp: alert.timestamp.toISOString(),
    }));
  }

  public async processAndSaveAlert(
    data: AirQualityAlertPayload,
  ): Promise<void> {
    const uaqiData = data.indexes.find((i) => i.code === 'uaqi');

    const logMessage = [
      `[ALERT] CRITICAL AIR QUALITY DETECTED`,
      `City: ${data.city.toUpperCase()} | Region: ${data.regionCode.toUpperCase()}`,
      `AQI: ${uaqiData?.aqi} | Category: ${uaqiData?.category}`,
      `Dominant: ${uaqiData?.dominantPollutant} | Color: R:${uaqiData?.color?.red} G:${uaqiData?.color?.green}`,
    ].join('\n');

    this.logger.log(logMessage);

    try {
      const savedAlert = await this.prisma.alert.create({
        data: {
          timestamp: new Date(data.dateTime),
          regionCode: data.regionCode,
          city: data.city,
          uaqi: data.uaqi,
          pm25: data.pm25,
          pm10: data.pm10,
          indexesPayload: data.indexes,
        },
      });

      const category = this.getAqiCategory(data.uaqi);

      this.logger.log(
        `💾 Successfully saved alert to database! (ID: ${savedAlert.id})`,
      );

      // Broadcast alert to connected WebSocket clients
      this.alertsGateway.broadcastAlert({
        city: data.city,
        aqi: data.uaqi,
        category,
        timestamp: savedAlert.timestamp.toISOString(),
      });
    } catch (error) {
      this.logger.error(`Failed to save alert to database: ${error.message}`);
    }
  }

  private getAqiCategory(uaqi: number): string {
    if (uaqi <= 50) return 'Good';
    if (uaqi <= 100) return 'Moderate';
    if (uaqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (uaqi <= 200) return 'Unhealthy';
    if (uaqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }
}
