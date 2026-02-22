import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">Air Quality Monitor</div>
        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/realtime"
            className={`nav-link ${location.pathname === '/realtime' ? 'active' : ''}`}
          >
            <span className="live-indicator"></span> Realtime Alerts
          </Link>
          <Link
            to="/endpoint"
            className={`nav-link ${location.pathname === '/endpoint' ? 'active' : ''}`}
          >
            Alert History
          </Link>
        </nav>
      </aside>
      <main className="main-content">
        <header className="header">
          <h1 className="page-title">
            {location.pathname === '/' && 'Overview'}
            {location.pathname === '/realtime' && 'Live Air Quality Alerts'}
            {location.pathname === '/endpoint' && 'Historical Alerts Endpoint'}
          </h1>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
