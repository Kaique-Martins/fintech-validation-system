import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ValidationModule } from './validation/validation.module';
import { AgentModule } from './agent/agent.module';
import { NotificationModule } from './notifications/notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ValidationModule,
    AgentModule,
    NotificationModule,
  ],
})
export class AppModule {}
