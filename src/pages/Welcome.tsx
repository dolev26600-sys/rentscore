import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Zap, Star, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Welcome() {
  const navigate = useNavigate();
  const [count, setCount] = useState(330);

  useEffect(() => {
    supabase.from('users').select('id', { count: 'exact', head: true })
      .then(({ count: c }) => setCount((c || 0) + 330));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#05A88C' }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-gray-900 text-[18px] tracking-tight">RentScore</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-semibold text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          התחבר
        </button>
      </nav>

      <main className="flex-1 flex flex-col px-5 pt-6 pb-8">

        {/* Live badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-700 text-xs font-bold">{count.toLocaleString('he-IL')} משתמשים רשומים</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-[32px] font-black text-gray-900 text-center leading-[1.15] tracking-tight mb-3">
          תוכיח שאתה<br />
          <span style={{ color: '#05A88C' }}>שוכר מצוין</span>
        </h1>
        <p className="text-gray-500 text-center text-[15px] leading-relaxed mb-8 max-w-xs mx-auto">
          פרופיל שוכר מקצועי עם ציון, המלצות מאומתות וכלי AI — שלח לפני הצפייה וזכה בדירה
        </p>

        {/* CTAs */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => navigate('/signup?type=tenant')}
            className="w-full flex items-center justify-between rounded-2xl px-5 py-4 text-white"
            style={{ background: 'linear-gradient(135deg,#05A88C,#038C75)', boxShadow: '0 6px 20px rgba(5,168,140,.35)' }}
          >
            <div className="text-right">
              <p className="font-black text-[16px]">אני שוכר</p>
              <p className="text-white/70 text-xs mt-0.5 font-medium">צור פרופיל מקצועי — חינמי תמיד</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/20 rounded-full px-2 py-0.5 font-semibold">חינם</span>
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/signup?type=agent')}
            className="w-full flex items-center justify-between rounded-2xl px-5 py-4 text-white"
            style={{ background: '#111827' }}
          >
            <div className="text-right">
              <p className="font-black text-[16px]">אני סוכן נדל"ן</p>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">מאגר שוכרים מדורגים ומאומתים</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/10 rounded-full px-2 py-0.5 font-semibold text-gray-400">199₪/חודש</span>
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </div>
          </button>

          <button
            onClick={() => navigate('/signup?type=landlord')}
            className="w-full flex items-center justify-between rounded-2xl px-5 py-4 border-2 border-gray-100 bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="text-right">
              <p className="font-black text-[16px] text-gray-800">אני בעל נכס</p>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">בדוק שוכר לפני חתימה על חוזה</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 font-semibold">79₪/בדיקה</span>
              <ChevronLeft className="w-4 h-4 text-gray-300" />
            </div>
          </button>

          <button onClick={() => navigate('/demo')} className="w-full py-2.5 text-gray-400 text-sm font-semibold hover:text-gray-600 transition-colors">
            צפה בדמו — ראה איך נראה הפרופיל ←
          </button>
        </div>

        {/* Features */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          {[
            { icon: Shield, title: 'המלצות מאומתות', desc: 'בעל הנכס מאשר ישירות — לא ניתן לזייף', color: '#05A88C', bg: '#CCFBF1' },
            { icon: Zap,    title: 'AI לניתוח חוזים', desc: 'זיהוי סעיפים לא סטנדרטיים בשניות',   color: '#7C3AED', bg: '#EDE9FE' },
            { icon: Star,   title: 'ציון שוכר אישי',  desc: 'מבוסס ניסיון, תעסוקה והמלצות',       color: '#D97706', bg: '#FEF3C7' },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="pt-0.5">
                <p className="font-bold text-gray-900 text-[14px]">{title}</p>
                <p className="text-gray-400 text-[13px] mt-0.5 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 mt-6">
          {[
            { value: '4.8★', label: 'דירוג ממוצע' },
            { value: '2 דק׳', label: 'יצירת פרופיל' },
            { value: '100%', label: 'חינם לשוכר' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center bg-gray-50 rounded-2xl py-3.5 px-2">
              <p className="text-[20px] font-black text-gray-900 leading-none">{value}</p>
              <p className="text-[11px] text-gray-400 mt-1.5">{label}</p>
            </div>
          ))}
        </div>

      </main>

      <footer className="px-5 py-4 border-t border-gray-50 text-center">
        <p className="text-[11px] text-gray-300">
          © 2025 RentScore ·{' '}
          <button onClick={() => navigate('/privacy')} className="hover:underline">פרטיות</button>
          {' '}·{' '}
          <button onClick={() => navigate('/terms')} className="hover:underline">תנאים</button>
        </p>
      </footer>
    </div>
  );
}
