import React, { useMemo, useState } from 'react';
import { AgentHistoryEntry } from '../types/index';
import { api } from '../services/validationService';
import '../styles/History.css';

interface HistoryProps {
  validations: AgentHistoryEntry[];
  onRefresh?: () => Promise<void>;
}

export const History: React.FC<HistoryProps> = ({ validations, onRefresh }) => {
  const [filterDecision, setFilterDecision] = useState<'all' | 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'NEUTRAL'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'APROVADO' | 'QUARENTENA'>('all');
  const [query, setQuery] = useState('');
  const [minConfidence, setMinConfidence] = useState('');
  const [maxConfidence, setMaxConfidence] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  const filtered = useMemo(() => {
    return validations.filter((v) => {
      const haystack = [
        v.recordId,
        v.decision,
        v.reasoning,
        v.status,
        v.input?.produto,
        v.input?.categoria,
        v.input?.cidade,
        v.correctedData?.produto,
        v.correctedData?.categoria,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (filterDecision !== 'all' && v.decision !== filterDecision) return false;
      if (filterStatus !== 'all' && v.status !== filterStatus) return false;
      if (minConfidence && v.confidence < Number(minConfidence)) return false;
      if (maxConfidence && v.confidence > Number(maxConfidence)) return false;
      if (startDate && new Date(v.timestamp) < new Date(startDate)) return false;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(v.timestamp) > end) return false;
      }
      return true;
    });
  }, [validations, query, filterDecision, filterStatus, minConfidence, maxConfidence, startDate, endDate]);

  const totals = useMemo(() => {
    const approved = validations.filter((v) => v.status === 'APROVADO').length;
    const quarantine = validations.filter((v) => v.status === 'QUARENTENA').length;
    const auto = validations.filter((v) => v.isAuto).length;
    const avgConfidence = validations.length ? validations.reduce((sum, v) => sum + v.confidence, 0) / validations.length : 0;
    const avgQuality = validations.length ? validations.reduce((sum, v) => sum + v.qualityScore, 0) / validations.length : 0;

    return { approved, quarantine, auto, avgConfidence, avgQuality };
  }, [validations]);

  const handleExportCsv = async () => {
    try {
      setExportLoading(true);
      const params = new URLSearchParams();
      if (filterDecision !== 'all') params.set('decision', filterDecision);
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (query) params.set('ruleId', query);
      if (minConfidence) params.set('minConfidence', minConfidence);
      if (maxConfidence) params.set('maxConfidence', maxConfidence);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      params.set('limit', '500');

      const response = await api.get(`/agent/history/export/csv?${params.toString()}`);
      const blob = new Blob([response.data.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `historico-agent-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historico-agent-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilterDecision('all');
    setFilterStatus('all');
    setQuery('');
    setMinConfidence('');
    setMaxConfidence('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="history">
      <div className="history-header">
        <h1>📜 Histórico Inteligente</h1>
        <p>Decisões persistidas com contexto original, filtros e exportação completa</p>
      </div>

      <div className="history-summary-grid">
        <div className="history-summary-card">
          <span>Total</span>
          <strong>{validations.length}</strong>
        </div>
        <div className="history-summary-card approved">
          <span>Aprovados</span>
          <strong>{totals.approved}</strong>
        </div>
        <div className="history-summary-card quarantine">
          <span>Quarentena</span>
          <strong>{totals.quarantine}</strong>
        </div>
        <div className="history-summary-card">
          <span>Confiança média</span>
          <strong>{totals.avgConfidence.toFixed(1)}%</strong>
        </div>
        <div className="history-summary-card">
          <span>Qualidade média</span>
          <strong>{totals.avgQuality.toFixed(1)}%</strong>
        </div>
        <div className="history-summary-card">
          <span>Automáticas</span>
          <strong>{totals.auto}</strong>
        </div>
      </div>

      <div className="history-controls history-controls-rich">
        <div className="history-filters-grid">
          <input className="history-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por produto, cidade, decisão, regra ou recordId" />
          <select className="history-select" value={filterDecision} onChange={(e) => setFilterDecision(e.target.value as any)}>
            <option value="all">Todas as decisões</option>
            <option value="APPROVED">Aprovado</option>
            <option value="REJECTED">Rejeitado</option>
            <option value="FLAGGED">Marcado</option>
            <option value="NEUTRAL">Neutro</option>
          </select>
          <select className="history-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
            <option value="all">Todos os status</option>
            <option value="APROVADO">Aprovado</option>
            <option value="QUARENTENA">Quarentena</option>
          </select>
          <input className="history-input" type="number" min="0" max="100" value={minConfidence} onChange={(e) => setMinConfidence(e.target.value)} placeholder="Confiança mín." />
          <input className="history-input" type="number" min="0" max="100" value={maxConfidence} onChange={(e) => setMaxConfidence(e.target.value)} placeholder="Confiança máx." />
          <input className="history-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input className="history-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="history-actions">
          <button className="history-action-btn secondary" onClick={clearFilters}>Limpar filtros</button>
          <button className="history-action-btn secondary" onClick={onRefresh}>Atualizar</button>
          <button className="history-action-btn" onClick={handleExportCsv} disabled={exportLoading}>
            {exportLoading ? 'Exportando...' : 'Exportar CSV'}
          </button>
          <button className="history-action-btn" onClick={handleExportJson}>Exportar JSON</button>
        </div>
      </div>

      <div className="history-info">
        <span className="total">Mostrando {filtered.length} de {validations.length} registros</span>
      </div>

      <div className="history-table">
        {filtered.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Entrada</th>
                <th>Saída</th>
                <th>Decisão</th>
                <th>Confiança</th>
                <th>Regras</th>
                <th>Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((validation) => (
                <tr key={validation.id} className={`status-${validation.status.toLowerCase()}`}>
                  <td className="product-cell">
                    <span className="product-name">{validation.input?.produto || validation.recordId}</span>
                    <small>{validation.recordId}</small>
                  </td>
                  <td>
                    <div className="history-inline-metadata">
                      <span>{validation.input?.categoria || 'N/D'}</span>
                      <span>{validation.input?.cidade || 'N/D'}</span>
                      <span>R$ {(validation.input?.preco ?? 0).toFixed(2)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="history-inline-metadata">
                      <span>{validation.correctedData?.categoria || 'N/D'}</span>
                      <span>{validation.correctedData?.cidade || 'N/D'}</span>
                      <span>R$ {(validation.correctedData?.preco ?? 0).toFixed(2)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="history-decision-stack">
                      <span className={`status-badge ${validation.status.toLowerCase()}`}>
                        {validation.status === 'APROVADO' ? '✅ APROVADO' : '🚨 QUARENTENA'}
                      </span>
                      <span className={`decision-pill ${validation.decision.toLowerCase()}`}>
                        {validation.decision}
                      </span>
                    </div>
                  </td>
                  <td className="price-cell">{validation.confidence.toFixed(0)}%</td>
                  <td>
                    <div className="history-rule-list">
                      {validation.rulesApplied.length > 0 ? validation.rulesApplied.map((rule) => (
                        <span key={rule} className="history-rule-chip">{rule}</span>
                      )) : <span className="history-rule-chip muted">Sem regra</span>}
                    </div>
                  </td>
                  <td className="date-cell">{new Date(validation.timestamp).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>Nenhum registro encontrado com os filtros atuais</p>
            <button className="history-action-btn secondary" onClick={clearFilters}>Limpar filtros</button>
          </div>
        )}
      </div>
    </div>
  );
};
