import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Star, FileText, MessageSquare, ChevronLeft, TrendingUp, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Welcome() {
  const navigate = useNavigate();
  const [count, setCount] = useState(330);

  useEffect(() => {
    supabase.from('users').select('id', { count: 'exact', head: true })
      .then(({ count: c }) => setCount((c || 0) + 330));
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" dir="rtl"
      style={{ background: '#050A18' }}>

      {/* Background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:'absolute', top:'-20%', right:'-10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,184,159,0.15) 0%, transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'20%', left:'-15%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', filter:'blur(40px)' }} />
      </div>

      {/* Nav */}
      <nav className="relative flex items-center justify-between px-5 pt-10 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00B89F,#007D6B)', boxShadow:'0 4px 12px rgba(0,184,159,0.4)' }}>
            <Zap style={{ width:17, height:17, color:'#fff' }} />
          </div>
          <span className="font-black text-white text-[21px] tracking-tight">RentScore</span>
        </div>
        <button onClick={() => navigate('/login')}
          className="text-[13px] font-bold px-4 py-2 rounded-xl transition-all"
          style={{ background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.1)' }}>
          התחבר
        </button>
      </nav>

      <main className="relative flex-1 flex flex-col px-5 pt-6 pb-8">

        {/* Live pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{ background:'rgba(0,184,159,0.12)', border:'1px solid rgba(0,184,159,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:'#00B89F' }} />
            <span className="text-[12px] font-bold" style={{ color:'#00D4B8' }}>
              {count.toLocaleString('he-IL')} שוכרים פעילים
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-8">
          {/* Score preview circle */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <svg width="120" height="120" viewBox="0 0 120 120" className="rotate-[-90deg]">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                strokeLinecap="round" strokeDasharray="326.7" strokeDashoffset="65" />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00B89F" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[32px] font-black text-white leading-none">82</span>
              <span className="text-[10px] font-bold mt-0.5" style={{ color:'#00B89F' }}>RentScore</span>
            </div>
          </div>

          <h1 className="text-[34px] font-black text-white leading-[1.1] tracking-tight mb-3">
            תוכיח שאתה<br />
            <span style={{ background:'linear-gradient(135deg,#00D4B8,#7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              שוכר מצוין
            </span>
          </h1>
          <p className="text-[14px] leading-relaxed max-w-[260px] mx-auto" style={{ color:'rgba(255,255,255,0.45)' }}>
            פרופיל שוכר עם ציון, המלצות מאומתות וכלי AI — שלח לפני הצפייה
          </p>
        </div>

        {/* Main CTA */}
        <button onClick={() => navigate('/signup?type=tenant')}
          className="w-full flex items-center justify-between rounded-2xl px-5 py-4 mb-3 transition-all active:scale-[0.97]"
          style={{ background:'linear-gradient(135deg,#00B89F 0%,#009E88 100%)', boxShadow:'0 8px 32px rgba(0,184,159,0.35)', border:'1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-right">
            <p className="font-black text-[17px] text-white">אני שוכר</p>
            <p className="text-[12px] mt-0.5 font-medium" style={{ color:'rgba(255,255,255,0.7)' }}>צור פרופיל מקצועי — חינמי תמיד</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-black px-2.5 py-1 rounded-lg" style={{ background:'rgba(255,255,255,0.2)', color:'#fff' }}>חינם</span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(255,255,255,0.15)' }}>
              <ChevronLeft className="w-4 h-4 text-white" />
            </div>
          </div>
        </button>

        {/* Secondary CTAs */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {[
            { label:'סוכן נדל"ן', desc:'מאגר שוכרים מדורגים', price:'199₪/חודש', path:'/signup?type=agent' },
            { label:'בעל נכס', desc:'בדוק שוכר לפני חתימה', price:'79₪/בדיקה', path:'/signup?type=landlord' },
          ].map(c => (
            <button key={c.label} onClick={() => navigate(c.path)}
              className="flex flex-col items-start gap-1.5 rounded-2xl px-4 py-3.5 transition-all active:scale-[0.97]"
              style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)' }}>
              <p className="font-black text-[13px] text-white">{c.label}</p>
              <p className="text-[11px]" style={{ color:'rgba(255,255,255,0.35)' }}>{c.desc}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.4)' }}>{c.price}</span>
            </button>
          ))}
        </div>

        {/* AI Tools glass card */}
        <div className="rounded-2xl p-4 mb-6"
          style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color:'rgba(255,255,255,0.3)' }}>כלי AI חינמיים</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: FileText, label:'ניתוח חוזה', color:'#00B89F', bg:'rgba(0,184,159,0.12)' },
              { icon: MessageSquare, label:'כתיבת הודעה', color:'#7C3AED', bg:'rgba(124,58,237,0.12)' },
              { icon: Shield, label:'זכויות שוכר', color:'#F59E0B', bg:'rgba(245,158,11,0.12)' },
            ].map(({ icon: Icon, label, color, bg }) => (
              <button key={label} onClick={() => navigate('/ai-tools')}
                className="flex flex-col items-center gap-2 py-3.5 rounded-xl transition-all active:scale-95"
                style={{ background: bg }}>
                <Icon style={{ width:18, height:18, color }} />
                <span className="text-[10px] font-bold" style={{ color:'rgba(255,255,255,0.6)' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {[
            { icon: Shield, title:'המלצות מאומתות', desc:'בעל הנכס מאשר ישירות — לא ניתן לזייף', color:'#00B89F', bg:'rgba(0,184,159,0.1)' },
            { icon: Zap, title:'AI לניתוח חוזים', desc:'זיהוי סעיפים לא סטנדרטיים תוך שניות', color:'#7C3AED', bg:'rgba(124,58,237,0.1)' },
            { icon: TrendingUp, title:'ציון שוכר אישי', desc:'מבוסס ניסיון, תעסוקה והמלצות', color:'#F59E0B', bg:'rgba(245,158,11,0.1)' },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex items-center gap-3.5 rounded-2xl px-4 py-3"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon style={{ width:18, height:18, color }} />
              </div>
              <div>
                <p className="font-bold text-white text-[13px]">{title}</p>
                <p className="text-[12px] mt-0.5 leading-snug" style={{ color:'rgba(255,255,255,0.35)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { value:'4.8★', label:'דירוג ממוצע' },
            { value:'2 דק׳', label:'יצירת פרופיל' },
            { value:'100%', label:'חינם לשוכר' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center rounded-2xl py-4"
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[19px] font-black text-white leading-none">{value}</p>
              <p className="text-[10px] mt-1.5 font-semibold" style={{ color:'rgba(255,255,255,0.35)' }}>{label}</p>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/demo')}
          className="w-full mt-4 py-2.5 text-[13px] font-semibold transition-colors"
          style={{ color:'rgba(255,255,255,0.25)' }}>
          צפה בדמו ←
        </button>

      </main>

      <footer className="relative px-5 py-4 text-center" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[11px]" style={{ color:'rgba(255,255,255,0.15)' }}>
          © 2025 RentScore ·{' '}
          <button onClick={() => navigate('/privacy')} className="hover:opacity-60">פרטיות</button>
          {' '}·{' '}
          <button onClick={() => navigate('/terms')} className="hover:opacity-60">תנאים</button>
        </p>
      </footer>
    </div>
  );
}
