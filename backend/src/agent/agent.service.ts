import { Injectable } from '@nestjs/common';
import {
  AgentRule,
  AgentConfig,
  AgentMetrics,
  AgentDecision,
  DEFAULT_AGENT_CONFIG,
} from './agent.types';
import { ValidationResultDto } from '../validation/dto/validation.dto';
import { DatabaseService } from '../database/database.service';
import { LearningService } from './learning.service';

@Injectable()
export class AgentService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly learningService: LearningService,
  ) {}
  
  private agentConfig: AgentConfig = DEFAULT_AGENT_CONFIG;
  private metrics: AgentMetrics = {
    totalProcessed: 0,
    approved: 0,
    rejected: 0,
    flaggedForReview: 0,
    successRate: 0,
    avgProcessingTime: 0,
    rulesApplied: {},
    lastUpdate: new Date().toISOString(),
  };
  private decisions: AgentDecision[] = [];

  /**
   * Processa um resultado de validação através do agente
   */
  evaluateValidation(
    recordId: string,
    validation: ValidationResultDto,
  ): AgentDecision {
    const startTime = Date.now();
    const appliedRules: string[] = [];
    let finalDecision: 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'NEUTRAL' =
      'NEUTRAL';
    const reasonings: string[] = [];

    // Ordena regras por prioridade (maior primeiro)
    const sortedRules = [...this.agentConfig.rules]
      .filter((r) => r.enabled)
      .sort((a, b) => b.priority - a.priority);

    // Avalia cada regra
    for (const rule of sortedRules) {
      const ruleMatched = this.evaluateRule(rule, validation);

      if (ruleMatched) {
        appliedRules.push(rule.id);
        this.metrics.rulesApplied[rule.id] =
          (this.metrics.rulesApplied[rule.id] || 0) + 1;

        // Aplica ações da regra
        if (rule.action.autoApprove) {
          finalDecision = 'APPROVED';
          reasonings.push(`✅ ${rule.name}`);
        } else if (rule.action.autoReject) {
          finalDecision = 'REJECTED';
          reasonings.push(`❌ ${rule.name}`);
        } else if (rule.action.flagForReview) {
          if (finalDecision !== 'REJECTED') {
            finalDecision = 'FLAGGED';
          }
          reasonings.push(`🚩 ${rule.name}: ${rule.action.customMessage}`);
        }
      }
    }

    // Se nenhuma regra foi aplicada, usa a decisão padrão
    if (appliedRules.length === 0) {
      if (validation.status === 'QUARENTENA') {
        finalDecision = 'FLAGGED';
        reasonings.push('Validação indicou QUARENTENA - marcado para revisão');
      } else {
        finalDecision = 'APPROVED';
        reasonings.push('Validação OK - aprovado por padrão');
      }
    }

    // Atualiza métricas
    const processingTime = Date.now() - startTime;
    this.updateMetrics(finalDecision, processingTime);

    const decision: AgentDecision = {
      recordId,
      decision: finalDecision,
      confidence: validation.confidenceLevel,
      rulesApplied: appliedRules,
      reasoning: reasonings.join(' | '),
      timestamp: new Date().toISOString(),
      isAuto: appliedRules.length > 0,
    };

    this.decisions.push(decision);

    // Persist decision to database
    this.dbService.saveDecision({
      recordId,
      decision: finalDecision,
      confidence: validation.confidenceLevel,
      rulesApplied: appliedRules,
      reasoning: reasonings.join(' | '),
      timestamp: new Date().toISOString(),
      isAuto: appliedRules.length > 0,
      processingTimeMs: processingTime,
      agentVersion: '1.0.0',
      qualityScore: validation.qualityScore,
      status: validation.status,
    });

    // Mantém apenas últimas 1000 decisões
    if (this.decisions.length > 1000) {
      this.decisions = this.decisions.slice(-1000);
    }

    return decision;
  }

  /**
   * Avalia se uma regra se aplica ao resultado de validação
   */
  private evaluateRule(
    rule: AgentRule,
    validation: ValidationResultDto,
  ): boolean {
    const fieldValue = this.getFieldValue(rule.condition.field, validation);

    switch (rule.condition.operator) {
      case 'lessThan':
        return fieldValue < rule.condition.value;
      case 'greaterThan':
        return fieldValue > rule.condition.value;
      case 'equals':
        return fieldValue === rule.condition.value;
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.some((item) =>
            String(item).includes(rule.condition.value),
          );
        }
        return String(fieldValue).includes(rule.condition.value);
      default:
        return false;
    }
  }

  /**
   * Extrai valor do campo para avaliação de regra
   */
  private getFieldValue(
    field: string,
    validation: ValidationResultDto,
  ): any {
    switch (field) {
      case 'price':
        return validation.dado_corrigido.preco;
      case 'quality':
        return validation.qualityScore;
      case 'confidence':
        return validation.confidenceLevel;
      case 'alerts':
        return validation.alerts.map((a) => a.severity);
      case 'status':
        return validation.status;
      default:
        return null;
    }
  }

  /**
   * Atualiza métricas do agente
   */
  private updateMetrics(
    decision: string,
    processingTime: number,
  ): void {
    this.metrics.totalProcessed++;

    switch (decision) {
      case 'APPROVED':
        this.metrics.approved++;
        break;
      case 'REJECTED':
        this.metrics.rejected++;
        break;
      case 'FLAGGED':
        this.metrics.flaggedForReview++;
        break;
    }

    // Atualiza média de tempo
    this.metrics.avgProcessingTime =
      (this.metrics.avgProcessingTime * (this.metrics.totalProcessed - 1) +
        processingTime) /
      this.metrics.totalProcessed;

    this.metrics.successRate = (this.metrics.approved / this.metrics.totalProcessed) * 100;

    this.metrics.lastUpdate = new Date().toISOString();
  }

  /**
   * Atualiza configuração do agente
   */
  updateConfig(newConfig: Partial<AgentConfig>): AgentConfig {
    this.agentConfig = { ...this.agentConfig, ...newConfig };
    return this.agentConfig;
  }

  /**
   * Adiciona uma nova regra
   */
  addRule(rule: AgentRule): AgentConfig {
    this.agentConfig.rules.push(rule);
    return this.agentConfig;
  }

  /**
   * Remove uma regra
   */
  removeRule(ruleId: string): AgentConfig {
    this.agentConfig.rules = this.agentConfig.rules.filter(
      (r) => r.id !== ruleId,
    );
    return this.agentConfig;
  }

  /**
   * Atualiza uma regra existente
   */
  updateRule(ruleId: string, updates: Partial<AgentRule>): AgentConfig {
    const ruleIndex = this.agentConfig.rules.findIndex((r) => r.id === ruleId);
    if (ruleIndex >= 0) {
      this.agentConfig.rules[ruleIndex] = {
        ...this.agentConfig.rules[ruleIndex],
        ...updates,
      };
    }
    return this.agentConfig;
  }

  /**
   * Retorna configuração atual do agente
   */
  getConfig(): AgentConfig {
    return this.agentConfig;
  }

  /**
   * Retorna métricas do agente
   */
  getMetrics(): AgentMetrics {
    return { ...this.metrics };
  }

  /**
   * Retorna últimas decisões do agente
   */
  getDecisions(limit: number = 50): AgentDecision[] {
    return this.decisions.slice(-limit);
  }

  /**
   * Retorna histórico persistido de decisões
   */
  async getPersistedDecisions(limit = 100, decision?: string, minConfidence?: number) {
    return await this.dbService.queryDecisions({
      limit,
      decision: decision as any,
      minConfidence,
    });
  }

  /**
   * Retorna estatísticas agregadas do histórico
   */
  async getAggregateStats() {
    return await this.dbService.getAggregate();
  }

  /**
   * Retorna tendências de decisões (últimos N dias)
   */
  getDecisionTrends(days = 7) {
    return this.dbService.getDecisionTrends(days);
  }

  /**
   * Exporta decisões como CSV
   */
  exportDecisionsAsCSV() {
    return this.dbService.exportAsCSV();
  }

  /**
   * Reseta métricas (para teste)
   */
  resetMetrics(): void {
    this.metrics = {
      totalProcessed: 0,
      approved: 0,
      rejected: 0,
      flaggedForReview: 0,
      successRate: 0,
      avgProcessingTime: 0,
      rulesApplied: {},
      lastUpdate: new Date().toISOString(),
    };
  }

  /**
   * Gera relatório de performance do agente
   */
  generateReport(): {
    config: AgentConfig;
    metrics: AgentMetrics;
    recentDecisions: AgentDecision[];
    performance: {
      approvalRate: string;
      rejectionRate: string;
      reviewRate: string;
      avgTime: string;
    };
  } {
    const total = this.metrics.totalProcessed || 1;

    return {
      config: this.agentConfig,
      metrics: this.metrics,
      recentDecisions: this.getDecisions(20),
      performance: {
        approvalRate: `${((this.metrics.approved / total) * 100).toFixed(1)}%`,
        rejectionRate: `${((this.metrics.rejected / total) * 100).toFixed(1)}%`,
        reviewRate: `${((this.metrics.flaggedForReview / total) * 100).toFixed(1)}%`,
        avgTime: `${this.metrics.avgProcessingTime.toFixed(0)}ms`,
      },
    };
  }

  /**
   * Analisa comportamento do agente e gera insights de aprendizado
   */
  analyzeLearning() {
    return this.learningService.analyzeBehavior();
  }

  /**
   * Retorna insights de aprendizado
   */
  getLearningInsights() {
    return this.learningService.getInsights();
  }

  /**
   * Retorna recomendações de aprendizado
   */
  getLearningRecommendations() {
    return this.learningService.getRecommendations();
  }

  /**
   * Gera relatório completo com elementos de aprendizado
   */
  generateLearningReport() {
    return this.learningService.generateReport();
  }
}
