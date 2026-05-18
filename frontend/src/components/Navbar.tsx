import React from 'react';
import { NotificationCenter } from './NotificationCenter';
import '../styles/Navbar.css';

interface NavbarProps {
  currentPage: 'dashboard' | 'validator' | 'history' | 'import' | 'agent';
  onNavigate: (page: 'dashboard' | 'validator' | 'history' | 'import' | 'agent') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">💳</span>
          <span className="logo-text">FinTech Engine</span>
        </div>

        <div className="navbar-menu">
          <button
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            <span className="nav-icon">📊</span> Dashboard
          </button>
          <button
            className={`nav-link ${currentPage === 'validator' ? 'active' : ''}`}
            onClick={() => onNavigate('validator')}
          >
            <span className="nav-icon">✅</span> Validador
          </button>
          <button
            className={`nav-link ${currentPage === 'import' ? 'active' : ''}`}
            onClick={() => onNavigate('import')}
          >
            <span className="nav-icon">📁</span> Importar
          </button>
          <button
            className={`nav-link ${currentPage === 'agent' ? 'active' : ''}`}
            onClick={() => onNavigate('agent')}
          >
            <span className="nav-icon">🤖</span> Agent
          </button>
          <button
            className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
            onClick={() => onNavigate('history')}
          >
            <span className="nav-icon">📜</span> Histórico
          </button>
        </div>

        <div className="navbar-status">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">Online</span>
          </div>
          <NotificationCenter />
        </div>
      </div>
    </nav>
  );
};
