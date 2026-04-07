import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/IntegratedDashboard.css';

interface SystemMetrics {
  validations: number;
  imports: number;
  agentDecisions: number;
  historicalRecords: number;
  lastActivityTime: string;
}

interface ModuleStatus {
  validator: { status: 'ready' | 'processing' | 'idle'; lastActivity?: string };
  importer: { status: 'ready' | 'processing' | 'idle'; lastActivity?: string };
  agent: { status: 'ready' | 'processing' | 'idle'; lastActivity?: string };
  history: { status: 'ready' | 'idle'; recordCount?: number };
}

export const IntegratedDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    validations: 0,
    imports: 0,
    agentDecisions: 0,
    historicalRecords: 0,
    lastActivityTime: new Date().toISOString(),
  });

  const [moduleStatus, setModuleStatus] = useState<ModuleStatus>({
    validator: { status: 'idle' },
    importer: { status: 'idle' },
    agent: { status: 'idle' },
    history: { status: 'idle' },
  });

  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState<'full' | 'agent' | 'validator'>('full');
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    loadSystemMetrics();
    checkDemoStatus();
    const interval = setInterval(() => {
      loadSystemMetrics();
      checkDemoStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemMetrics = async () => {
    try {
      // Carrega métricas do agent
      const agentMetrics = await axios.get('/api/agent/metrics');
      const agentHistory = await axios.get('/api/agent/history/persisted?limit=1');
      
      setMetrics((prev) => ({
        ...prev,
        validations: agentMetrics.data.totalProcessed || 0,
        agentDecisions: agentMetrics.data.totalProcessed || 0,
        historicalRecords: agentHistory.data?.length || 0,
        lastActivityTime: new Date().toISOString(),
      }));

      setLoading(false);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const checkDemoStatus = async () => {
    try {
      const response = await axios.get('/api/demo/status');
      setDemoRunning(response.data.isRunning);
    } catch (error) {
      console.error('Error checking demo status:', error);
    }
  };

  const startDemo = async () => {
    try {
      setDemoLoading(true);
      await axios.post('/api/demo/start');
      setDemoRunning(true);
      // Atualiza métricas mais frequentemente durante o demo
      loadSystemMetrics();
      const fastInterval = setInterval(() => {
        loadSystemMetrics();
      }, 2000);
      setTimeout(() => clearInterval(fastInterval), 300000); // Para nach 5 mins
    } catch (error) {
      console.error('Error starting demo:', error);
    } finally {
      setDemoLoading(false);
    }
  };

  const stopDemo = async () => {
    try {
      setDemoLoading(true);
      await axios.post('/api/demo/stop');
      setDemoRunning(false);
    } catch (error) {
      console.error('Error stopping demo:', error);
    } finally {
      setDemoLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return '#10b981';
      case 'processing':
        return '#f59e0b';
      case 'idle':
        return '#9ca3af';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ready':
        return '🟢 Pronto';
      case 'processing':
        return '🟡 Processando';
      case 'idle':
        return '⚪ Inativo';
      default:
        return '⚫ Desconhecido';
    }
  };

  return (
    <div className="integrated-dashboard">
      <div className="dashboard-header">
        <h1>🏗️ Visão Integrada do Sistema</h1>
        <p>Fluxo completo: Importar → Validar → Agent Autônomo → Histórico</p>
      </div>

      {/* Flow Selection */}
      <div className="flow-selector">
        <button
          className={`flow-btn ${selectedFlow === 'full' ? 'active' : ''}`}
          onClick={() => setSelectedFlow('full')}
        >
          📊 Fluxo Completo
        </button>
        <button
          className={`flow-btn ${selectedFlow === 'validator' ? 'active' : ''}`}
          onClick={() => setSelectedFlow('validator')}
        >
          ✅ Validator
        </button>
        <button
          className={`flow-btn ${selectedFlow === 'agent' ? 'active' : ''}`}
          onClick={() => setSelectedFlow('agent')}
        >
          🤖 Agent
        </button>
      </div>

      {/* System Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📤</span>
            <h3>Importações</h3>
          </div>
          <div className="metric-value">{metrics.imports}</div>
          <div className="metric-status">Total de arquivos importados</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">✅</span>
            <h3>Validações</h3>
          </div>
          <div className="metric-value">{metrics.validations}</div>
          <div className="metric-status">Registros validados</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">🤖</span>
            <h3>Decisões do Agent</h3>
          </div>
          <div className="metric-value">{metrics.agentDecisions}</div>
          <div className="metric-status">Decisões autônomas tomadas</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📚</span>
            <h3>Histórico</h3>
          </div>
          <div className="metric-value">{metrics.historicalRecords}</div>
          <div className="metric-status">Registros armazenados</div>
        </div>
      </div>

      {/* Module Status */}
      <div className="modules-section">
        <h2>📡 Status dos Módulos</h2>
        <div className="modules-grid">
          <div className="module-card">
            <div className="module-header">
              <span className="module-name">📥 Importer</span>
              <span
                className="module-status-indicator"
                style={{ backgroundColor: getStatusColor(moduleStatus.importer.status) }}
              >
                {getStatusLabel(moduleStatus.importer.status)}
              </span>
            </div>
            <div className="module-description">Importar dados de arquivos</div>
            <div className="module-action">
              <button className="action-link">→ Ir para Importador</button>
            </div>
          </div>

          <div className="module-card">
            <div className="module-header">
              <span className="module-name">✅ Validator</span>
              <span
                className="module-status-indicator"
                style={{ backgroundColor: getStatusColor(moduleStatus.validator.status) }}
              >
                {getStatusLabel(moduleStatus.validator.status)}
              </span>
            </div>
            <div className="module-description">Validar registros importados</div>
            <div className="module-action">
              <button className="action-link">→ Ir para Validador</button>
            </div>
          </div>

          <div className="module-card">
            <div className="module-header">
              <span className="module-name">🤖 Agent</span>
              <span
                className="module-status-indicator"
                style={{ backgroundColor: getStatusColor(moduleStatus.agent.status) }}
              >
                {getStatusLabel(moduleStatus.agent.status)}
              </span>
            </div>
            <div className="module-description">Decisões autônomas em tempo real</div>
            <div className="module-action">
              <button className="action-link">→ Ir para Agent</button>
            </div>
          </div>

          <div className="module-card">
            <div className="module-header">
              <span className="module-name">📚 History</span>
              <span
                className="module-status-indicator"
                style={{ backgroundColor: getStatusColor(moduleStatus.history.status) }}
              >
                {getStatusLabel(moduleStatus.history.status)}
              </span>
            </div>
            <div className="module-description">Histórico de validações e decisões</div>
            <div className="module-action">
              <button className="action-link">→ Ir para Histórico</button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Flow Visualization */}
      <div className="flow-visualization">
        <h2>📊 Fluxo de Dados em Tempo Real</h2>
        <div className="flow-diagram">
          <div className="flow-step">
            <div className="flow-icon">📤</div>
            <div className="flow-label">Importar</div>
            <div className="flow-desc">{metrics.imports} arquivos</div>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-step">
            <div className="flow-icon">✅</div>
            <div className="flow-label">Validar</div>
            <div className="flow-desc">{metrics.validations} registros</div>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-step">
            <div className="flow-icon">🤖</div>
            <div className="flow-label">Agent</div>
            <div className="flow-desc">{metrics.agentDecisions} decisões</div>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-step">
            <div className="flow-icon">📚</div>
            <div className="flow-label">Histórico</div>
            <div className="flow-desc">{metrics.historicalRecords} logs</div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="health-section">
        <h2>💚 Saúde do Sistema</h2>
        <div className="health-cards">
          <div className="health-item">
            <span className="health-label">Backend API</span>
            <span className="health-status healthy">🟢 Online</span>
          </div>
          <div className="health-item">
            <span className="health-label">Persistência</span>
            <span className="health-status healthy">🟢 JSON Ativa</span>
          </div>
          <div className="health-item">
            <span className="health-label">Agent Scheduler</span>
            <span className="health-status healthy">🟢 Executando</span>
          </div>
          <div className="health-item">
            <span className="health-label">Notificações</span>
            <span className="health-status healthy">🟢 Ativas</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>⚡ Ações Rápidas</h2>
        <div className="actions-grid">
          <button className="quick-action">Importar Novo Arquivo</button>
          <button className="quick-action">Validar Todos</button>
          <button className="quick-action">Processar com Agent</button>
          <button className="quick-action">Ver Histórico Completo</button>
          <button className="quick-action">Exportar Relatório</button>
          <button className="quick-action">Configurar Agent</button>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="demo-section">
        <h2>🎬 Modo Demonstração</h2>
        <div className="demo-container">
          <div className="demo-info">
            <p>Inicie o modo demonstração para gerar dados contínuos e visualizar o sistema em ação completa.</p>
            <p>Status: <strong>{demoRunning ? '🟢 ATIVO' : '⚫ INATIVO'}</strong></p>
          </div>
          <div className="demo-controls">
            {!demoRunning ? (
              <button 
                className="demo-btn start-btn" 
                onClick={startDemo}
                disabled={demoLoading}
              >
                {demoLoading ? '⏳ Iniciando...' : '▶️ Iniciar Demo'}
              </button>
            ) : (
              <button 
                className="demo-btn stop-btn" 
                onClick={stopDemo}
                disabled={demoLoading}
              >
                {demoLoading ? '⏳ Parando...' : '⏹️ Parar Demo'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Last Update */}
      <div className="last-update">
        Última atualização: {new Date(metrics.lastActivityTime).toLocaleTimeString('pt-BR')}
      </div>
    </div>
  );
};
