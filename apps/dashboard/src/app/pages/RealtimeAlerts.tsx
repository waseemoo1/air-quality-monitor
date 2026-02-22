import { useEffect, useState } from 'react';
import { AirQualityAlert, getSeverityClass } from '../../types/alert';
import { socketService } from '../../services/socket.service';

export function RealtimeAlerts() {
  const [alerts, setAlerts] = useState<AirQualityAlert[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // 1. Establish connection
    socketService.connect();

    // 2. Setup lifecycle listeners
    socketService.onConnect(() => setConnected(true));
    socketService.onDisconnect(() => setConnected(false));

    // 3. Setup data listener
    const handleNewAlert = (newAlert: AirQualityAlert) => {
      setAlerts((prev) => [newAlert, ...prev].slice(0, 50)); // Keep last 50
    };

    socketService.onNewAlert(handleNewAlert);

    // 4. Cleanup on unmount
    return () => {
      socketService.offNewAlert(handleNewAlert);
      socketService.disconnect();
    };
  }, []);

  return (
    <div className="fade-in">
      {/* HEADER SECTION */}
      <div className="card status-header" style={{ marginBottom: '2rem' }}>
        <div className="header-content">
          <h2
            style={{
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            Real-Time Anomaly Stream
            <span
              className={`live-data-badge ${connected ? 'active' : 'offline'}`}
            >
              <span
                className={`pulse-dot ${connected ? 'green' : 'red'}`}
              ></span>
              {connected ? 'Live Socket.IO Stream' : 'Connection Lost'}
            </span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Listening for critical air quality events pushed instantly from the
            NestJS microservices via WebSockets.
          </p>
        </div>

        {/* Connection Status Indicator */}
        <div
          className={`connection-status ${connected ? 'status-connected' : 'status-disconnected'}`}
        >
          <div className="status-icon">{connected ? '📡' : '🔌'}</div>
          <div className="status-text">
            <strong>{connected ? 'Connected' : 'Disconnected'}</strong>
            <span>
              {connected
                ? 'Awaiting telemetry...'
                : 'Attempting to reconnect...'}
            </span>
          </div>
        </div>
      </div>

      {/* DATA SECTION */}
      <div className="alerts-container">
        {/* State 1: Disconnected / Error */}
        {!connected && alerts.length === 0 && (
          <div className="card error-state">
            <div
              className="pulse-dot red"
              style={{ width: '20px', height: '20px', marginBottom: '1rem' }}
            ></div>
            <h3>Socket Disconnected</h3>
            <p>
              Unable to reach the live telemetry server. Retrying
              automatically...
            </p>
          </div>
        )}

        {/* State 2: Connected but Waiting (The "Radar" State) */}
        {connected && alerts.length === 0 && (
          <div className="card empty-state scanning-state">
            <div className="radar-spinner"></div>
            <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              System Nominal
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Actively monitoring sensor network. No critical anomalies detected
              yet.
            </p>
          </div>
        )}

        {/* State 3: Incoming Data Success */}
        {alerts.map((alert, index) => {
          const severity = getSeverityClass(alert.category);
          // Create a robust unique key using the payload data + index to handle rapid-fire duplicates safely
          const uniqueKey = `${alert.city}-${alert.timestamp}-${index}`;

          return (
            // Use slide-down since new items are prepended to the top of the list!
            <div
              key={uniqueKey}
              className={`alert-item ${severity} slide-down`}
            >
              <div>
                <div className="alert-title">
                  {alert.city}{' '}
                  <span style={{ opacity: 0.5, fontWeight: 'normal' }}>
                    — {alert.category}
                  </span>
                </div>
                <div className="alert-desc" style={{ marginTop: '0.25rem' }}>
                  <strong>AQI Score:</strong> {alert.aqi}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${severity}`}>{severity}</span>
                <div
                  className="alert-time"
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {new Date(alert.timestamp).toLocaleString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RealtimeAlerts;
