export class ValidationRecordDto {
  produto: string;
  categoria?: string;
  preco: number;
  cidade: string;
}

export class CorrectedDataDto {
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

export class ValidationResultDto {
  dado_corrigido: CorrectedDataDto;
  status: ValidationStatus;
  motivo: string;
  qualityScore: number; // 0-100
  confidenceLevel: number; // 0-100
  alerts: ValidationAlert[]; // Alertas detalhados
  recommendations: string[]; // Recomendações de ação
}
