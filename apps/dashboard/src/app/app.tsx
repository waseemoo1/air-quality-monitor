import { Route, Routes, Link } from 'react-router-dom';
import Layout from './components/Layout';
import RealtimeAlerts from './pages/RealtimeAlerts';
import EndpointAlerts from './pages/EndpointAlerts';

function DashboardHome() {
  return (
    <div className="fade-in">
      {/* 🌟 Welcome & Disclaimer Banner */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          background:
            'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.15)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ flex: '1 1 400px' }}>
            <h1
              style={{
                fontSize: '1.75rem',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              System Overview
              <span className="demo-data-badge">
                <span className="pulse-dot orange"></span>
                Static Demo Data
              </span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Welcome to the Air Quality Monitor. The high-level statistics
              below are <strong>static UI placeholders</strong> designed to
              demonstrate the dashboard layout.
              <br />
              <br />
              To see the actual event-driven microservices in action, please
              navigate to the live data views.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/realtime" className="btn-primary">
              <span style={{ marginRight: '0.5rem' }}>📡</span> Live Stream
            </Link>
            <Link to="/endpoint" className="btn-secondary">
              <span style={{ marginRight: '0.5rem' }}>💾</span> DB History
            </Link>
          </div>
        </div>
      </div>

      {/* 📊 The Static Stat Grid */}
      <h3
        style={{
          marginBottom: '1rem',
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          fontWeight: 500,
        }}
      >
        Simulated Network Status
      </h3>
      <div className="dashboard-grid">
        <div className="card stat-card">
          <span className="stat-title">Air Quality Index</span>
          <span
            className="stat-value"
            style={{ color: 'var(--success-color)' }}
          >
            42 AQI
          </span>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginTop: '0.5rem',
            }}
          >
            Good condition <span style={{ opacity: 0.5 }}>(Simulated)</span>
          </p>
        </div>

        <div className="card stat-card">
          <span className="stat-title">Active Sensors</span>
          <span className="stat-value">124</span>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginTop: '0.5rem',
            }}
          >
            3 offline <span style={{ opacity: 0.5 }}>(Simulated)</span>
          </p>
        </div>

        <div className="card stat-card">
          <span className="stat-title">Critical Alerts (24h)</span>
          <span
            className="stat-value"
            style={{ color: 'var(--warning-color)' }}
          >
            5
          </span>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginTop: '0.5rem',
            }}
          >
            Down 20% from yesterday{' '}
            <span style={{ opacity: 0.5 }}>(Simulated)</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/realtime" element={<RealtimeAlerts />} />
        <Route path="/endpoint" element={<EndpointAlerts />} />
      </Routes>
    </Layout>
  );
}

export default App;
