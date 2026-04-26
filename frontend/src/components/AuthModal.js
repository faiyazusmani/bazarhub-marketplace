import { useState } from 'react';
import { login, register } from '../api';
import { useAuth } from '../AuthContext';

export default function AuthModal({ onClose }) {
  const { loginUser } = useAuth();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleLogin = async () => {
    if (!form.email || !form.password) { setErr('All fields required'); return; }
    setLoading(true); setErr('');
    try {
      const res = await login({ email: form.email, password: form.password });
      loginUser(res.data.token, res.data.user);
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.phone || !form.password) { setErr('All fields required'); return; }
    if (form.password !== form.confirm) { setErr('Passwords do not match'); return; }
    if (form.password.length < 6) { setErr('Password must be at least 6 characters'); return; }
    setLoading(true); setErr('');
    try {
      const res = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      loginUser(res.data.token, res.data.user);
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || (e.response?.data?.errors?.[0]?.msg) || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Welcome to BazarHub</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="tab-bar">
            <div className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setErr(''); }}>Login</div>
            <div className={`tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setErr(''); }}>Register</div>
          </div>
          {err && <div className="alert alert-error">{err}</div>}
          {tab === 'login' ? (
            <>
              <div className="field">
                <label className="label label-req">Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
              <div className="field">
                <label className="label label-req">Password</label>
                <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={handleLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--muted)' }}>
                Don't have an account?{' '}
                <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }} onClick={() => setTab('register')}>Register here</span>
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label className="label label-req">Full Name</label>
                <input className="input" placeholder="Rahul Sharma" value={form.name} onChange={set('name')} />
              </div>
              <div className="row2">
                <div className="field">
                  <label className="label label-req">Email</label>
                  <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
                </div>
                <div className="field">
                  <label className="label label-req">Phone</label>
                  <input className="input" placeholder="9876543210" value={form.phone} onChange={set('phone')} />
                </div>
              </div>
              <div className="row2">
                <div className="field">
                  <label className="label label-req">Password</label>
                  <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} />
                </div>
                <div className="field">
                  <label className="label label-req">Confirm Password</label>
                  <input className="input" type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} />
                </div>
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={handleRegister} disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--muted)' }}>
                Already have an account?{' '}
                <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }} onClick={() => setTab('login')}>Login</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
