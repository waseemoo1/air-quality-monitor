import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AlertsService } from './alerts.service';
import { AlertsGateway } from './alerts.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsGateway],
})
export class AlertsModule {}
