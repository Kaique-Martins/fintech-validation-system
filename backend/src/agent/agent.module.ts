import { Module, forwardRef } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { DemoController } from './demo.controller';
import { AgentSchedulerService } from './agent-scheduler.service';
import { LearningService } from './learning.service';
import { ValidationModule } from '../validation/validation.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [forwardRef(() => ValidationModule), DatabaseModule],
  providers: [AgentService, AgentSchedulerService, LearningService],
  controllers: [AgentController, DemoController],
  exports: [AgentService],
})
export class AgentModule {}
