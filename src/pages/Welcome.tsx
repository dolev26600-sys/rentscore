import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Welcome() {
  const navigate = useNavigate();
  const [count, setCount] = useState(330);

  useEffect(() => {
    supabase.from('users').select('id', { count: 'exact', head: true })
      .then(({ count: c }) => setCount((c || 0) + 330));
  }, []);

  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      background: '#18243A',
      fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      position: 'relative',
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      `}</style>

      {/* Ambient background layers */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        {/* Top right — gold glow */}
        <div style={{ position:'absolute', top:'-120px', right:'-80px', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 60%)', filter:'blur(40px)' }} />
        {/* Bottom left — purple glow */}
        <div style={{ position:'absolute', bottom:'5%', left:'-100px', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)', filter:'blur(40px)' }} />
        {/* Center — subtle blue */}
        <div style={{ position:'absolute', top:'35%', left:'50%', transform:'translateX(-50%)', width:600, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)', filter:'blur(60px)' }} />
        {/* Grid overlay */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize:'40px 40px', opacity:0.6 }} />
      </div>

      {/* NAV */}
      <nav style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 20px 12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Logo mark */}
          <div style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(135deg,#F59E0B,#D97706)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 20px rgba(245,158,11,0.4)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <span style={{ color:'#F8FAFC', fontWeight:700, fontSize:20, letterSpacing:'-0.3px' }}>RentScore</span>
        </div>
        <button onClick={() => navigate('/login')} style={{
          background:'rgba(248,250,252,0.06)', border:'1px solid rgba(248,250,252,0.12)',
          color:'rgba(248,250,252,0.5)', fontFamily:'inherit', fontWeight:600,
          fontSize:13, padding:'8px 18px', borderRadius:10, cursor:'pointer',
          transition:'all 0.2s',
        }}>
          התחבר
        </button>
      </nav>

      {/* HERO */}
      <div style={{ position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column', padding:'12px 20px 32px', animation:'fadeUp 0.6s ease' }}>

        {/* Live counter badge */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.25)', borderRadius:999, padding:'6px 16px' }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E', display:'inline-block', animation:'pulse 2s infinite', boxShadow:'0 0 6px #22C55E' }} />
            <span style={{ color:'#06B6D4', fontWeight:600, fontSize:13 }}>{count.toLocaleString('he-IL')} שוכרים פעילים</span>
          </div>
        </div>

        {/* Score ring */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
          <div style={{ position:'relative', width:156, height:156 }}>
            {/* Outer glow */}
            <div style={{ position:'absolute', inset:-12, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', filter:'blur(8px)' }} />
            <svg width="156" height="156" viewBox="0 0 156 156" style={{ transform:'rotate(-90deg)', position:'relative', zIndex:1 }}>
              {/* Track */}
              <circle cx="78" cy="78" r="64" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
              {/* Secondary arc — green (verified portion) */}
              <circle cx="78" cy="78" r="64" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray="402.1" strokeDashoffset="281.5"/>
              {/* Main arc — gold */}
              <circle cx="78" cy="78" r="64" fill="none" stroke="url(#goldGrad)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray="402.1" strokeDashoffset="80.4"/>
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B"/>
                  <stop offset="100%" stopColor="#8B5CF6"/>
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:2 }}>
              <span style={{ color:'#F8FAFC', fontSize:44, fontWeight:700, lineHeight:1, letterSpacing:'-2px' }}>82</span>
              <span style={{ color:'rgba(248,250,252,0.35)', fontSize:11, fontWeight:500, marginTop:2, letterSpacing:'1px', textTransform:'uppercase' }}>RentScore</span>
            </div>
          </div>
        </div>

        {/* Score quality bar */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {[
              { label:'חלש', color:'rgba(239,68,68,0.5)' },
              { label:'בינוני', color:'rgba(245,158,11,0.5)' },
              { label:'טוב', color:'rgba(34,197,94,0.5)' },
              { label:'מצוין', color:'#22C55E', active:true },
            ].map(s => (
              <div key={s.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ width:42, height:4, borderRadius:99, background:s.active ? s.color : s.color, opacity:s.active ? 1 : 0.4, boxShadow:s.active ? `0 0 8px ${s.color}` : 'none' }} />
                <span style={{ fontSize:9, color:s.active ? s.color : 'rgba(248,250,252,0.25)', fontWeight:s.active ? 700 : 400 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Headline */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <h1 style={{ color:'#F8FAFC', fontSize:34, fontWeight:700, lineHeight:1.15, letterSpacing:'-1px', margin:'0 0 12px' }}>
            הזהות הפיננסית<br/>
            <span style={{
              background:'linear-gradient(135deg,#F59E0B 0%,#8B5CF6 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundClip:'text',
            }}>של השוכר המודרני</span>
          </h1>
          <p style={{ color:'rgba(248,250,252,0.4)', fontSize:14, lineHeight:1.7, maxWidth:270, margin:'0 auto' }}>
            ציון אמינות, המלצות מאומתות, וכלי AI — הכל במקום אחד
          </p>
        </div>

        {/* Primary CTA */}
        <button onClick={() => navigate('/signup?type=tenant')} style={{
          width:'100%',
          background:'linear-gradient(135deg,#06B6D4 0%,#0891B2 100%)',
          border:'none', borderRadius:18, padding:'18px 24px', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          boxShadow:'0 8px 32px rgba(6,182,212,0.35)', marginBottom:10,
          fontFamily:'inherit', transition:'all 0.2s',
        }}>
          <div style={{ textAlign:'right' }}>
            <p style={{ color:'#fff', fontWeight:700, fontSize:17, margin:0 }}>אני שוכר — צור פרופיל</p>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12, fontWeight:500, margin:'3px 0 0' }}>חינמי תמיד · מוכן תוך 2 דקות</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:11, fontWeight:800, padding:'4px 10px', borderRadius:8 }}>חינם</span>
            <div style={{ width:36, height:36, background:'rgba(255,255,255,0.15)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18243A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
          </div>
        </button>

        {/* Secondary CTAs */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:28 }}>
          {[
            { label:'סוכן נדל"ן', desc:'מאגר שוכרים מדורגים', badge:'199₪/חודש', path:'/signup?type=agent', color:'rgba(139,92,246,0.15)', border:'rgba(139,92,246,0.3)', badgeColor:'#8B5CF6' },
            { label:'בעל נכס', desc:'בדוק שוכר לפני חתימה', badge:'79₪/בדיקה', path:'/signup?type=landlord', color:'rgba(14,165,233,0.1)', border:'rgba(14,165,233,0.25)', badgeColor:'#0EA5E9' },
          ].map(c => (
            <button key={c.label} onClick={() => navigate(c.path)} style={{
              background:c.color, border:`1px solid ${c.border}`,
              borderRadius:18, padding:'16px 14px', cursor:'pointer',
              textAlign:'right', fontFamily:'inherit', transition:'all 0.2s',
            }}>
              <p style={{ color:'#F8FAFC', fontWeight:700, fontSize:14, margin:'0 0 4px' }}>{c.label}</p>
              <p style={{ color:'rgba(248,250,252,0.4)', fontSize:11, margin:'0 0 10px' }}>{c.desc}</p>
              <span style={{ background:'rgba(255,255,255,0.08)', color:c.badgeColor, fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:6 }}>{c.badge}</span>
            </button>
          ))}
        </div>

        {/* Trust features */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
          {[
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
              title:'המלצות מאומתות', desc:'בעל הנכס מאשר ישירות — לא ניתן לזייף',
              color:'#22C55E', bg:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.15)',
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
              title:'ניתוח חוזה AI', desc:'זיהוי סעיפים לא סטנדרטיים תוך שניות',
              color:'#8B5CF6', bg:'rgba(139,92,246,0.08)', border:'rgba(139,92,246,0.15)',
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
              title:'ציון אמינות אישי', desc:'מבוסס ניסיון, תעסוקה, והמלצות מאומתות',
              color:'#F59E0B', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.15)',
            },
          ].map(f => (
            <div key={f.title} style={{ display:'flex', alignItems:'center', gap:14, background:f.bg, border:`1px solid ${f.border}`, borderRadius:16, padding:'14px 16px' }}>
              <div style={{ width:38, height:38, borderRadius:12, background:`${f.bg}`, border:`1px solid ${f.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:f.color }}>
                {f.icon}
              </div>
              <div>
                <p style={{ color:'#F8FAFC', fontWeight:700, fontSize:13, margin:'0 0 2px' }}>{f.title}</p>
                <p style={{ color:'rgba(248,250,252,0.4)', fontSize:12, margin:0, lineHeight:1.5 }}>{f.desc}</p>
              </div>
              <div style={{ marginRight:'auto', flexShrink:0 }}>
                <div style={{ width:18, height:18, borderRadius:'50%', background:`${f.color}20`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:20 }}>
          {[
            { value:'4.9', label:'דירוג', unit:'★', color:'#F59E0B' },
            { value:'2', label:'דקות הגדרה', unit:'דק׳', color:'#22C55E' },
            { value:'100%', label:'חינם לשוכרים', unit:'', color:'#8B5CF6' },
          ].map(s => (
            <div key={s.label} style={{ textAlign:'center', background:'rgba(248,250,252,0.04)', border:'1px solid rgba(248,250,252,0.07)', borderRadius:16, padding:'16px 8px' }}>
              <p style={{ color:s.color, fontWeight:700, fontSize:22, margin:'0 0 4px', lineHeight:1 }}>{s.value}{s.unit}</p>
              <p style={{ color:'rgba(248,250,252,0.3)', fontSize:10, margin:0, fontWeight:500, letterSpacing:'0.3px' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Demo link */}
        <button onClick={() => navigate('/demo')} style={{
          background:'none', border:'none',
          color:'rgba(248,250,252,0.2)', fontSize:13,
          fontFamily:'inherit', cursor:'pointer', padding:'8px',
          transition:'color 0.2s',
        }}>
          צפה בדמו ←
        </button>

      </div>

      {/* Footer */}
      <footer style={{ position:'relative', zIndex:1, textAlign:'center', padding:'12px 20px 20px', borderTop:'1px solid rgba(248,250,252,0.05)' }}>
        <p style={{ color:'rgba(248,250,252,0.1)', fontSize:11, margin:0, fontFamily:'inherit' }}>
          © 2025 RentScore ·{' '}
          <button onClick={() => navigate('/privacy')} style={{ background:'none', border:'none', color:'rgba(248,250,252,0.1)', fontSize:11, fontFamily:'inherit', cursor:'pointer' }}>פרטיות</button>
          {' '}·{' '}
          <button onClick={() => navigate('/terms')} style={{ background:'none', border:'none', color:'rgba(248,250,252,0.1)', fontSize:11, fontFamily:'inherit', cursor:'pointer' }}>תנאים</button>
        </p>
      </footer>

    </div>
  );
}
