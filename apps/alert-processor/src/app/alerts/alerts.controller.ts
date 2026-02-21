import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AirQualityAlertPayload } from '@air-quality-monitor/shared-types';

@Controller()
export class AlertsController {
  private readonly logger = new Logger(AlertsController.name);

  @EventPattern('air_quality_alert')
  public async handleCriticalAlert(
    @Payload() data: AirQualityAlertPayload,
    @Ctx() context: RmqContext,
  ) {
    const uaqiData = data.indexes.find((i) => i.code === 'uaqi');

    const logMessage = [
      `[ALERT] CRITICAL AIR QUALITY DETECTED`,
      `City:: ${data.city.toUpperCase()} | Region ${data.regionCode.toUpperCase()}`,
      `AQI: ${uaqiData.aqi} | Category: ${uaqiData.category}`,
      `Dominant: ${uaqiData?.dominantPollutant} | Color: R:${uaqiData?.color?.red} G:${uaqiData?.color?.green}`,
    ].join('\n');

    this.logger.log(logMessage);
  }
}
