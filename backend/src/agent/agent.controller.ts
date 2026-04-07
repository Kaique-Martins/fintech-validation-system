import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentSchedulerService } from './agent-scheduler.service';
import { AgentRule, AgentConfig, AgentDecision } from './agent.types';
import { ValidationRecordDto, ValidationResultDto } from '../validation/dto/validation.dto';
import { ValidationService } from '../validation/validation.service';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly validationService: ValidationService,
    private readonly schedulerService: AgentSchedulerService,
  ) {}

  /**
   * Obtém configuração atual do agente
   */
  @Get('config')
  getConfig() {
    return this.agentService.getConfig();
  }

  /**
   * Atualiza configuração do agente
   */
  @Put('config')
  updateConfig(@Body() config: Partial<AgentConfig>) {
    return this.agentService.updateConfig(config);
  }

  /**
   * Obtém métricas do agente
   */
  @Get('metrics')
  getMetrics() {
    return this.agentService.getMetrics();
  }

  /**
   * Gera relatório completo do agente
   */
  @Get('report')
  generateReport() {
    return this.agentService.generateReport();
  }

  /**
   * Obtém últimas decisões do agente
   */
  @Get('decisions')
  getDecisions() {
    return this.agentService.getDecisions(50);
  }

  /**
   * Adiciona uma nova regra
   */
  @Post('rules')
  addRule(@Body() rule: AgentRule) {
    return this.agentService.addRule(rule);
  }

  /**
   * Atualiza uma regra existente
   */
  @Put('rules/:ruleId')
  updateRule(
    @Param('ruleId') ruleId: string,
    @Body() updates: Partial<AgentRule>,
  ) {
    return this.agentService.updateRule(ruleId, updates);
  }

  /**
   * Remove uma regra
   */
  @Post('rules/:ruleId/delete')
  removeRule(@Param('ruleId') ruleId: string) {
    return this.agentService.removeRule(ruleId);
  }

  /**
   * Valida um registro e deixa o agente decidir automaticamente
   */
  @Post('validate')
  validateWithAgent(@Body() record: ValidationRecordDto) {
    // Primeiro valida o registro
    const validation = this.validationService.validate(record);

    // Depois o agente toma uma decisão
    const agentDecision = this.agentService.evaluateValidation(
      `${record.produto}-${Date.now()}`,
      validation,
    );

    return {
      validation,
      agentDecision,
    };
  }

  /**
   * Processa múltiplos registros com decisão automática do agente
   */
  @Post('batch-validate')
  batchValidateWithAgent(@Body() records: ValidationRecordDto[]) {
    const results: Array<{ rowIndex: number; record: ValidationRecordDto; validation: ValidationResultDto }> = [];
    const decisions: AgentDecision[] = [];

    for (let i = 0; i < records.length; i++) {
      const validation = this.validationService.validate(records[i]);
      const decision = this.agentService.evaluateValidation(
        `record-${i}`,
        validation,
      );

      results.push({ rowIndex: i + 1, record: records[i], validation });
      decisions.push(decision);
    }

    return {
      totalRecords: records.length,
      results,
      decisions,
      summary: {
        approved: decisions.filter((d) => d.decision === 'APPROVED').length,
        rejected: decisions.filter((d) => d.decision === 'REJECTED').length,
        flagged: decisions.filter((d) => d.decision === 'FLAGGED').length,
        avgConfidence:
          decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length,
      },
      agentMetrics: this.agentService.getMetrics(),
    };
  }

  /**
   * Habilita/desabilita o agente
   */
  @Post('toggle')
  toggleAgent() {
    const current = this.agentService.getConfig();
    return this.agentService.updateConfig({
      enabled: !current.enabled,
    });
  }

  /**
   * Reseta métricas do agente (teste)
   */
  @Post('reset-metrics')
  resetMetrics() {
    this.agentService.resetMetrics();
    return { message: 'Métricas resetadas' };
  }

  /**
   * Retorna configuração do scheduler
   */
  @Get('scheduler/config')
  getSchedulerConfig() {
    return this.schedulerService.getScheduleConfig();
  }

  /**
   * Atualiza configuração do scheduler
   */
  @Put('scheduler/config')
  updateSchedulerConfig(
    @Body('enabled') enabled?: boolean,
    @Body('intervalSeconds') intervalSeconds?: number,
  ) {
    return this.schedulerService.updateScheduleConfig({
      enabled,
      intervalSeconds,
    });
  }

  /**
   * Retorna status do scheduler
   */
  @Get('scheduler/status')
  getSchedulerStatus() {
    return this.schedulerService.getStatus();
  }

  /**
   * Retorna histórico persistido de decisões
   */
  @Get('history/persisted')
  getPersistedHistory(
    @Body('limit') limit?: number,
    @Body('decision') decision?: string,
    @Body('minConfidence') minConfidence?: number,
  ) {
    return this.agentService.getPersistedDecisions(limit || 100, decision, minConfidence);
  }

  /**
   * Retorna estatísticas agregadas
   */
  @Get('history/aggregate')
  getAggregateStats() {
    return this.agentService.getAggregateStats();
  }

  /**
   * Retorna tendências de decisões
   */
  @Get('history/trends')
  getDecisionTrends(@Body('days') days?: number) {
    return this.agentService.getDecisionTrends(days || 7);
  }

  /**
   * Exporta decisões como CSV
   */
  @Get('history/export/csv')
  exportDecisionsCSV() {
    const csv = this.agentService.exportDecisionsAsCSV();
    return {
      format: 'csv',
      data: csv,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Analisa comportamento e gera insights de aprendizado
   */
  @Get('learning/analyze')
  analyzeLearning() {
    return this.agentService.analyzeLearning();
  }

  /**
   * Retorna insights de aprendizado
   */
  @Get('learning/insights')
  getLearningInsights() {
    return this.agentService.getLearningInsights();
  }

  /**
   * Retorna recomendações de aprendizado
   */
  @Get('learning/recommendations')
  getLearningRecommendations() {
    return this.agentService.getLearningRecommendations();
  }

  /**
   * Gera relatório completo com elementos de aprendizado
   */
  @Get('learning/report')
  generateLearningReport() {
    return this.agentService.generateLearningReport();
  }
}
