import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const TITLES = {
  '/':      { title: 'Dashboard',   sub: 'Overview' },
  '/leads': { title: 'Leads',       sub: 'Manage your pipeline' },
};

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { title, sub } = TITLES[location.pathname] || { title: 'LeadFlow', sub: '' };

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <header className="topbar">
          <button className="menu-toggle btn-ghost btn btn-icon" onClick={() => setSidebarOpen(s => !s)}>
            <MenuIcon />
          </button>
          <div className="topbar-title">
            {title} {sub && <span className="topbar-sub">/ {sub}</span>}
          </div>
        </header>
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
