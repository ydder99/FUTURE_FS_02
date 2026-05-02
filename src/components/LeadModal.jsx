import { useState, useEffect } from 'react';
import api from '../api/axios';

const SOURCES   = ['website','referral','social','email','other'];
const STATUSES  = ['new','contacted','converted','lost'];

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const empty = { name:'', email:'', phone:'', company:'', source:'website', status:'new', message:'' };

export default function LeadModal({ lead, onClose, onSaved }) {
  const [form,  setForm]    = useState(lead ? { ...lead } : { ...empty });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  useEffect(() => { setForm(lead ? { ...lead } : { ...empty }); }, [lead]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.'); return;
    }
    setSaving(true); setError('');
    try {
      let saved;
      if (lead?.id) {
        const { data } = await api.put(`/leads/${lead.id}`, form);
        saved = data.lead;
      } else {
        const { data } = await api.post('/leads', form);
        saved = data.lead;
      }
      onSaved(saved);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lead');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{lead?.id ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="modal-body">
          {error && <div className="error-msg" style={{marginBottom:14}}>{error}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+1 555 000 0000" />
            </div>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="form-input" value={form.company || ''} onChange={e => set('company', e.target.value)} placeholder="Acme Inc." />
            </div>
            <div className="form-group">
              <label className="form-label">Source</label>
              <select className="form-input select" value={form.source} onChange={e => set('source', e.target.value)}>
                {SOURCES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input select" value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group span-2">
              <label className="form-label">Message / Notes</label>
              <textarea className="form-input" value={form.message || ''} onChange={e => set('message', e.target.value)} placeholder="Initial message from contact form…" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? <span className="spinner"></span> : null}
            {lead?.id ? 'Save Changes' : 'Add Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}
