export interface ValidationRecord {
  produto: string;
  categoria?: string;
  preco: number;
  cidade: string;
}

export interface CorrectedData {
  produto: string;
  categoria: string;
  preco: number;
  cidade: string;
}

export type ValidationStatus = 'APROVADO' | 'QUARENTENA';

export interface ValidationAlert {
  severity: 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO' | 'INFO';
  code: string;
  message: string;
  field: string;
  suggestion?: string;
}

export interface ValidationResult {
  dado_corrigido: CorrectedData;
  status: ValidationStatus;
  motivo: string;
  qualityScore: number;
  confidenceLevel: number;
  alerts: ValidationAlert[];
  recommendations: string[];
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}
