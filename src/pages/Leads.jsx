import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { StatusBadge, SourceBadge, formatDate } from '../components/helpers';
import LeadModal from '../components/LeadModal';

const IcoPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcoSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcoEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IcoTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IcoEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

export default function Leads() {
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('');
  const [sort,    setSort]    = useState('desc');
  const [modal,   setModal]   = useState(null);  // null | 'add' | lead object
  const navigate = useNavigate();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      params.set('sort', sort);
      const { data } = await api.get(`/leads?${params}`);
      setLeads(data.leads);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }, [search, status, sort]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this lead? This action cannot be undone.')) return;
    await api.delete(`/leads/${id}`);
    setLeads(ls => ls.filter(l => l.id !== id));
  };

  const handleEdit = (e, lead) => {
    e.stopPropagation();
    setModal(lead);
  };

  const handleSaved = (saved) => {
    setModal(null);
    setLeads(ls => {
      const idx = ls.findIndex(l => l.id === saved.id);
      if (idx >= 0) { const copy = [...ls]; copy[idx] = saved; return copy; }
      return [saved, ...ls];
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Leads <span style={{color:'var(--gray-400)',fontWeight:400}}>({leads.length})</span></h2>
          <button className="btn btn-primary btn-sm" onClick={() => setModal('add')}>
            <IcoPlus /> Add Lead
          </button>
        </div>

        {/* Toolbar */}
        <div style={{padding:'16px 24px',borderBottom:'1px solid var(--gray-100)'}}>
          <div className="toolbar">
            <div className="search-wrap">
              <IcoSearch />
              <input
                className="search-input"
                placeholder="Search by name, email, company…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            <select className="select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="page-loader"><div className="spin-dark"></div> Loading leads…</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name / Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && (
                  <tr><td colSpan="7">
                    <div className="empty-state">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <h3>No leads found</h3>
                      <p>Try adjusting your search or filters</p>
                    </div>
                  </td></tr>
                )}
                {leads.map(l => (
                  <tr key={l.id} style={{cursor:'pointer'}} onClick={() => navigate(`/leads/${l.id}`)}>
                    <td>
                      <div className="lead-name">{l.name}</div>
                      <div className="lead-email">{l.email}</div>
                    </td>
                    <td style={{color:'var(--gray-500)',fontSize:'.82rem'}}>{l.phone || '—'}</td>
                    <td style={{color:'var(--gray-600)',fontSize:'.85rem'}}>{l.company || '—'}</td>
                    <td><SourceBadge source={l.source} /></td>
                    <td><StatusBadge status={l.status} /></td>
                    <td style={{color:'var(--gray-400)',fontSize:'.8rem'}}>{formatDate(l.created_at)}</td>
                    <td>
                      <div className="row-actions" onClick={e => e.stopPropagation()}>
                        <button className="action-btn" title="View" onClick={() => navigate(`/leads/${l.id}`)}><IcoEye /></button>
                        <button className="action-btn" title="Edit" onClick={e => handleEdit(e, l)}><IcoEdit /></button>
                        <button className="action-btn danger" title="Delete" onClick={e => handleDelete(e, l.id)}><IcoTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && leads.length > 0 && (
          <div className="table-footer">
            <span>{leads.length} lead{leads.length !== 1 ? 's' : ''} found</span>
          </div>
        )}
      </div>

      {modal && (
        <LeadModal
          lead={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
