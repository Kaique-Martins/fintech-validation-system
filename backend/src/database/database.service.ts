import { Injectable } from '@nestjs/common';
import {
  IRepository,
  RepositoryFactory,
  PersistedDecision,
  DecisionAggregate,
  RepositoryQuery,
} from './index';

/**
 * Database Service
 * High-level service using repository abstraction
 * Automatically switches between JSON and database implementations
 */
@Injectable()
export class DatabaseService {
  private repository: IRepository;

  constructor() {
    // Initialize repository based on configuration
    this.repository = RepositoryFactory.create('auto');
    console.log('[DatabaseService] Initialized with repository:', this.repository.constructor.name);
  }

  // ==================== Decision Operations ====================

  /**
   * Save a decision to persistent storage
   */
  async saveDecision(decision: Omit<PersistedDecision, 'id'>): Promise<PersistedDecision> {
    const id = `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const persistedDecision: PersistedDecision = {
      ...decision,
      id,
    };
    await this.repository.saveDecision(persistedDecision);
    return persistedDecision;
  }

  /**
   * Synchronous wrapper for backward compatibility
   */
  saveDecisionSync(decision: Omit<PersistedDecision, 'id'>): PersistedDecision {
    const id = `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const persistedDecision: PersistedDecision = {
      ...decision,
      id,
    };
    // Non-blocking async call
    this.repository.saveDecision(persistedDecision).catch((err) => {
      console.error('Error saving decision:', err);
    });
    return persistedDecision;
  }

  /**
   * Get a single decision by ID
   */
  async getDecision(id: string): Promise<PersistedDecision | null> {
    return await this.repository.getDecision(id);
  }

  /**
   * Get all decisions with optional filtering
   */
  async getDecisions(query?: RepositoryQuery): Promise<PersistedDecision[]> {
    return await this.repository.getAllDecisions(query);
  }

  /**
   * Load decisions (backward compatible)
   */
  loadDecisions(): Promise<PersistedDecision[]> {
    return this.getDecisions();
  }

  /**
   * Query decisions with filters
   */
  async queryDecisions(query: any): Promise<PersistedDecision[]> {
    const repositoryQuery: RepositoryQuery = {
      limit: query.limit,
      startDate: query.startDate,
      endDate: query.endDate,
      decision: query.decision,
      confidenceMin: query.minConfidence,
    };
    return await this.repository.getAllDecisions(repositoryQuery);
  }

  // ==================== Aggregate Operations ====================

  /**
   * Get aggregate statistics
   */
  async getAggregate(): Promise<DecisionAggregate> {
    return await this.repository.getAggregate();
  }

  /**
   * Update aggregate statistics
   */
  async updateAggregate(aggregate: Partial<DecisionAggregate>): Promise<void> {
    return await this.repository.updateAggregate(aggregate);
  }

  // ==================== Reporting Operations ====================

  /**
   * Get decision trends over time
   */
  async getDecisionTrends(daysBack?: number): Promise<any> {
    return await this.repository.getDecisionTrends(daysBack);
  }

  /**
   * Export decisions as CSV
   */
  async exportAsCSV(query?: RepositoryQuery): Promise<string> {
    return await this.repository.exportCSV(query);
  }

  /**
   * Get decisions by rule
   */
  async getDecisionsByRule(ruleId: string): Promise<PersistedDecision[]> {
    return await this.repository.getDecisionsByRule(ruleId);
  }

  /**
   * Get decisions by date range
   */
  async getDecisionsByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<PersistedDecision[]> {
    return await this.repository.getDecisionsByDateRange(startDate, endDate);
  }

  // ==================== Utility Operations ====================

  /**
   * Clear all data (USE WITH CAUTION)
   */
  async clear(): Promise<void> {
    return await this.repository.clear();
  }

  /**
   * Backward compatible clearAll
   */
  clearAll(): Promise<void> {
    return this.clear();
  }

  /**
   * Health check for repository
   */
  async health(): Promise<{ status: string; timestamp: string; implementation: string }> {
    return await this.repository.health();
  }

  /**
   * Get current repository type
   */
  getRepositoryType(): string {
    return this.repository.constructor.name;
  }
}
