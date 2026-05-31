import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star, Shield, Users, ChevronLeft, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Welcome() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(330);

  useEffect(() => {
    supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => {
        setUserCount((count || 0) + 330);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-tenant-900 via-tenant-700 to-tenant-500 flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute top-1/3 -left-16 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -bottom-12 right-1/4 w-64 h-64 bg-tenant-400/20 rounded-full" />
      </div>

      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-6">
        {/* Logo */}
        <div className="animate-fade-in-up flex items-center gap-3 mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-floating">
            <Home className="w-9 h-9 text-tenant-600" />
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-black text-white tracking-tight">RentScore</h1>
            <p className="text-tenant-200 text-sm font-medium">ישראל 🇮🇱</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="animate-fade-in-up stagger-1">
          <h2 className="text-2xl font-bold text-white mb-3 leading-snug">
            שכבת האמון החדשה<br />לשוק השכירות
          </h2>
          <p className="text-tenant-100 text-base mb-8 max-w-xs leading-relaxed">
            בנה את פרופיל השוכר שלך, הראה לבעלי נכסים שאתה אמין ומצא דירה מהר יותר
          </p>
        </div>

        {/* Stats glass cards */}
        <div className="animate-fade-in-up stagger-2 flex gap-3 mb-10 w-full max-w-sm">
          <div className="glass-card flex-1 py-3 px-2 text-center">
            <p className="text-2xl font-black text-white">{userCount.toLocaleString('he-IL')}+</p>
            <p className="text-tenant-200 text-xs mt-0.5">משתמשים</p>
          </div>
          <div className="glass-card flex-1 py-3 px-2 text-center">
            <p className="text-2xl font-black text-white">4.8★</p>
            <p className="text-tenant-200 text-xs mt-0.5">דירוג</p>
          </div>
          <div className="glass-card flex-1 py-3 px-2 text-center">
            <p className="text-2xl font-black text-white">95%</p>
            <p className="text-tenant-200 text-xs mt-0.5">הצלחה</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up stagger-3 w-full max-w-sm space-y-3">
          <button
            onClick={() => navigate('/signup?type=tenant')}
            className="btn btn-white btn-lg w-full"
          >
            <span>אני שוכר</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/signup?type=landlord')}
            className="btn btn-landlord btn-lg w-full"
          >
            <span>אני בעל נכס</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/demo')}
            className="btn btn-outline-white btn-md w-full"
          >
            צפה בדמו בחינם
          </button>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="mt-5 text-tenant-200 text-sm underline underline-offset-2"
        >
          כבר יש לי חשבון — התחבר
        </button>
      </div>

      {/* Trust signals */}
      <div className="relative glass-card mx-4 mb-6 px-6 py-4 rounded-2xl animate-fade-in stagger-4">
        <div className="flex justify-around">
          {[
            { icon: Shield, label: 'מאובטח' },
            { icon: Star, label: 'מדורג' },
            { icon: Users, label: 'קהילתי' },
            { icon: TrendingUp, label: 'מוכח' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
