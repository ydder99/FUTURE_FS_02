import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark">L</div>
          <div className="login-logo-text">Lead<span>Flow</span> CRM</div>
        </div>

        <h1 className="login-heading">Welcome back 👋</h1>
        <p className="login-sub">Sign in to your admin dashboard</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div>
            <label className="login-label">Email address</label>
            <input
              className="login-input"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="admin@leadflow.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>

        <p className="login-hint">
          Default credentials — email: <code>admin@leadflow.com</code> · password: <code>admin123</code>
        </p>
      </div>
    </div>
  );
}
