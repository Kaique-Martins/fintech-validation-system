import React from 'react';
import { DashboardStats, ValidationHistory } from '../types/index';
import '../styles/Dashboard.css';

interface DashboardProps {
  stats: DashboardStats;
  recentValidations: ValidationHistory[];
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, recentValidations }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard de Validações</h1>
        <p>Acompanhe o desempenho do seu sistema de validação em tempo real</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            📈
          </div>
          <div className="stat-content">
            <h3>Total de Validações</h3>
            <p className="stat-value">{stats.totalValidations}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            ✅
          </div>
          <div className="stat-content">
            <h3>Aprovados</h3>
            <p className="stat-value">{stats.approved}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            ⚠️
          </div>
          <div className="stat-content">
            <h3>Quarentena</h3>
            <p className="stat-value">{stats.quarantine}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
            📊
          </div>
          <div className="stat-content">
            <h3>Taxa de Aprovação</h3>
            <p className="stat-value">{stats.approvalRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="recent-validations">
        <h2>📜 Validações Recentes</h2>
        {recentValidations.length > 0 ? (
          <div className="validations-list">
            {recentValidations.slice(0, 5).map((validation) => (
              <div key={validation.id} className={`validation-item ${validation.status.toLowerCase()}`}>
                <div className="validation-header">
                  <span className="validation-product">{validation.input.produto}</span>
                  <span className={`validation-status ${validation.status.toLowerCase()}`}>
                    {validation.status === 'APROVADO' ? '✅ APROVADO' : '🚨 QUARENTENA'}
                  </span>
                </div>
                <div className="validation-details">
                  <span>Categoria: {validation.dado_corrigido.categoria}</span>
                  <span>Preço: R$ {validation.dado_corrigido.preco.toFixed(2)}</span>
                  <span>Cidade: {validation.dado_corrigido.cidade}</span>
                </div>
                <div className="validation-time">{new Date(validation.timestamp).toLocaleString('pt-BR')}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Nenhuma validação realizada ainda</p>
            <small>Comece a usar o validador para ver o histórico aqui</small>
          </div>
        )}
      </div>
    </div>
  );
};
