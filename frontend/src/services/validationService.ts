import axios from 'axios';
import { ValidationRecord, ValidationResult } from '../types/validation';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface BatchValidationResponse {
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  results: Array<{
    rowIndex: number;
    record: ValidationRecord;
    result?: ValidationResult;
    error?: string;
  }>;
  processingTime: number;
}

export interface ExportCsvResponse {
  format: string;
  data: string;
  timestamp: string;
}

export const validationService = {
  async validate(record: ValidationRecord): Promise<ValidationResult> {
    try {
      const response = await api.post<ValidationResult>('/validation/validate', record);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async batchValidate(records: ValidationRecord[]): Promise<BatchValidationResponse> {
    try {
      const response = await api.post<BatchValidationResponse>('/validation/batch-validate', records);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getInterface(): Promise<string> {
    try {
      const response = await api.get('/validation/interface');
      return response.data.interface;
    } catch (error) {
      throw error;
    }
  },

  async getInfo(): Promise<any> {
    try {
      const response = await api.get('/validation/info');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAgentReportCsv(): Promise<ExportCsvResponse> {
    try {
      const response = await api.get<ExportCsvResponse>('/agent/history/export/csv');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
