import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star, Shield, Users, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Welcome() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => {
        setUserCount((count || 0) + 330);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-tenant-900 via-tenant-700 to-tenant-500 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Home className="w-8 h-8 text-tenant-600" />
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-black text-white tracking-tight">RentScore</h1>
            <p className="text-tenant-200 text-sm font-medium">ישראל</p>
          </div>
        </div>

        {/* Tagline */}
        <h2 className="text-2xl font-bold text-white mb-3 leading-snug">
          שכבת האמון החדשה<br />לשוק השכירות
        </h2>
        <p className="text-tenant-100 text-base mb-8 max-w-xs leading-relaxed">
          בנה את פרופיל השוכר שלך, הראה לבעלי נכסים שאתה אמין ומצא דירה מהר יותר
        </p>

        {/* Stats */}
        <div className="flex gap-6 mb-10">
          <div className="text-center">
            <p className="text-3xl font-black text-white">{userCount.toLocaleString('he-IL')}+</p>
            <p className="text-tenant-200 text-xs">משתמשים רשומים</p>
          </div>
          <div className="w-px bg-tenant-600" />
          <div className="text-center">
            <p className="text-3xl font-black text-white">4.8★</p>
            <p className="text-tenant-200 text-xs">דירוג ממוצע</p>
          </div>
          <div className="w-px bg-tenant-600" />
          <div className="text-center">
            <p className="text-3xl font-black text-white">95%</p>
            <p className="text-tenant-200 text-xs">הצלחה בשכירות</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => navigate('/signup?type=tenant')}
            className="w-full bg-white text-tenant-700 font-bold py-4 rounded-2xl text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span>אני שוכר</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/signup?type=landlord')}
            className="w-full bg-landlord-500 text-white font-bold py-4 rounded-2xl text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span>אני בעל נכס</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/demo')}
            className="w-full border-2 border-white/40 text-white font-semibold py-3 rounded-2xl text-base active:scale-95 transition-transform"
          >
            צפה בדמו
          </button>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="mt-4 text-tenant-200 text-sm underline"
        >
          כבר יש לי חשבון - התחבר
        </button>
      </div>

      {/* Trust signals */}
      <div className="bg-white/10 backdrop-blur rounded-t-3xl px-6 py-6">
        <div className="flex justify-around">
          <div className="flex flex-col items-center gap-1">
            <Shield className="w-6 h-6 text-white" />
            <span className="text-white text-xs font-medium">מאובטח</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Star className="w-6 h-6 text-white" />
            <span className="text-white text-xs font-medium">מדורג</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="w-6 h-6 text-white" />
            <span className="text-white text-xs font-medium">קהילתי</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-white" />
            <span className="text-white text-xs font-medium">ישראלי</span>
          </div>
        </div>
      </div>
    </div>
  );
}
