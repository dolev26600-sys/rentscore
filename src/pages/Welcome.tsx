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
      background: '#07080F',
      fontFamily: "'Heebo', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      position: 'relative',
    }}>

      {/* Ambient background */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-100px', right:'-80px', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(0,212,186,0.08) 0%, transparent 65%)', filter:'blur(20px)' }} />
        <div style={{ position:'absolute', bottom:'10%', left:'-100px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(99,60,255,0.06) 0%, transparent 65%)', filter:'blur(20px)' }} />
      </div>

      {/* NAV */}
      <nav style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'28px 20px 12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:12, background:'linear-gradient(135deg,#00D4BA,#00A896)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(0,212,186,0.35)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <span style={{ color:'#fff', fontWeight:900, fontSize:20, letterSpacing:'-0.5px' }}>RentScore</span>
        </div>
        <button onClick={() => navigate('/login')} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.55)', fontFamily:'inherit', fontWeight:700, fontSize:13, padding:'8px 16px', borderRadius:10, cursor:'pointer' }}>
          התחבר
        </button>
      </nav>

      {/* HERO */}
      <div style={{ position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column', padding:'20px 20px 32px' }}>

        {/* Live counter */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,212,186,0.08)', border:'1px solid rgba(0,212,186,0.18)', borderRadius:999, padding:'6px 16px' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#00D4BA', display:'inline-block', animation:'pulse 2s infinite' }} />
            <span style={{ color:'#00D4BA', fontWeight:700, fontSize:12 }}>{count.toLocaleString('he-IL')} שוכרים פעילים</span>
          </div>
        </div>

        {/* Score visual */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
          <div style={{ position:'relative', width:160, height:160 }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform:'rotate(-90deg)' }}>
              <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
              <circle cx="80" cy="80" r="68" fill="none" stroke="url(#g1)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray="427.3" strokeDashoffset="85.5"/>
              <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00D4BA"/>
                  <stop offset="100%" stopColor="#6B3FFF"/>
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'#fff', fontSize:46, fontWeight:900, lineHeight:1 }}>82</span>
              <span style={{ color:'rgba(255,255,255,0.4)', fontSize:11, fontWeight:600, marginTop:2 }}>RentScore</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <h1 style={{ color:'#fff', fontSize:34, fontWeight:900, lineHeight:1.1, letterSpacing:'-1px', margin:'0 0 12px' }}>
            תוכיח שאתה<br/>
            <span style={{ background:'linear-gradient(135deg,#00D4BA,#6B3FFF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>שוכר מצוין</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, lineHeight:1.6, maxWidth:260, margin:'0 auto' }}>
            פרופיל שוכר עם ציון, המלצות מאומתות וכלי AI
          </p>
        </div>

        {/* Primary CTA */}
        <button onClick={() => navigate('/signup?type=tenant')} style={{
          width:'100%', background:'linear-gradient(135deg,#00D4BA 0%,#00A896 100%)',
          border:'none', borderRadius:18, padding:'18px 24px', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          boxShadow:'0 12px 40px rgba(0,212,186,0.3)', marginBottom:12, fontFamily:'inherit',
        }}>
          <div style={{ textAlign:'right' }}>
            <p style={{ color:'#fff', fontWeight:900, fontSize:17, margin:0 }}>אני שוכר</p>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12, fontWeight:500, margin:'3px 0 0' }}>צור פרופיל מקצועי — חינמי תמיד</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:11, fontWeight:800, padding:'4px 10px', borderRadius:8 }}>חינם</span>
            <div style={{ width:36, height:36, background:'rgba(255,255,255,0.15)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
          </div>
        </button>

        {/* Secondary CTAs */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:28 }}>
          {[
            { label:'סוכן נדל"ן', desc:'מאגר שוכרים מדורגים', price:'199₪/חודש', path:'/signup?type=agent' },
            { label:'בעל נכס', desc:'בדוק שוכר לפני חתימה', price:'79₪/בדיקה', path:'/signup?type=landlord' },
          ].map(c => (
            <button key={c.label} onClick={() => navigate(c.path)} style={{
              background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)',
              borderRadius:16, padding:'14px', cursor:'pointer', textAlign:'right', fontFamily:'inherit',
            }}>
              <p style={{ color:'#fff', fontWeight:900, fontSize:14, margin:'0 0 4px' }}>{c.label}</p>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, margin:'0 0 8px' }}>{c.desc}</p>
              <span style={{ background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.4)', fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:6 }}>{c.price}</span>
            </button>
          ))}
        </div>

        {/* Features */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
          {[
            { emoji:'🛡️', title:'המלצות מאומתות', desc:'בעל הנכס מאשר ישירות — לא ניתן לזייף', accent:'rgba(0,212,186,0.12)' },
            { emoji:'⚡', title:'AI לניתוח חוזים', desc:'זיהוי סעיפים לא סטנדרטיים תוך שניות', accent:'rgba(107,63,255,0.12)' },
            { emoji:'📈', title:'ציון שוכר אישי', desc:'מבוסס ניסיון, תעסוקה והמלצות', accent:'rgba(245,158,11,0.12)' },
          ].map(f => (
            <div key={f.title} style={{ display:'flex', alignItems:'center', gap:14, background:f.accent, border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'14px 16px' }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{f.emoji}</span>
              <div>
                <p style={{ color:'#fff', fontWeight:800, fontSize:13, margin:'0 0 2px' }}>{f.title}</p>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:12, margin:0, lineHeight:1.4 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
          {[
            { value:'4.8★', label:'דירוג' },
            { value:'2 דק׳', label:'פרופיל' },
            { value:'100%', label:'חינם' },
          ].map(s => (
            <div key={s.label} style={{ textAlign:'center', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'14px 8px' }}>
              <p style={{ color:'#fff', fontWeight:900, fontSize:20, margin:'0 0 4px', lineHeight:1 }}>{s.value}</p>
              <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, margin:0, fontWeight:600 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/demo')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.2)', fontSize:13, fontFamily:'inherit', cursor:'pointer', padding:'8px' }}>
          צפה בדמו ←
        </button>

      </div>

      <footer style={{ position:'relative', zIndex:1, textAlign:'center', padding:'12px 20px 20px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color:'rgba(255,255,255,0.12)', fontSize:11, margin:0, fontFamily:'inherit' }}>
          © 2025 RentScore ·{' '}
          <button onClick={() => navigate('/privacy')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.12)', fontSize:11, fontFamily:'inherit', cursor:'pointer' }}>פרטיות</button>
          {' '}·{' '}
          <button onClick={() => navigate('/terms')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.12)', fontSize:11, fontFamily:'inherit', cursor:'pointer' }}>תנאים</button>
        </p>
      </footer>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
