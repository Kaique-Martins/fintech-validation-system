import React, { useState } from 'react';
import { ValidationHistory } from '../types/index';
import '../styles/History.css';

interface HistoryProps {
  validations: ValidationHistory[];
}

export const History: React.FC<HistoryProps> = ({ validations }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'quarantine'>('all');

  const filtered = validations.filter((v) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'approved') return v.status === 'APROVADO';
    if (filterStatus === 'quarantine') return v.status === 'QUARENTENA';
    return true;
  });

  return (
    <div className="history">
      <div className="history-header">
        <h1>📜 Histórico de Validações</h1>
        <p>Todos os registros validados pelo sistema</p>
      </div>

      <div className="history-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Todos ({validations.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('approved')}
          >
            ✅ Aprovados ({validations.filter((v) => v.status === 'APROVADO').length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'quarantine' ? 'active' : ''}`}
            onClick={() => setFilterStatus('quarantine')}
          >
            🚨 Quarentena ({validations.filter((v) => v.status === 'QUARENTENA').length})
          </button>
        </div>
        <div className="history-info">
          <span className="total">Total: {filtered.length} registros</span>
        </div>
      </div>

      <div className="history-table">
        {filtered.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Cidade</th>
                <th>Status</th>
                <th>Data/Hora</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((validation) => (
                <tr key={validation.id} className={`status-${validation.status.toLowerCase()}`}>
                  <td className="product-cell">
                    <span className="product-name">{validation.input.produto}</span>
                  </td>
                  <td>{validation.dado_corrigido.categoria}</td>
                  <td className="price-cell">R$ {validation.dado_corrigido.preco.toFixed(2)}</td>
                  <td>{validation.dado_corrigido.cidade}</td>
                  <td>
                    <span className={`status-badge ${validation.status.toLowerCase()}`}>
                      {validation.status === 'APROVADO' ? '✅ APROVADO' : '🚨 QUARENTENA'}
                    </span>
                  </td>
                  <td className="date-cell">{new Date(validation.timestamp).toLocaleString('pt-BR')}</td>
                  <td>
                    {validation.motivo && (
                      <div className="details-tooltip" title={validation.motivo}>
                        ℹ️
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>Nenhuma validação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};
