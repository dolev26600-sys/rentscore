import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Shield, Star, Users, Zap, CheckCircle } from 'lucide-react';
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
      <nav className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-tenant-600 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-gray-900 text-lg">RentScore</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-semibold text-gray-500 hover:text-tenant-600 transition-colors"
        >
          התחבר
        </button>
      </nav>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center px-6 pt-10 pb-6">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-tenant-50 border border-tenant-100 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-tenant-500 rounded-full animate-pulse-soft" />
          <span className="text-tenant-700 text-xs font-semibold">{userCount.toLocaleString('he-IL')} שוכרים כבר נרשמו</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-black text-gray-900 text-center leading-tight mb-4">
          הפרופיל שיעזור לך<br />
          <span className="text-tenant-600">למצוא דירה מהר יותר</span>
        </h1>

        <p className="text-gray-500 text-center text-base leading-relaxed mb-8 max-w-xs">
          בנה פרופיל שוכר מקצועי, שלח לבעלי נכסים וצא מהמסה
        </p>

        {/* CTA */}
        <div className="w-full max-w-sm space-y-3 mb-10">
          <button
            onClick={() => navigate('/signup?type=tenant')}
            className="w-full flex items-center justify-between bg-tenant-600 hover:bg-tenant-700 text-white font-bold py-4 px-6 rounded-2xl text-base transition-all active:scale-95 shadow-tenant"
          >
            <span>אני שוכר — צור פרופיל חינם</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/signup?type=landlord')}
            className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-2xl text-base transition-all active:scale-95"
          >
            <span>אני בעל נכס</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/demo')}
            className="w-full py-3 text-gray-400 text-sm hover:text-gray-600 transition-colors"
          >
            צפה בדמו ←
          </button>
        </div>

        {/* Social proof */}
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">למה RentScore?</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="space-y-3">
            {[
              { icon: Zap, title: 'בניה תוך 2 דקות', desc: 'מלא פרטים בסיסיים וקבל פרופיל מקצועי מיד' },
              { icon: Shield, title: 'מוניטין אמיתי', desc: 'ציון שמבוסס על ניסיון, תעסוקה והמלצות' },
              { icon: Star, title: 'AI לצידך', desc: 'ניתוח חוזים, ניסוח הודעות וייעוץ משפטי' },
              { icon: CheckCircle, title: 'חינמי לשוכרים', desc: 'תמיד חינם. בלי כרטיס אשראי.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 bg-tenant-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-tenant-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="w-full max-w-sm mt-8 grid grid-cols-3 gap-3">
          {[
            { value: '4.8★', label: 'דירוג' },
            { value: '95%', label: 'הצלחה' },
            { value: '2 דק׳', label: 'הרשמה' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center bg-gray-50 rounded-2xl py-3 px-2">
              <p className="text-xl font-black text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="px-6 py-4 text-center">
        <p className="text-xs text-gray-300">
          © 2025 RentScore · <button onClick={() => navigate('/privacy')} className="hover:underline">פרטיות</button> · <button onClick={() => navigate('/terms')} className="hover:underline">תנאים</button>
        </p>
      </footer>

    </div>
  );
}
