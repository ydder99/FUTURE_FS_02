import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { StatusBadge, SourceBadge, formatDate, formatDateTime } from '../components/helpers';
import LeadModal from '../components/LeadModal';

/* ── Icons ── */
const IcoArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IcoEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IcoTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

function initials(name = '') {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

/* ── Note section ── */
function Notes({ leadId, notes: initial }) {
  const [notes, setNotes]   = useState(initial || []);
  const [text,  setText]    = useState('');
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!text.trim()) return;
    setSaving(true);
    const { data } = await api.post(`/leads/${leadId}/notes`, { content: text });
    setNotes(n => [data.note, ...n]);
    setText('');
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    await api.delete(`/notes/${id}`);
    setNotes(n => n.filter(x => x.id !== id));
  };

  return (
    <div className="card" style={{marginBottom:16}}>
      <div className="card-header"><h3 className="card-title">Notes</h3></div>
      <div className="card-body">
        <div className="note-form" style={{marginBottom:16}}>
          <textarea
            className="form-input"
            placeholder="Write a note…"
            value={text}
            onChange={e => setText(e.target.value)}
            style={{minHeight:70}}
          />
          <button className="btn btn-primary btn-sm" onClick={add} disabled={saving||!text.trim()}>
            {saving ? <span className="spinner"></span> : 'Add Note'}
          </button>
        </div>
        {notes.length === 0 && <p style={{color:'var(--gray-400)',fontSize:'.85rem',textAlign:'center',padding:'20px 0'}}>No notes yet. Add one above.</p>}
        {notes.map(n => (
          <div className="note-item" key={n.id}>
            <p className="note-text">{n.content}</p>
            <p className="note-time">{formatDateTime(n.created_at)}</p>
            <button className="action-btn danger note-del" onClick={() => remove(n.id)}><IcoTrash /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Follow-ups section ── */
function Followups({ leadId, followups: initial }) {
  const [followups, setFollowups] = useState(initial || []);
  const [form, setForm] = useState({ follow_up_at: '', reminder: '' });
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!form.follow_up_at) return;
    setSaving(true);
    const { data } = await api.post(`/leads/${leadId}/followups`, form);
    setFollowups(f => [...f, data.followup]);
    setForm({ follow_up_at: '', reminder: '' });
    setSaving(false);
  };

  const complete = async (id) => {
    await api.patch(`/followups/${id}/complete`);
    setFollowups(f => f.map(x => x.id === id ? { ...x, completed: 1 } : x));
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this follow-up?')) return;
    await api.delete(`/followups/${id}`);
    setFollowups(f => f.filter(x => x.id !== id));
  };

  return (
    <div className="card">
      <div className="card-header"><h3 className="card-title">Follow-ups</h3></div>
      <div className="card-body">
        <div className="form-grid" style={{marginBottom:16}}>
          <div className="form-group">
            <label className="form-label">Date & Time</label>
            <input className="form-input" type="datetime-local" value={form.follow_up_at}
              onChange={e => setForm(f => ({ ...f, follow_up_at: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Reminder note</label>
            <input className="form-input" placeholder="Call to discuss proposal…" value={form.reminder}
              onChange={e => setForm(f => ({ ...f, reminder: e.target.value }))} />
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={add} disabled={saving||!form.follow_up_at} style={{marginBottom:16}}>
          {saving ? <span className="spinner"></span> : 'Schedule Follow-up'}
        </button>

        {followups.length === 0 && <p style={{color:'var(--gray-400)',fontSize:'.85rem',textAlign:'center',padding:'10px 0'}}>No follow-ups scheduled.</p>}
        {followups.map(f => (
          <div className={`followup-item${f.completed ? ' done' : ''}`} key={f.id}>
            <div
              className={`followup-check${f.completed ? ' done' : ''}`}
              onClick={() => !f.completed && complete(f.id)}
              title={f.completed ? 'Completed' : 'Mark as done'}
            >
              {f.completed && <IcoCheck />}
            </div>
            <div className="followup-info">
              <div className="followup-time">{formatDateTime(f.follow_up_at)}</div>
              {f.reminder && <div className="followup-reminder">{f.reminder}</div>}
            </div>
            <button className="action-btn danger" onClick={() => remove(f.id)}><IcoTrash /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data,    setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: d } = await api.get(`/leads/${id}`);
      setData(d);
    } catch { navigate('/leads'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [id]);

  const handleSaved = (saved) => {
    setData(d => ({ ...d, lead: saved }));
    setEditing(false);
  };

  if (loading) return <div className="page-loader"><div className="spin-dark"></div> Loading…</div>;
  if (!data)   return null;

  const { lead, notes, followups } = data;

  return (
    <>
      <button className="back-link" onClick={() => navigate(-1)}><IcoArrow /> Back to leads</button>

      <div className="detail-layout">
        {/* Left column */}
        <div>
          {/* Hero */}
          <div className="card" style={{marginBottom:16}}>
            <div className="card-body">
              <div className="detail-hero">
                <div className="detail-avatar">{initials(lead.name)}</div>
                <div>
                  <div className="detail-name">{lead.name}</div>
                  <div className="detail-meta">{lead.email}{lead.company ? ` · ${lead.company}` : ''}</div>
                </div>
                <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
                  <StatusBadge status={lead.status} />
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}><IcoEdit /> Edit</button>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item"><div className="info-label">Email</div><div className="info-value" style={{fontFamily:'var(--font-mono)',fontSize:'.82rem'}}>{lead.email}</div></div>
                <div className="info-item"><div className="info-label">Phone</div><div className="info-value">{lead.phone || '—'}</div></div>
                <div className="info-item"><div className="info-label">Company</div><div className="info-value">{lead.company || '—'}</div></div>
                <div className="info-item"><div className="info-label">Source</div><div className="info-value"><SourceBadge source={lead.source} /></div></div>
                <div className="info-item"><div className="info-label">Status</div><div className="info-value"><StatusBadge status={lead.status} /></div></div>
                <div className="info-item"><div className="info-label">Added</div><div className="info-value">{formatDate(lead.created_at)}</div></div>
              </div>

              {lead.message && (
                <div style={{marginTop:16,padding:'14px',background:'var(--gray-50)',borderRadius:'var(--radius)',border:'1px solid var(--gray-100)'}}>
                  <div className="info-label" style={{marginBottom:6}}>Original Message</div>
                  <p style={{fontSize:'.875rem',color:'var(--gray-700)',whiteSpace:'pre-wrap'}}>{lead.message}</p>
                </div>
              )}
            </div>
          </div>

          <Notes leadId={id} notes={notes} />
        </div>

        {/* Right column */}
        <div>
          <Followups leadId={id} followups={followups} />
        </div>
      </div>

      {editing && <LeadModal lead={lead} onClose={() => setEditing(false)} onSaved={handleSaved} />}
    </>
  );
}
