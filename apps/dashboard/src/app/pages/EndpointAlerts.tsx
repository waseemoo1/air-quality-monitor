import { useEffect, useState } from 'react';
import { AirQualityAlert, getSeverityClass } from '../../types/alert';
import { apiService } from '../../services/api.service';

export function EndpointAlerts() {
  const [alerts, setAlerts] = useState<AirQualityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getRecentAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      setError('Unable to reach the telemetry backend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="fade-in">
      {/* HEADER SECTION */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h2
            style={{
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            Historical Alerts
            {/* The Live Data Badge */}
            <span className="live-data-badge">
              <span className="pulse-dot"></span>
              Live PostgreSQL Data
            </span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Retrieving the 20 most recent anomaly events from the NestJS REST
            API.
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="btn-refresh"
        >
          {loading ? (
            <>
              <svg
                className="spinner"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Syncing...
            </>
          ) : (
            'Refresh Data'
          )}
        </button>
      </div>

      {/* DATA SECTION */}
      <div className="alerts-container">
        {/* State 1: Error */}
        {error && !loading && (
          <div className="card error-state">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
            <h3>Connection Error</h3>
            <p>{error}</p>
            <button onClick={fetchAlerts} className="btn-retry">
              Try Again
            </button>
          </div>
        )}

        {/* State 2: Skeleton Loader */}
        {loading && alerts.length === 0 && (
          <div className="skeleton-container">
            {[...Array(5)].map((_, i) => (
              <div key={`skeleton-${i}`} className="alert-item skeleton-item">
                <div className="skeleton-left">
                  <div className="skeleton-line title"></div>
                  <div className="skeleton-line desc"></div>
                </div>
                <div className="skeleton-right">
                  <div className="skeleton-badge"></div>
                  <div className="skeleton-line time"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* State 3: Empty Data */}
        {!loading && !error && alerts.length === 0 && (
          <div className="card empty-state">
            <div
              style={{ fontSize: '2.5rem', opacity: 0.5, marginBottom: '1rem' }}
            >
              📭
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              No historical alerts found in the database.
            </p>
          </div>
        )}

        {/* State 4: Data Success */}
        {!loading &&
          !error &&
          alerts.map((alert) => {
            const severity = getSeverityClass(alert.category);
            // Create a robust unique key
            const uniqueKey = `${alert.city}-${alert.timestamp}`;

            return (
              <div
                key={uniqueKey}
                className={`alert-item ${severity} slide-up`}
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
                      month: 'short',
                      day: 'numeric',
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

export default EndpointAlerts;
