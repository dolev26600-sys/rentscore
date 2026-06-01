import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Clock, RefreshCw, Zap, LogOut, Shield, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ScoreCircle from '../../components/ScoreCircle';
import BottomNav from '../../components/BottomNav';

export default function LandlordHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [propCount, setPropCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from('landlord_profiles').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data); else navigate('/landlord/onboarding'); });
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('landlord_id', user.id)
      .then(({ count }) => setPropCount(count || 0));
  }, [user]);

  const score = profile?.score || 50;
  const firstName = user?.full_name?.split(' ')[0] || '';

  return (
    <div className="min-h-screen pb-28" style={{ background: '#F0F4FA' }} dir="rtl">

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#0f172a 0%,#1a2740 100%)' }} className="px-5 pt-14 pb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-white/50 text-sm mb-1">שלום, {firstName} 👋</p>
            <p className="text-white font-black text-xl">לוח בקרה</p>
          </div>
          <button onClick={logout} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <LogOut className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <div className="flex items-center gap-5">
          <ScoreCircle score={score} size={96} color="#F59E0B" bgColor="rgba(245,158,11,0.12)" />
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-black text-white">{score}</span>
              <span className="text-white/30 text-lg font-medium">/ 100</span>
            </div>
            <span className="badge badge-amber">ציון בעל נכס</span>
            <p className="text-white/40 text-xs mt-1.5">ציון גבוה = שוכרים איכותיים יותר</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-3 space-y-3">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 anim-up">
          {[
            { label: 'נכסים',        value: propCount,               icon: Building2, color: '#D97706', bg: '#FEF3C7' },
            { label: 'זמן תגובה',    value: profile?.response_time || '—', icon: Clock, color: '#7C3AED', bg: '#EDE9FE' },
            { label: 'החזר פיקדון', value: `${profile?.deposit_return ?? '—'}%`, icon: RefreshCw, color: '#059669', bg: '#D1FAE5' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-3 text-center">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: bg }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="text-[22px] font-black leading-none" style={{ color: '#1C2235' }}>{value}</p>
              <p className="text-[10px] font-semibold mt-1" style={{ color: '#8792A2' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2.5 anim-up">
          <button onClick={() => navigate('/landlord/add-property')}
            className="card p-4 text-right hover:shadow-md transition-shadow active:scale-[0.97]">
            <div className="w-10 h-10 rounded-2xl mb-3 flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <Building2 className="w-5 h-5" style={{ color: '#D97706' }} />
            </div>
            <p className="font-black text-sm text-gray-900">הוסף נכס</p>
            <p className="text-xs mt-0.5" style={{ color: '#8792A2' }}>פרסם דירה חדשה</p>
          </button>

          <button onClick={() => navigate('/ai-tools')}
            className="card p-4 text-right hover:shadow-md transition-shadow active:scale-[0.97]">
            <div className="w-10 h-10 rounded-2xl mb-3 flex items-center justify-center" style={{ background: '#EDE9FE' }}>
              <Zap className="w-5 h-5" style={{ color: '#7C3AED' }} />
            </div>
            <p className="font-black text-sm text-gray-900">כלי AI</p>
            <p className="text-xs mt-0.5" style={{ color: '#8792A2' }}>ניתוח חכם</p>
          </button>
        </div>

        {/* Requirements */}
        {profile && (
          <div className="card overflow-hidden anim-up">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: '#00B89F' }} />
              <p className="font-bold text-gray-900 text-sm">דרישות שלי</p>
            </div>
            {[
              { label: 'ערב',        value: profile.requires_guarantor ? 'נדרש ערב' : 'לא נדרש' },
              { label: 'חיות מחמד', value: profile.allows_pets ? '✓ מאפשר' : '✗ לא מאפשר' },
              { label: 'ילדים',     value: profile.allows_children ? '✓ מאפשר' : '✗ לא מאפשר' },
            ].map((r, i, arr) => (
              <div key={r.label} className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-sm text-gray-500">{r.label}</span>
                <span className="text-sm font-bold text-gray-800">{r.value}</span>
              </div>
            ))}
          </div>
        )}

        {profile?.bio && (
          <div className="card p-4 anim-up">
            <p className="font-bold text-gray-900 mb-2 text-sm">אודות</p>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  );
}
