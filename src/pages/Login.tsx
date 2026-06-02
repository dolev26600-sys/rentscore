import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, hashPassword } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('נא למלא את כל השדות');
    setLoading(true);
    try {
      const password_hash = await hashPassword(form.password);
      const { data, error } = await supabase
        .from('users').select()
        .eq('email', form.email.toLowerCase().trim())
        .eq('password_hash', password_hash)
        .single();
      if (error || !data) { toast.error('אימייל או סיסמה שגויים'); return; }
      setUser(data);
      toast.success(`שלום, ${data.full_name}!`);
      const agentFlag = localStorage.getItem(`rentscore_agent_${data.id}`);
      if (data.user_type === 'tenant') navigate('/tenant/home');
      else if (agentFlag) navigate('/agent/home');
      else navigate('/landlord/home');
    } finally { setLoading(false); }
  };

  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      background: '#07080F',
      fontFamily: "'Heebo', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Ambient glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,186,0.1) 0%, transparent 65%)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-80px', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,63,255,0.08) 0%, transparent 65%)', filter: 'blur(30px)' }} />
      </div>

      {/* Back button */}
      <div style={{ position: 'relative', zIndex: 1, padding: '48px 20px 0' }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
          fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          חזרה
        </button>
      </div>

      {/* Brand header */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '32px 24px 24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: 'linear-gradient(135deg,#00D4BA,#00A896)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,212,186,0.35)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 22, letterSpacing: '-0.5px' }}>RentScore</span>
        </div>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, margin: '0 0 8px', letterSpacing: '-0.5px' }}>ברוך הבא בחזרה</h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: 0 }}>התחבר לחשבון שלך</p>
      </div>

      {/* Form card */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, padding: '0 20px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          padding: 24,
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: '0.5px' }}>דוא"ל</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                dir="ltr"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 14, padding: '14px 16px',
                  color: '#fff', fontSize: 15, fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: '0.5px' }}>סיסמה</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="הזן סיסמה"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 14, padding: '14px 16px', paddingLeft: 48,
                    color: '#fff', fontSize: 15, fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center',
                }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: loading ? 'rgba(0,212,186,0.5)' : 'linear-gradient(135deg,#00D4BA 0%,#00A896 100%)',
              border: 'none', borderRadius: 16, padding: '16px 24px',
              color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 30px rgba(0,212,186,0.3)',
              transition: 'all 0.2s',
            }}>
              {loading ? 'מתחבר...' : 'התחבר'}
            </button>
          </form>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            אין לך חשבון?{' '}
            <Link to="/signup" style={{ color: '#00D4BA', fontWeight: 700, textDecoration: 'none' }}>הרשם חינם</Link>
          </p>

          <button onClick={() => navigate('/demo')} style={{
            width: '100%', marginTop: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '12px 24px',
            color: 'rgba(255,255,255,0.25)', fontSize: 14,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>
            צפה בדמו ללא הרשמה ←
          </button>
        </div>
      </div>

      <div style={{ height: 48 }} />
    </div>
  );
}
