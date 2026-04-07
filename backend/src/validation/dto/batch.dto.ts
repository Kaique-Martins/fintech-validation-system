import { ValidationRecordDto } from './validation.dto';

export interface BatchValidationItemDto {
  rowIndex: number;
  record: ValidationRecordDto;
}

export interface BatchValidationResultDto {
  rowIndex: number;
  record: ValidationRecordDto;
  result: {
    dado_corrigido: {
      produto: string;
      categoria: string;
      preco: number;
      cidade: string;
    };
    status: 'APROVADO' | 'QUARENTENA';
    motivo: string;
  };
  error?: string;
  agentDecision?: any;
}

export interface BatchProcessResponse {
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  results: BatchValidationResultDto[];
  processingTime: number;
}
