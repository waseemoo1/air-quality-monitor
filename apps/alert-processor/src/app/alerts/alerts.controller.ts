import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AirQualityAlertPayload } from '@air-quality-monitor/shared-types';
import { AlertsService } from './alerts.service';

@ApiTags('Alerts')
@Controller()
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get('alerts')
  @ApiOperation({ summary: 'Get the 20 most recent alerts' })
  async getRecentAlerts() {
    return this.alertsService.getRecentAlerts();
  }

  @EventPattern('air_quality_alert')
  public async handleCriticalAlert(
    @Payload() data: AirQualityAlertPayload,
    @Ctx() context: RmqContext,
  ) {
    await this.alertsService.processAndSaveAlert(data);
  }
}
