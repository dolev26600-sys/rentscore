import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';

interface Profile { score: number; income_verified: boolean; years_renting: number; }

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 85 ? '#22C55E' : score >= 70 ? '#F59E0B' : score >= 55 ? '#F59E0B' : '#6B7280';
  return (
    <div style={{ position:'relative', width:120, height:120, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform:'rotate(-90deg)', position:'absolute' }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8"/>
        <circle cx="60" cy="60" r={r} fill="none" stroke="url(#rg)" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}/>
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B"/>
            <stop offset="100%" stopColor="#8B5CF6"/>
          </linearGradient>
        </defs>
      </svg>
      <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{ color:'#F8FAFC', fontSize:36, fontWeight:700, lineHeight:1, letterSpacing:'-1px' }}>{score}</div>
        <div style={{ color:'rgba(248,250,252,0.3)', fontSize:10, fontWeight:500, marginTop:2, letterSpacing:'0.5px' }}>SCORE</div>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 85) return <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:'rgba(34,197,94,0.15)', color:'#22C55E', border:'1px solid rgba(34,197,94,0.25)' }}>מצוין</span>;
  if (score >= 70) return <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:'rgba(245,158,11,0.15)', color:'#F59E0B', border:'1px solid rgba(245,158,11,0.25)' }}>טוב מאוד</span>;
  if (score >= 55) return <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:'rgba(245,158,11,0.1)', color:'#FBBF24', border:'1px solid rgba(245,158,11,0.2)' }}>טוב</span>;
  return <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:'rgba(107,114,128,0.15)', color:'#9CA3AF', border:'1px solid rgba(107,114,128,0.2)' }}>בסיסי</span>;
}

