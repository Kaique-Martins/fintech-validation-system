import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { DecisionExplanationService } from './services/decision-explanation.service';
import { AgentFeedbackService } from './services/agent-feedback.service';
import { AgentEvolutionService } from './services/agent-evolution.service';
import { AgentAnomalyDetectorService } from './services/agent-anomaly-detector.service';
import { UserFeedback, AgentReasoningQuery } from './agent-explanation.types';

@Controller('api/agent/explainability')
export class ExplainabilityController {
  private readonly logger = new Logger(ExplainabilityController.name);

  constructor(
    private readonly explanationService: DecisionExplanationService,
    private readonly feedbackService: AgentFeedbackService,
    private readonly evolutionService: AgentEvolutionService,
    private readonly anomalyDetector: AgentAnomalyDetectorService,
  ) {}

  /**
   * GET /api/agent/explainability/feedback
   * Retorna histórico de feedback do usuário
   */
  @Get('feedback')
  getFeedbackHistory() {
    return {
      success: true,
      data: {
        feedbacks: this.feedbackService.getFeedbackHistory(),
        agreementRate: this.feedbackService.getUserAgreementRate(),
        report: this.feedbackService.generateLearningReport(),
      },
    };
  }

  /**
   * POST /api/agent/explainability/feedback
   * Registra feedback do usuário sobre uma decisão
   */
  @Post('feedback')
  async recordFeedback(
    @Body()
    body: {
      recordId: string;
      originalDecision: 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'NEUTRAL';
      userAgreement: boolean;
      appliedRules: string[];
      userFeedbackText?: string;
      suggestedDecision?: 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'NEUTRAL';
    },
  ) {
    const feedback: UserFeedback = {
      recordId: body.recordId,
      originalDecision: body.originalDecision,
      userAgreement: body.userAgreement,
      userFeedbackText: body.userFeedbackText,
      suggestedDecision: body.suggestedDecision,
      timestamp: new Date().toISOString(),
    };

    await this.feedbackService.recordFeedback(feedback, body.appliedRules);

    return {
      success: true,
      message: `Feedback recorded: ${body.userAgreement ? 'AGREED' : 'DISAGREED'}`,
      data: {
        agreementRate: this.feedbackService.getUserAgreementRate(),
      },
    };
  }

  /**
   * GET /api/agent/explainability/evolution
   * Retorna histórico de evolução do agent
   */
  @Get('evolution')
  getEvolution() {
    return {
      success: true,
      data: {
        evolutionHistory: this.evolutionService.getEvolutionHistory(),
        latestMetrics: this.evolutionService.getLatestEvolution(),
        report: this.evolutionService.generateEvolutionReport(),
      },
    };
  }

  /**
   * POST /api/agent/explainability/evolution/checkpoint
   * Registra um ponto de evolução atual
   */
  @Post('evolution/checkpoint')
  recordEvolutionCheckpoint(
    @Body()
    body: {
      decisionCount: number;
    },
  ) {
    this.evolutionService.recordEvolutionPoint(
      body.decisionCount,
      this.feedbackService.getAllRuleWeightHistories(),
    );

    return {
      success: true,
      message: 'Evolution checkpoint recorded',
      data: this.evolutionService.getLatestEvolution(),
    };
  }

  /**
   * GET /api/agent/explainability/anomalies
   * Retorna anomalias detectadas no comportamento do agent
   */
  @Get('anomalies')
  getAnomalies() {
    return {
      success: true,
      data: {
        anomalies: this.anomalyDetector.getRecentAnomalies(20),
        highSeverity: this.anomalyDetector.getAnomaliesBySeverity('HIGH'),
        mediumSeverity: this.anomalyDetector.getAnomaliesBySeverity('MEDIUM'),
        report: this.anomalyDetector.generateAnomalyReport(),
      },
    };
  }

  /**
   * GET /api/agent/explainability/insights
   * Retorna insights consolidados sobre o agent
   */
  @Get('insights')
  getInsights() {
    const feedbackReport = this.feedbackService.generateLearningReport();
    const evolutionMetrics = this.evolutionService.getLatestEvolution();
    const anomalies = this.anomalyDetector.getRecentAnomalies(5);

    return {
      success: true,
      data: {
        feedback: feedbackReport,
        evolution: evolutionMetrics,
        anomalies: anomalies,
        summary: {
          agentHealthScore: this.calculateHealthScore(
            feedbackReport.agreementRate,
            anomalies.length,
          ),
          recommendation: this.generateRecommendation(
            feedbackReport.agreementRate,
            anomalies,
          ),
        },
      },
    };
  }

  /**
   * POST /api/agent/explainability/reasoning
   * Responde perguntas sobre decisões do agent
   */
  @Post('reasoning')
  answerReasoningQuery(
    @Body()
    body: {
      recordId?: string;
      queryType: 'WHY_DECISION' | 'HYPOTHETICAL' | 'RULE_COMPARISON';
      hypotheticalChanges?: { field: string; newValue: any }[];
      compareWithTimestamp?: string;
    },
  ) {
    // Seria necessário recuperar a explanation real do banco de dados
    // Por enquanto, retorna um placeholder
    return {
      success: true,
      data: {
        query: body,
        naturalLanguageExplanation:
          'Based on the selected rules and their weights, the decision was made with the following reasoning...',
        detailedBreakdown: [
          {
            rule: 'high-quality',
            impact: 'Matched - increased approval likelihood',
            percentage: 50,
          },
          {
            rule: 'price-sanity',
            impact: 'Matched - validated price range',
            percentage: 30,
          },
        ],
      },
    };
  }

  /**
   * Calcula score de saúde do agent
   */
  private calculateHealthScore(agreementRate: number, anomalyCount: number): number {
    const agreementScore = agreementRate;
    const anomalyScore = Math.max(0, 100 - anomalyCount * 10);
    return Math.round((agreementScore + anomalyScore) / 2);
  }

  /**
   * Gera recomendação baseada em estado do agent
   */
  private generateRecommendation(
    agreementRate: number,
    anomalies: any[],
  ): string {
    if (agreementRate < 70) {
      return '⚠️ Agent agreement rate low - consider reviewing rule weights or retraining';
    }
    if (anomalies.some((a) => a.severity === 'HIGH')) {
      return '🚨 High severity anomalies detected - immediate review recommended';
    }
    if (agreementRate > 90) {
      return '✅ Agent performing well - continue monitoring';
    }
    return '📊 Agent operating normally - monitor for changes';
  }
}
