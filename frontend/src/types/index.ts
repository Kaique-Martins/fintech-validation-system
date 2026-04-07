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
  qualityScore: number; // 0-100
  confidenceLevel: number; // 0-100
  alerts: ValidationAlert[]; // Detalhes de problemas detectados
  recommendations: string[]; // Ações recomendadas
}

export interface ValidationHistory extends ValidationResult {
  id: string;
  timestamp: string;
  input: ValidationRecord;
}

export interface DashboardStats {
  totalValidations: number;
  approved: number;
  quarantine: number;
  approvalRate: number;
}
