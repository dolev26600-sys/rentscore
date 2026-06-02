import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, hashPassword } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setUser } = useAuth();
  const isAgent = params.get('type') === 'agent';
  const refCode = params.get('ref') || '';
  const [userType, setUserType] = useState<'tenant' | 'landlord'>(
    params.get('type') === 'tenant' ? 'tenant' : 'landlord'
  );
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) return toast.error('נא למלא את כל השדות החובה');
    if (form.password.length < 6) return toast.error('סיסמה חייבת להיות לפחות 6 תווים');
    setLoading(true);
    try {
      const password_hash = await hashPassword(form.password);
      const { data, error } = await supabase.from('users')
        .insert({ full_name: form.full_name, email: form.email.toLowerCase().trim(), phone: form.phone.trim() || null, password_hash, user_type: userType, referred_by: refCode || null })
        .select().single();
      if (error) {
        if (error.code === '23505') toast.error('כתובת המייל כבר קיימת במערכת');
        else toast.error(`שגיאה ברישום: ${error.message}`);
        return;
      }
      setUser(data);
      toast.success('ברוך הבא ל-RentScore!');
      if (isAgent) { localStorage.setItem(`rentscore_agent_${data.id}`, '1'); navigate('/agent/home'); }
      else navigate(userType === 'tenant' ? '/tenant/onboarding' : '/landlord/onboarding');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box' as const,
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 14, padding: '14px 16px',
    color: '#fff', fontSize: 15, fontFamily: 'inherit',
    outline: 'none',
  };

  const labelStyle = {
    color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700,
    display: 'block', marginBottom: 8, letterSpacing: '0.5px',
  };

  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      background: '#18243A',
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

      {/* Brand */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '24px 24px 20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: 'linear-gradient(135deg,#00D4BA,#00A896)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,212,186,0.35)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 22, letterSpacing: '-0.5px' }}>RentScore</span>
        </div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          {isAgent ? 'הרשמה לסוכנים' : 'יצירת חשבון חינמי'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>
          {isAgent ? 'גישה למאגר שוכרים מאומתים' : 'פרופיל שוכר מקצועי תוך 2 דקות'}
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 1, flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Type selector */}
        {!isAgent && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {([
              { type: 'tenant' as const, label: 'שוכר', desc: 'חינם תמיד', emoji: '🏠' },
              { type: 'landlord' as const, label: 'בעל נכס', desc: '79₪/בדיקה', emoji: '🏢' },
            ]).map(({ type, label, desc, emoji }) => (
              <button key={type} onClick={() => setUserType(type)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '14px 12px', borderRadius: 18,
                border: userType === type ? '2px solid rgba(0,212,186,0.5)' : '1px solid rgba(255,255,255,0.1)',
                background: userType === type ? 'rgba(0,212,186,0.12)' : 'rgba(255,255,255,0.04)',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 22 }}>{emoji}</span>
                <span style={{ color: userType === type ? '#00D4BA' : 'rgba(255,255,255,0.7)', fontWeight: 900, fontSize: 14 }}>{label}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Form card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          padding: 24,
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>שם מלא</label>
                <input type="text" placeholder="ישראל ישראלי" value={form.full_name}
                  onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>דוא"ל</label>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  dir="ltr" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>טלפון (אופציונלי)</label>
                <input type="tel" placeholder="050-0000000" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>סיסמה</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} placeholder="לפחות 6 תווים"
                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    style={{ ...inputStyle, paddingLeft: 48 }} />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center',
                  }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', marginTop: 20,
              background: loading ? 'rgba(0,212,186,0.5)' : 'linear-gradient(135deg,#00D4BA 0%,#00A896 100%)',
              border: 'none', borderRadius: 16, padding: '16px 24px',
              color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 30px rgba(0,212,186,0.3)',
            }}>
              {loading ? 'נרשם...' : 'הרשמה חינמית'}
            </button>
          </form>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            כבר רשום?{' '}
            <Link to="/login" style={{ color: '#00D4BA', fontWeight: 700, textDecoration: 'none' }}>התחבר</Link>
          </p>
        </div>
      </div>

      <div style={{ height: 48 }} />
    </div>
  );
}