export default function TenantHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recCount, setRecCount] = useState(0);
  const [verifiedRecs, setVerifiedRecs] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from('tenant_profiles').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data); else navigate('/tenant/onboarding'); });
    supabase.from('recommendations').select('id,verified').eq('tenant_id', user.id)
      .then(({ data }) => {
        setRecCount(data?.length || 0);
        setVerifiedRecs(data?.filter((r: any) => r.verified).length || 0);
      });
  }, [user]);

  const score = profile?.score || 50;
  const firstName = user?.full_name?.split(' ')[0] || '';

  const tasks = [
    { label:'בקש המלצה מאומתת מבעל נכס קודם', pts:5, done: recCount > 0, path:'/tenant/request-rec' },
    { label:'השלם את פרטי הפרופיל שלך', pts:4, done: score > 60, path:'/tenant/profile' },
    { label:'הוסף טווח תקציב', pts:2, done:false, path:'/tenant/share-profile' },
  ].filter(t => !t.done).slice(0, 3);

  const glassCard: React.CSSProperties = {
    background: 'rgba(248,250,252,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(248,250,252,0.08)',
    borderRadius: 20,
  };

  return (
    <div dir="rtl" style={{ minHeight:'100vh', background:'#18243A', fontFamily:"'IBM Plex Sans','Heebo',sans-serif", paddingBottom:100, overflowX:'hidden', position:'relative' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Background */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-10%', right:'-5%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 65%)', filter:'blur(50px)' }} />
        <div style={{ position:'absolute', bottom:'20%', left:'-8%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)', filter:'blur(50px)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
      </div>

      {/* Header */}
      <div style={{ position:'relative', zIndex:1, padding:'52px 20px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div>
            <p style={{ color:'rgba(248,250,252,0.35)', fontSize:13, margin:'0 0 2px' }}>שלום, {firstName}</p>
            <p style={{ color:'#F8FAFC', fontWeight:700, fontSize:22, margin:0, letterSpacing:'-0.3px' }}>הפרופיל שלי</p>
          </div>
          <button onClick={logout} style={{ width:40, height:40, borderRadius:14, background:'rgba(248,250,252,0.06)', border:'1px solid rgba(248,250,252,0.1)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(248,250,252,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>

        {/* Score card */}
        <div style={{ ...glassCard, padding:20, display:'flex', alignItems:'center', gap:20, marginBottom:16, position:'relative', overflow:'hidden' }}>
          {/* Glow behind card */}
          <div style={{ position:'absolute', top:-30, right:-30, width:150, height:150, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />
          <ScoreRing score={score} />
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <span style={{ color:'#F8FAFC', fontSize:48, fontWeight:700, lineHeight:1, letterSpacing:'-2px' }}>{score}</span>
              <span style={{ color:'rgba(248,250,252,0.2)', fontSize:18, fontWeight:400 }}>/100</span>
            </div>
            <ScoreBadge score={score} />
            <p style={{ color:'rgba(248,250,252,0.3)', fontSize:11, margin:'8px 0 0', lineHeight:1.5 }}>
              {score < 70 ? 'השלם משימות לשיפור הציון' : 'פרופיל חזק — שתף עם בעלי נכסים'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
          {[
            { label:'המלצות', value:recCount, sub: verifiedRecs > 0 ? `${verifiedRecs} מאומת` : null, color:'#F59E0B', bg:'rgba(245,158,11,0.1)' },
            { label:'אימותים', value: profile?.income_verified ? 1 : 0, sub:'מתוך 2', color:'#22C55E', bg:'rgba(34,197,94,0.1)' },
            { label:'שנות ניסיון', value: profile?.years_renting || 0, sub:null, color:'#8B5CF6', bg:'rgba(139,92,246,0.1)' },
          ].map(({ label, value, sub, color, bg }) => (
            <div key={label} style={{ ...glassCard, padding:'14px 10px', textAlign:'center' }}>
              <div style={{ width:32, height:32, borderRadius:10, background:bg, margin:'0 auto 8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}` }} />
              </div>
              <p style={{ color:'#F8FAFC', fontSize:22, fontWeight:700, margin:'0 0 2px', lineHeight:1 }}>{value}</p>
              <p style={{ color:'rgba(248,250,252,0.3)', fontSize:10, margin:0, letterSpacing:'0.2px' }}>{label}</p>
              {sub && <p style={{ color, fontSize:10, fontWeight:700, margin:'3px 0 0' }}>{sub}</p>}
            </div>
          ))}
        </div>

        {/* Share CTA */}
        <button onClick={() => navigate('/tenant/share-profile')} style={{
          width:'100%', background:'linear-gradient(135deg,#F59E0B 0%,#D97706 100%)',
          border:'none', borderRadius:18, padding:'16px 20px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          boxShadow:'0 6px 24px rgba(6,182,212,0.3)', marginBottom:16,
          fontFamily:'inherit', cursor:'pointer',
        }}>
          <div style={{ textAlign:'right' }}>
            <p style={{ color:'#fff', fontWeight:700, fontSize:15, margin:0 }}>שתף את הפרופיל שלך</p>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:11, margin:'3px 0 0' }}>שלח לבעל הנכס לפני הצפייה</p>
          </div>
          <div style={{ width:38, height:38, borderRadius:12, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#18243A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </div>
        </button>

        {/* Tasks */}
        {tasks.length > 0 && (
          <div style={{ ...glassCard, overflow:'hidden', marginBottom:16 }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(248,250,252,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <span style={{ color:'#F8FAFC', fontWeight:700, fontSize:13 }}>שפר את הציון</span>
              </div>
              <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:99, background:'rgba(245,158,11,0.12)', color:'#F59E0B' }}>{tasks.length} משימות</span>
            </div>
            {tasks.map((t, i) => (
              <button key={t.label} onClick={() => navigate(t.path)} style={{
                width:'100%', display:'flex', alignItems:'center', gap:12,
                padding:'14px 18px', textAlign:'right', fontFamily:'inherit', cursor:'pointer',
                background:'none', border:'none',
                borderBottom: i < tasks.length - 1 ? '1px solid rgba(248,250,252,0.05)' : 'none',
              }}>
                <div style={{ width:28, height:28, borderRadius:10, background:'rgba(248,250,252,0.06)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(248,250,252,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ flex:1, fontSize:13, color:'rgba(248,250,252,0.6)', fontWeight:500 }}>{t.label}</span>
                <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:99, background:'rgba(34,197,94,0.12)', color:'#22C55E', flexShrink:0 }}>+{t.pts}</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <button onClick={() => navigate('/ai-tools')} style={{ ...glassCard, padding:'18px 16px', textAlign:'right', cursor:'pointer', fontFamily:'inherit', border:'1px solid rgba(139,92,246,0.2)', background:'rgba(139,92,246,0.08)' }}>
            <div style={{ width:40, height:40, borderRadius:14, background:'rgba(139,92,246,0.15)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <p style={{ color:'#F8FAFC', fontWeight:700, fontSize:13, margin:'0 0 4px' }}>כלי AI</p>
            <p style={{ color:'rgba(248,250,252,0.3)', fontSize:11, margin:0 }}>ניתוח חוזה, הודעות</p>
          </button>

          <button onClick={() => navigate('/tenant/request-rec')} style={{ ...glassCard, padding:'18px 16px', textAlign:'right', cursor:'pointer', fontFamily:'inherit', border:'1px solid rgba(245,158,11,0.2)', background:'rgba(245,158,11,0.08)' }}>
            <div style={{ width:40, height:40, borderRadius:14, background:'rgba(245,158,11,0.15)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <p style={{ color:'#F8FAFC', fontWeight:700, fontSize:13, margin:'0 0 4px' }}>המלצה מאומתת</p>
            <p style={{ color:'rgba(248,250,252,0.3)', fontSize:11, margin:0 }}>+5 נקודות לציון</p>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
