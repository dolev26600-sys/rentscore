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

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(248,250,252,0.06)',
    border: '1px solid rgba(248,250,252,0.1)',
    borderRadius: 14, padding: '14px 16px',
    color: '#F8FAFC', fontSize: 15, fontFamily: 'inherit',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div dir="rtl" style={{
      minHeight: '100vh', background: '#18243A',
      fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflowX: 'hidden',
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Glows */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-100px', right:'-60px', width:380, height:380, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 65%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'10%', left:'-80px', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
      </div>

      {/* Back */}
      <div style={{ position:'relative', zIndex:1, padding:'48px 20px 0' }}>
        <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:'rgba(248,250,252,0.3)', fontFamily:'inherit', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          חזרה
        </button>
      </div>

      {/* Header */}
      <div style={{ position:'relative', zIndex:1, textAlign:'center', padding:'32px 24px 28px' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:28 }}>
          <div style={{ width:42, height:42, borderRadius:14, background:'linear-gradient(135deg,#F59E0B,#D97706)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(245,158,11,0.4)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18243A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <span style={{ color:'#F8FAFC', fontWeight:700, fontSize:22 }}>RentScore</span>
        </div>
        <h1 style={{ color:'#F8FAFC', fontSize:28, fontWeight:700, margin:'0 0 8px', letterSpacing:'-0.5px' }}>ברוך הבא בחזרה</h1>
        <p style={{ color:'rgba(248,250,252,0.35)', fontSize:14, margin:0 }}>התחבר לחשבון שלך</p>
      </div>

      {/* Form */}
      <div style={{ position:'relative', zIndex:1, flex:1, padding:'0 20px' }}>
        <div style={{ background:'rgba(248,250,252,0.04)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(248,250,252,0.08)', borderRadius:24, padding:24 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <label style={{ color:'rgba(248,250,252,0.45)', fontSize:12, fontWeight:600, display:'block', marginBottom:8, letterSpacing:'0.5px', textTransform:'uppercase' }}>דוא"ל</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                dir="ltr" style={inputStyle} />
            </div>

            <div style={{ marginBottom:24 }}>
              <label style={{ color:'rgba(248,250,252,0.45)', fontSize:12, fontWeight:600, display:'block', marginBottom:8, letterSpacing:'0.5px', textTransform:'uppercase' }}>סיסמה</label>
              <div style={{ position:'relative' }}>
                <input type={showPw ? 'text' : 'password'} placeholder="הזן סיסמה" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ ...inputStyle, paddingLeft: 48 }} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(248,250,252,0.3)', display:'flex' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width:'100%', background: loading ? 'rgba(245,158,11,0.5)' : 'linear-gradient(135deg,#F59E0B,#D97706)',
              border:'none', borderRadius:16, padding:'16px 24px',
              color:'#18243A', fontSize:16, fontWeight:700, fontFamily:'inherit',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow:'0 6px 24px rgba(245,158,11,0.35)',
            }}>
              {loading ? 'מתחבר...' : 'התחבר'}
            </button>
          </form>

          <div style={{ height:1, background:'rgba(248,250,252,0.07)', margin:'20px 0' }} />

          <p style={{ textAlign:'center', fontSize:14, color:'rgba(248,250,252,0.35)', margin:0 }}>
            אין לך חשבון?{' '}
            <Link to="/signup" style={{ color:'#F59E0B', fontWeight:700, textDecoration:'none' }}>הרשם חינם</Link>
          </p>

          <button onClick={() => navigate('/demo')} style={{
            width:'100%', marginTop:12, background:'rgba(248,250,252,0.04)',
            border:'1px solid rgba(248,250,252,0.07)', borderRadius:14, padding:'12px',
            color:'rgba(248,250,252,0.2)', fontSize:14, fontFamily:'inherit', cursor:'pointer',
          }}>
            צפה בדמו ←
          </button>
        </div>
      </div>
      <div style={{ height:48 }} />
    </div>
  );
}
