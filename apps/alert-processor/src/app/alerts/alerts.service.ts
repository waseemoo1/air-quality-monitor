import { Injectable, Logger } from '@nestjs/common';
import { AirQualityAlertPayload } from '@air-quality-monitor/shared-types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(private readonly prisma: PrismaService) {}

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

      this.logger.log(
        `💾 Successfully saved alert to database! (ID: ${savedAlert.id})`,
      );
    } catch (error) {
      this.logger.error(`Failed to save alert to database: ${error.message}`);
    }
  }
}
