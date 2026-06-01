import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Star, FileText, MessageSquare, ChevronLeft, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Welcome() {
  const navigate = useNavigate();
  const [count, setCount] = useState(330);

  useEffect(() => {
    supabase.from('users').select('id', { count: 'exact', head: true })
      .then(({ count: c }) => setCount((c || 0) + 330));
  }, []);

  return (
    <div className="min-h-screen flex flex-col" dir="rtl"
      style={{ background: 'linear-gradient(160deg,#060E1E 0%,#0A1F3D 50%,#0D2B3E 100%)' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 pt-8 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#00B89F' }}>
            <Zap className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <span className="font-black text-white text-[20px] tracking-tight">RentScore</span>
        </div>
        <button onClick={() => navigate('/login')}
          className="text-sm font-semibold text-white/50 hover:text-white/80 px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          התחבר
        </button>
      </nav>

      <main className="flex-1 flex flex-col px-5 pt-4 pb-8">

        {/* Live badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{ background: 'rgba(0,184,159,0.15)', border: '1px solid rgba(0,184,159,0.3)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00B89F' }} />
            <span className="text-sm font-bold" style={{ color: '#00D4B8' }}>
              {count.toLocaleString('he-IL')} משתמשים פעילים
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-[36px] font-black text-white leading-[1.1] tracking-tight mb-4">
            תוכיח שאתה<br />
            <span style={{ color: '#00D4B8' }}>שוכר מצוין</span>
          </h1>
          <p className="text-white/50 text-[15px] leading-relaxed max-w-xs mx-auto">
            פרופיל שוכר עם ציון, המלצות מאומתות וכלי AI — שלח לפני הצפייה וזכה בדירה
          </p>
        </div>

        {/* AI Tools strip */}
        <div className="rounded-2xl p-4 mb-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-wider mb-3">כלי AI חינמיים</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: FileText, label: 'ניתוח חוזה', color: '#00B89F', bg: 'rgba(0,184,159,0.15)' },
              { icon: MessageSquare, label: 'כתיבת הודעה', color: '#7C3AED', bg: 'rgba(124,58,237,0.15)' },
              { icon: Shield, label: 'זכויות שוכר', color: '#D97706', bg: 'rgba(217,119,6,0.15)' },
            ].map(({ icon: Icon, label, color, bg }) => (
              <button key={label} onClick={() => navigate('/ai-tools')}
                className="flex flex-col items-center gap-2 py-3 rounded-xl transition-all active:scale-95"
                style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
                <span className="text-[11px] font-bold text-white/70">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3 mb-5">
          <button onClick={() => navigate('/signup?type=tenant')}
            className="w-full flex items-center justify-between rounded-2xl px-5 py-4 text-white transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#00B89F,#009E88)', boxShadow: '0 8px 24px rgba(0,184,159,0.4)' }}>
            <div className="text-right">
              <p className="font-black text-[16px]">אני שוכר</p>
              <p className="text-white/70 text-xs mt-0.5 font-medium">צור פרופיל מקצועי — חינמי תמיד</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>חינם</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={() => navigate('/signup?type=agent')}
              className="flex flex-col items-start gap-2 rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="font-black text-[14px] text-white">סוכן נדל"ן</p>
              <p className="text-white/40 text-[11px]">מאגר שוכרים מדורגים</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: '#aaa' }}>199₪/חודש</span>
            </button>

            <button onClick={() => navigate('/signup?type=landlord')}
              className="flex flex-col items-start gap-2 rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="font-black text-[14px] text-white">בעל נכס</p>
              <p className="text-white/40 text-[11px]">בדוק שוכר לפני חתימה</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: '#aaa' }}>79₪/בדיקה</span>
            </button>
          </div>

          <button onClick={() => navigate('/demo')}
            className="w-full py-3 text-white/30 text-sm font-semibold hover:text-white/50 transition-colors">
            צפה בדמו — ראה איך נראה הפרופיל ←
          </button>
        </div>

        {/* Feature list */}
        <div className="space-y-3">
          {[
            { icon: Shield, title: 'המלצות מאומתות', desc: 'בעל הנכס מאשר ישירות — לא ניתן לזייף', color: '#00B89F', bg: 'rgba(0,184,159,0.12)' },
            { icon: Zap,    title: 'AI לניתוח חוזים', desc: 'זיהוי סעיפים לא סטנדרטיים בשניות',   color: '#7C3AED', bg: 'rgba(124,58,237,0.12)' },
            { icon: TrendingUp, title: 'ציון שוכר אישי', desc: 'מבוסס ניסיון, תעסוקה והמלצות',   color: '#D97706', bg: 'rgba(217,119,6,0.12)' },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="pt-0.5">
                <p className="font-bold text-white text-[14px]">{title}</p>
                <p className="text-white/40 text-[13px] mt-0.5 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          {[
            { value: '4.8★', label: 'דירוג ממוצע' },
            { value: '2 דק׳', label: 'יצירת פרופיל' },
            { value: '100%', label: 'חינם לשוכר' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center rounded-2xl py-3.5 px-2"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[20px] font-black text-white leading-none">{value}</p>
              <p className="text-[11px] text-white/40 mt-1.5">{label}</p>
            </div>
          ))}
        </div>

      </main>

      <footer className="px-5 py-4 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-[11px] text-white/20">
          © 2025 RentScore ·{' '}
          <button onClick={() => navigate('/privacy')} className="hover:text-white/40">פרטיות</button>
          {' '}·{' '}
          <button onClick={() => navigate('/terms')} className="hover:text-white/40">תנאים</button>
        </p>
      </footer>
    </div>
  );
}
