import React from 'react';
import { ValidationResult } from '../types/index';
import '../styles/ResultDisplay.css';

interface ResultDisplayProps {
  result: ValidationResult | null;
  loading: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, loading }) => {
  if (!result) {
    return null;
  }

  const isQuarentine = result.status === 'QUARENTENA';
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getSeverityIcon = (severity: string) => {
    const icons: { [key: string]: string } = {
      CRÍTICO: '🔴',
      ALTO: '🟠',
      MÉDIO: '🟡',
      BAIXO: '🟢',
      INFO: 'ℹ️',
    };
    return icons[severity] || '•';
  };

  return (
    <div className={`result-container ${isQuarentine ? 'quarantine' : 'approved'}`}>
      {/* Interface Box */}
      <div className="interface-box">
        <pre>{`╔════════════════════════════════════════════╗
║      FINTECH DATA QUALITY ENGINE v3.0      ║
║           MODO PRECISÃO MÁXIMA             ║
╠════════════════════════════════════════════╣
║ Status: [${result.status}] | Qualidade: ${result.qualityScore}%
║ Confiança: ${result.confidenceLevel}% | Alertas: ${result.alerts.length}
╚════════════════════════════════════════════╝`}</pre>
      </div>

      {/* Score Cards */}
      <div className="score-grid">
        <div className="score-card">
          <div className="score-label">Qualidade dos Dados</div>
          <div className="score-value" style={{ color: getScoreColor(result.qualityScore) }}>
            {result.qualityScore}%
          </div>
          <div className="score-bar">
            <div
              className="score-bar-fill"
              style={{
                width: `${result.qualityScore}%`,
                backgroundColor: getScoreColor(result.qualityScore),
              }}
            />
          </div>
        </div>

        <div className="score-card">
          <div className="score-label">Nível de Confiança</div>
          <div className="score-value" style={{ color: getScoreColor(result.confidenceLevel) }}>
            {result.confidenceLevel}%
          </div>
          <div className="score-bar">
            <div
              className="score-bar-fill"
              style={{
                width: `${result.confidenceLevel}%`,
                backgroundColor: getScoreColor(result.confidenceLevel),
              }}
            />
          </div>
        </div>

        <div className="score-card">
          <div className="score-label">Status</div>
          <div className={`status-label ${isQuarentine ? 'quarantine' : 'approved'}`}>
            {isQuarentine ? '🚨 QUARENTENA' : '✅ APROVADO'}
          </div>
        </div>

        <div className="score-card">
          <div className="score-label">Total de Alertas</div>
          <div className="score-value">{result.alerts.length}</div>
          <div className="alert-summary">
            {result.alerts.slice(0, 2).map((a, i) => (
              <span key={i} className={`alert-badge ${a.severity.toLowerCase()}`}>
                {a.severity}
              </span>
            ))}
            {result.alerts.length > 2 && (
              <span className="alert-more">+{result.alerts.length - 2}</span>
            )}
          </div>
        </div>
      </div>

      {/* Dados Corrigidos */}
      <div className="corrected-data">
        <h3>✏️ Dados Corrigidos</h3>
        <div className="data-grid">
          <div className="data-item">
            <label>Produto:</label>
            <span>{result.dado_corrigido.produto}</span>
          </div>
          <div className="data-item">
            <label>Categoria:</label>
            <span>{result.dado_corrigido.categoria}</span>
          </div>
          <div className="data-item">
            <label>Preço:</label>
            <span>R$ {result.dado_corrigido.preco.toFixed(2)}</span>
          </div>
          <div className="data-item">
            <label>Cidade:</label>
            <span>{result.dado_corrigido.cidade}</span>
          </div>
        </div>
      </div>

      {/* Detalhes das Alterações */}
      {result.motivo && (
        <div className="motivo-section">
          <h3>📝 Detalhes das Alterações</h3>
          <div className="motivo-text">
            {result.motivo.split(' | ').map((motivo, idx) => (
              <div key={idx} className="motivo-item">
                • {motivo}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alertas Detalhados */}
      {result.alerts.length > 0 && (
        <div className="alerts-section">
          <h3>
            ⚠️ Alertas Detectados ({result.alerts.length})
          </h3>
          <div className="alerts-list">
            {result.alerts.map((alert, idx) => (
              <div key={idx} className={`alert-item ${alert.severity.toLowerCase()}`}>
                <div className="alert-header">
                  <span className="alert-icon">{getSeverityIcon(alert.severity)}</span>
                  <span className="alert-severity">{alert.severity}</span>
                  <span className="alert-field">[{alert.field.toUpperCase()}]</span>
                </div>
                <div className="alert-message">{alert.message}</div>
                {alert.suggestion && (
                  <div className="alert-suggestion">💡 {alert.suggestion}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendações */}
      {result.recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>
            🎯 Recomendações
          </h3>
          <div className="recommendations-list">
            {result.recommendations.map((rec, idx) => (
              <div key={idx} className="recommendation-item">
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JSON View */}
      <details className="json-view">
        <summary>📋 Ver JSON Completo</summary>
        <div className="json-box">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      </details>
    </div>
  );
};
