import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/NotificationCenter.css';

interface Notification {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'ERROR';
  title: string;
  message: string;
  recordId?: string;
  decision?: string;
  read: boolean;
}

interface NotificationStats {
  total: number;
  unread: number;
  critical: number;
  warning: number;
  error: number;
  info: number;
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'warning'>('all');
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    setRefreshInterval(interval);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const [notifRes, statsRes] = await Promise.all([
        axios.get('/api/notifications'),
        axios.get('/api/notifications/stats'),
      ]);

      setNotifications(notifRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await axios.post(`/api/notifications/${id}/read`);
      await loadNotifications();
    } catch (error) {
      console.error('Error marking notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.post('/api/notifications/read-all');
      await loadNotifications();
    } catch (error) {
      console.error('Error marking all notifications:', error);
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter((n) => !n.read);
      case 'critical':
        return notifications.filter((n) => n.severity === 'CRITICAL');
      case 'warning':
        return notifications.filter((n) => n.severity === 'WARNING');
      default:
        return notifications;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return '🚨';
      case 'ERROR':
        return '❌';
      case 'WARNING':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getSeverityClass = (severity: string) => {
    return `notification-${severity.toLowerCase()}`;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="notification-center">
      {/* Notification Bell */}
      <button
        className={`notification-bell ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="bell-icon">🔔</span>
        {stats && stats.unread > 0 && (
          <span className="notification-badge">{stats.unread}</span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notificações</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="notification-stats">
              <div className="stat-item">
                <span className="stat-label">Total</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-item critical">
                <span className="stat-label">🚨 Crítica</span>
                <span className="stat-value">{stats.critical}</span>
              </div>
              <div className="stat-item warning">
                <span className="stat-label">⚠️ Alerta</span>
                <span className="stat-value">{stats.warning}</span>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="notification-filters">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              className={`filter-button ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Não lidas
            </button>
            <button
              className={`filter-button ${filter === 'critical' ? 'active' : ''}`}
              onClick={() => setFilter('critical')}
            >
              Críticas
            </button>
            <button
              className={`filter-button ${filter === 'warning' ? 'active' : ''}`}
              onClick={() => setFilter('warning')}
            >
              Avisos
            </button>
          </div>

          {/* Notification List */}
          <div className="notification-list">
            {filteredNotifications.length === 0 ? (
              <div className="no-notifications">
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${getSeverityClass(notif.severity)} ${
                    !notif.read ? 'unread' : ''
                  }`}
                >
                  <div className="notification-content">
                    <div className="notification-title">
                      <span className="severity-icon">
                        {getSeverityIcon(notif.severity)}
                      </span>
                      <span className="title">{notif.title}</span>
                    </div>
                    <div className="notification-message">{notif.message}</div>
                    <div className="notification-meta">
                      <span className="timestamp">
                        {new Date(notif.timestamp).toLocaleTimeString('pt-BR')}
                      </span>
                      {notif.recordId && (
                        <span className="record-id">{notif.recordId}</span>
                      )}
                      {notif.decision && (
                        <span className={`decision-badge decision-${notif.decision.toLowerCase()}`}>
                          {notif.decision}
                        </span>
                      )}
                    </div>
                  </div>
                  {!notif.read && (
                    <button
                      className="mark-read-button"
                      onClick={() => handleMarkAsRead(notif.id)}
                      title="Marcar como lida"
                    >
                      ✓
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="notification-actions">
            {notifications.filter((n) => !n.read).length > 0 && (
              <button className="mark-all-button" onClick={handleMarkAllAsRead}>
                Marcar todas como lidas
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
