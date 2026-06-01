import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Shield, Zap, CheckCircle, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Welcome() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(330);

  useEffect(() => {
    supabase.from('users').select('id', { count: 'exact', head: true })
      .then(({ count }) => setUserCount((count || 0) + 330));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
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

      <main className="flex-1 flex flex-col px-5 pt-8 pb-6">

        {/* Live badge */}
        <div className="inline-flex self-center items-center gap-2 bg-teal-50 border border-teal-100 rounded-full px-4 py-1.5 mb-7">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          <span className="text-teal-700 text-xs font-semibold">{userCount.toLocaleString('he-IL')} משתמשים רשומים</span>
        </div>

        {/* Headline */}
        <h1 className="text-[30px] font-black text-gray-900 text-center leading-[1.2] mb-3 tracking-tight">
          השכרת דירה —<br />
          <span className="text-teal-600">מהירה יותר, בטוחה יותר</span>
        </h1>
        <p className="text-gray-400 text-center text-[14px] leading-relaxed mb-8 max-w-xs mx-auto">
          לשוכרים, לסוכנים ולבעלי נכסים — פלטפורמת האמון לשוק השכירות הישראלי
        </p>

        {/* 3 Paths */}
        <div className="space-y-3 mb-8">

          {/* Tenant */}
          <button
            onClick={() => navigate('/signup?type=tenant')}
            className="w-full flex items-center justify-between rounded-2xl px-5 py-4 text-white font-bold text-[15px] transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)', boxShadow: '0 4px 16px rgba(13,148,136,0.3)' }}
          >
            <div className="text-right">
              <p className="font-black text-[15px]">אני שוכר</p>
              <p className="text-teal-100 text-xs font-normal mt-0.5">צור פרופיל מקצועי — חינם</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">חינם</span>
              <ArrowLeft className="w-4 h-4 opacity-70" />
            </div>
          </button>

          {/* Agent */}
          <button
            onClick={() => navigate('/signup?type=agent')}
            className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 rounded-2xl px-5 py-4 text-white font-bold text-[15px] transition-all active:scale-[0.98]"
          >
            <div className="text-right">
              <p className="font-black text-[15px]">אני סוכן נדל"ן</p>
              <p className="text-gray-400 text-xs font-normal mt-0.5">קבל שוכרים מאומתים לכל דירה</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/10 rounded-full px-2 py-0.5">199₪/חודש</span>
              <ArrowLeft className="w-4 h-4 opacity-50" />
            </div>
          </button>

          {/* Landlord */}
          <button
            onClick={() => navigate('/signup?type=landlord')}
            className="w-full flex items-center justify-between bg-white border-2 border-gray-100 hover:border-teal-200 rounded-2xl px-5 py-4 text-gray-800 transition-all active:scale-[0.98]"
          >
            <div className="text-right">
              <p className="font-black text-[15px] text-gray-800">אני בעל נכס</p>
              <p className="text-gray-400 text-xs font-normal mt-0.5">בדוק שוכר לפני חתימה</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">79₪/בדיקה</span>
              <ArrowLeft className="w-4 h-4 opacity-40" />
            </div>
          </button>

          <button
            onClick={() => navigate('/demo')}
            className="w-full py-2.5 text-gray-400 text-sm hover:text-gray-600 transition-colors font-medium"
          >
            צפה בדמו — ראה איך נראה הפרופיל ←
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-300 font-medium">למה RentScore?</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Features */}
        <div className="space-y-1 mb-7">
          {[
            { icon: Shield, title: 'המלצות מאומתות', desc: 'בעלי נכסים קודמים מאשרים ישירות — לא ניתן לזייף' },
            { icon: Zap, title: 'AI לשוכר', desc: 'ניתוח חוזים, כתיבת הודעות, ייעוץ זכויות — בעברית' },
            { icon: Users, title: 'כלי לסוכנים', desc: 'שלח לינק לשוכר, קבל פרופיל מלא תוך דקות' },
            { icon: CheckCircle, title: 'חינמי לשוכרים', desc: 'תמיד. בלי כרטיס אשראי.' },
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { value: '4.8★', label: 'דירוג ממוצע' },
            { value: '2 דק׳', label: 'יצירת פרופיל' },
            { value: '100%', label: 'חינם לשוכר' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center bg-gray-50 rounded-2xl py-3.5 px-2">
              <p className="text-[20px] font-black text-gray-900 leading-none">{value}</p>
              <p className="text-[11px] text-gray-400 mt-1.5 leading-tight">{label}</p>
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
