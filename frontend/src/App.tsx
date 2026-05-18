import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { IntegratedDashboard } from './components/IntegratedDashboard';
import { Validator } from './components/Validator';
import { History } from './components/History';
import { FileUpload } from './components/FileUpload';
import { AgentControl } from './components/AgentControl';
import { api, validationService } from './services/validationService';
import { ValidationRecord, ValidationResult, AgentHistoryEntry } from './types/index';
import './styles/index.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'validator' | 'history' | 'import' | 'agent'>('dashboard');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AgentHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Carregar histórico do backend
  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await api.get('/agent/history/persisted?limit=200');
      setHistory(response.data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Carregar histórico ao montar o componente e quando voltar para a página de histórico
  useEffect(() => {
    if (currentPage === 'history') {
      loadHistory();
      // Atualizar a cada 5 segundos enquanto na página de histórico
      const interval = setInterval(loadHistory, 5000);
      return () => clearInterval(interval);
    }
  }, [currentPage]);

  const handleValidate = async (record: ValidationRecord) => {
    setLoading(true);
    try {
      const validationResult = await validationService.validate(record);
      setResult(validationResult);
      // Recarregar histórico se estiver na página de histórico
      if (currentPage === 'history') {
        await loadHistory();
      }
    } catch (error) {
      console.error('Validation error:', error);
      alert('Erro ao validar o registro. Verifique se a API está disponível e se a variável VITE_API_URL está correta.');
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const total = history.length;
    const approved = history.filter((v) => v.decision === 'APPROVED').length;
    const rejected = history.filter((v) => v.decision === 'REJECTED').length;
    const flagged = history.filter((v) => v.decision === 'FLAGGED').length;
    const approvalRate = total === 0 ? 0 : (approved / total) * 100;

    return {
      totalValidations: total,
      approved,
      rejected,
      flagged,
      approvalRate,
    };
  };

  const stats = getStats();

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="main-content">
        {currentPage === 'dashboard' && <IntegratedDashboard onNavigate={setCurrentPage} />}
        {currentPage === 'validator' && (
          <Validator onValidate={handleValidate} result={result} loading={loading} />
        )}
        {currentPage === 'import' && <FileUpload onUploadComplete={loadHistory} />}
        {currentPage === 'history' && (
          <History validations={history} onRefresh={loadHistory} />
        )}
        {currentPage === 'agent' && <AgentControl />}
      </main>
    </div>
  );
}

export default App;
