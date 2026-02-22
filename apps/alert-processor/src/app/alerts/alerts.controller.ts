import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AirQualityAlertPayload } from '@air-quality-monitor/shared-types';
import { AlertsService } from './alerts.service';

@Controller()
export class AlertsController {
  // Inject the new AlertsService
  constructor(private readonly alertsService: AlertsService) {}

  @EventPattern('air_quality_alert')
  public async handleCriticalAlert(
    @Payload() data: AirQualityAlertPayload,
    @Ctx() context: RmqContext,
  ) {
    await this.alertsService.processAndSaveAlert(data);
  }
}
