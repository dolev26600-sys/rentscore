import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Shield, Zap, CheckCircle, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Welcome() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(330);

  useEffect(() => {
    supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setUserCount((count || 0) + 330));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-gray-900 text-[17px] tracking-tight">RentScore</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-semibold text-gray-500 hover:text-teal-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50"
        >
          התחבר
        </button>
      </nav>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col px-5 pt-9 pb-6">

        {/* User count badge */}
        <div className="inline-flex self-center items-center gap-2 bg-teal-50 border border-teal-100 rounded-full px-4 py-1.5 mb-7">
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" style={{ boxShadow: '0 0 0 3px rgba(20,184,166,0.2)' }} />
          <span className="text-teal-700 text-xs font-semibold">{userCount.toLocaleString('he-IL')} שוכרים כבר נרשמו</span>
        </div>

        {/* Headline */}
        <h1 className="text-[32px] font-black text-gray-900 text-center leading-[1.2] mb-3 tracking-tight">
          הפרופיל שיעזור לך<br />
          <span className="text-teal-600">למצוא דירה</span>
        </h1>

        <p className="text-gray-400 text-center text-[15px] leading-relaxed mb-8 max-w-xs mx-auto">
          בנה פרופיל שוכר מקצועי, שלח לבעלי נכסים וצא מהמסה
        </p>

        {/* CTAs */}
        <div className="space-y-3 mb-9">
          <button
            onClick={() => navigate('/signup?type=tenant')}
            className="w-full flex items-center justify-between bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold py-[15px] px-5 rounded-2xl text-[15px] transition-all active:scale-[0.98]"
            style={{ boxShadow: '0 4px 16px rgba(13,148,136,0.35)' }}
          >
            <span>אני שוכר — צור פרופיל חינם</span>
            <ArrowLeft className="w-5 h-5 opacity-80" />
          </button>
          <button
            onClick={() => navigate('/signup?type=landlord')}
            className="w-full flex items-center justify-between bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold py-[15px] px-5 rounded-2xl text-[15px] transition-all active:scale-[0.98]"
          >
            <span>אני בעל נכס</span>
            <ArrowLeft className="w-5 h-5 opacity-60" />
          </button>
          <button
            onClick={() => navigate('/demo')}
            className="w-full py-2.5 text-gray-400 text-sm hover:text-gray-600 transition-colors font-medium"
          >
            צפה בדמו ←
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-300 font-medium">למה RentScore?</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Features */}
        <div className="space-y-1 mb-8">
          {[
            { icon: Zap, title: 'בניה תוך 2 דקות', desc: 'מלא פרטים בסיסיים וקבל פרופיל מקצועי מיד' },
            { icon: Shield, title: 'מוניטין אמיתי', desc: 'ציון שמבוסס על ניסיון, תעסוקה והמלצות' },
            { icon: TrendingUp, title: 'AI לצידך', desc: 'ניתוח חוזים, ניסוח הודעות וייעוץ משפטי' },
            { icon: CheckCircle, title: 'חינמי לשוכרים', desc: 'תמיד חינם. בלי כרטיס אשראי.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3.5 px-1 py-3">
              <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-[14px]">{title}</p>
                <p className="text-gray-400 text-[13px] mt-0.5 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { value: '4.8★', label: 'דירוג ממוצע' },
            { value: '95%', label: 'הצלחה בשכירות' },
            { value: '2 דק׳', label: 'זמן הרשמה' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center bg-gray-50 rounded-2xl py-3.5 px-2">
              <p className="text-[20px] font-black text-gray-900 leading-none">{value}</p>
              <p className="text-[11px] text-gray-400 mt-1.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>

      </main>

      {/* ── Footer ── */}
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
