import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { StatusBadge, SourceBadge, formatDate } from '../components/helpers';
import LeadModal from '../components/LeadModal';

const IcoUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoNew = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const IcoPhone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default function Dashboard() {
  const [stats,  setStats]  = useState(null);
  const [leads,  setLeads]  = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    const [s, l] = await Promise.all([
      api.get('/leads/stats'),
      api.get('/leads?sort=desc'),
    ]);
    setStats(s.data.stats);
    setLeads(l.data.leads.slice(0, 8));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaved = () => { setShowModal(false); fetchData(); };

  const statsCards = stats ? [
    { label: 'Total Leads',  value: stats.total,     icon: <IcoUsers />, cls: 'blue'   },
    { label: 'New Leads',    value: stats.new_leads,  icon: <IcoNew />,   cls: 'indigo' },
    { label: 'Contacted',    value: stats.contacted,  icon: <IcoPhone />, cls: 'yellow' },
    { label: 'Converted',    value: stats.converted,  icon: <IcoCheck />, cls: 'green'  },
  ] : [];

  return (
    <>
      {/* Stats */}
      <div className="stats-grid">
        {statsCards.map(c => (
          <div className="stat-card" key={c.label}>
            <div className={`stat-icon ${c.cls === 'indigo' ? 'blue' : c.cls}`}>{c.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{c.value ?? '—'}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Leads</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <IcoPlus /> Add Lead
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Source</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr><td colSpan="4">
                  <div className="empty-state">
                    <h3>No leads yet</h3>
                    <p>Add your first lead to get started</p>
                  </div>
                </td></tr>
              )}
              {leads.map(l => (
                <tr key={l.id} style={{cursor:'pointer'}} onClick={() => navigate(`/leads/${l.id}`)}>
                  <td>
                    <div className="lead-name">{l.name}</div>
                    <div className="lead-email">{l.email}</div>
                  </td>
                  <td><SourceBadge source={l.source} /></td>
                  <td><StatusBadge status={l.status} /></td>
                  <td style={{color:'var(--gray-400)',fontSize:'.8rem'}}>{formatDate(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leads.length > 0 && (
          <div className="table-footer">
            <span>Showing {leads.length} most recent leads</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/leads')}>View all →</button>
          </div>
        )}
      </div>

      {showModal && <LeadModal onClose={() => setShowModal(false)} onSaved={handleSaved} />}
    </>
  );
}
