import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, CheckCircle, Star, Zap, LogOut, TrendingUp, Gift, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ScoreCircle from '../../components/ScoreCircle';
import BottomNav from '../../components/BottomNav';

interface Profile { score: number; income_verified: boolean; years_renting: number; }

function ScoreTag({ score }: { score: number }) {
  if (score >= 85) return <span className="badge badge-green">מצוין</span>;
  if (score >= 70) return <span className="badge badge-teal">טוב מאוד</span>;
  if (score >= 55) return <span className="badge badge-amber">טוב</span>;
  return <span className="badge badge-gray">בסיסי</span>;
}

export default function TenantHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recCount, setRecCount] = useState(0);
  const [verifiedRecs, setVerifiedRecs] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from('tenant_profiles').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data); else navigate('/tenant/onboarding'); });
    supabase.from('recommendations').select('id,verified').eq('tenant_id', user.id)
      .then(({ data }) => {
        setRecCount(data?.length || 0);
        setVerifiedRecs(data?.filter((r: any) => r.verified).length || 0);
      });
  }, [user]);

  const score = profile?.score || 50;
  const firstName = user?.full_name?.split(' ')[0] || '';

  const tasks = [
    { label: 'בקש המלצה מאומתת מבעל נכס קודם', pts: 5, done: recCount > 0, path: '/tenant/request-rec' },
    { label: 'השלם את פרטי הפרופיל שלך', pts: 4, done: score > 60, path: '/tenant/profile' },
    { label: 'הוסף טווח תקציב', pts: 2, done: false, path: '/tenant/share-profile' },
  ].filter(t => !t.done).slice(0, 3);

  const stats = [
    { label: 'המלצות', value: recCount, sub: verifiedRecs > 0 ? `${verifiedRecs} מאומת` : null, icon: Star, color: '#D97706', bg: '#FEF3C7' },
    { label: 'אימותים', value: profile?.income_verified ? 1 : 0, sub: 'מתוך 2', icon: CheckCircle, color: '#059669', bg: '#D1FAE5' },
    { label: 'שנות ניסיון', value: profile?.years_renting || 0, sub: null, icon: Shield, color: '#6366F1', bg: '#E0E7FF' },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: '#F5F7FA' }} dir="rtl">

      {/* ── Hero header ── */}
      <div style={{ background: 'linear-gradient(160deg,#0f172a 0%,#1a2740 100%)' }} className="px-5 pt-14 pb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-white/50 text-sm mb-1">שלום, {firstName} 👋</p>
            <p className="text-white font-black text-xl">הפרופיל שלך</p>
          </div>
          <button onClick={logout} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Score row */}
        <div className="flex items-center gap-5">
          <ScoreCircle score={score} size={96} color="#fff" bgColor="rgba(255,255,255,0.12)" />
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-black text-white">{score}</span>
              <span className="text-white/30 text-lg font-medium">/ 100</span>
            </div>
            <ScoreTag score={score} />
            <p className="text-white/40 text-xs mt-1.5">
              {score < 70 ? 'השלם משימות לציון גבוה יותר' : 'שתף את הפרופיל שלך!'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-3 space-y-3">

        {/* Share CTA */}
        <button
          onClick={() => navigate('/tenant/share-profile')}
          className="w-full rounded-2xl px-5 py-4 flex items-center justify-between text-white anim-up"
          style={{ background: '#05A88C', boxShadow: '0 4px 16px rgba(5,168,140,.35)' }}
        >
          <div className="text-right">
            <p className="font-black text-[15px]">שתף את הפרופיל שלך</p>
            <p className="text-white/70 text-xs mt-0.5">שלח לבעל הנכס לפני הצפייה</p>
          </div>
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 anim-up d1">
          {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
            <div key={label} className="card p-3 text-center">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: bg }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="text-[22px] font-black leading-none" style={{ color: '#1C2235' }}>{value}</p>
              <p className="text-[10px] font-semibold mt-1" style={{ color: '#8792A2' }}>{label}</p>
              {sub && <p className="text-[10px] font-bold mt-0.5" style={{ color }}>{sub}</p>}
            </div>
          ))}
        </div>

        {/* Tasks */}
        {tasks.length > 0 && (
          <div className="card overflow-hidden anim-up d2">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: '#05A88C' }} />
                <p className="font-bold text-gray-900 text-sm">שפר את הציון</p>
              </div>
              <span className="badge badge-teal">{tasks.length} משימות</span>
            </div>
            {tasks.map((t, i) => (
              <button
                key={t.label}
                onClick={() => navigate(t.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-right hover:bg-gray-50 transition-colors ${i < tasks.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-gray-300" />
                </div>
                <span className="flex-1 text-sm font-medium text-gray-700">{t.label}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: '#CCFBF1', color: '#115E59' }}>+{t.pts}</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2.5 anim-up d3">
          <button onClick={() => navigate('/ai-tools')} className="card p-4 text-right hover:shadow-md transition-shadow active:scale-98">
            <div className="w-10 h-10 rounded-2xl mb-3 flex items-center justify-center" style={{ background: '#EDE9FE' }}>
              <Zap className="w-5 h-5" style={{ color: '#7C3AED' }} />
            </div>
            <p className="font-black text-sm text-gray-900">כלי AI</p>
            <p className="text-xs mt-0.5" style={{ color: '#8792A2' }}>ניתוח חוזה, הודעות</p>
          </button>

          <button onClick={() => navigate('/tenant/request-rec')} className="card p-4 text-right hover:shadow-md transition-shadow active:scale-98">
            <div className="w-10 h-10 rounded-2xl mb-3 flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <Star className="w-5 h-5" style={{ color: '#D97706' }} />
            </div>
            <p className="font-black text-sm text-gray-900">המלצה מאומתת</p>
            <p className="text-xs mt-0.5" style={{ color: '#8792A2' }}>+5 נקודות לציון</p>
          </button>

          <button
            onClick={() => navigate('/affiliate')}
            className="col-span-2 card px-5 py-3.5 flex items-center justify-between hover:shadow-md transition-shadow active:scale-98"
          >
            <div>
              <p className="font-bold text-sm text-gray-900">הרוויח קרדיט — שתף חברים</p>
              <p className="text-xs mt-0.5" style={{ color: '#8792A2' }}>₪30 על כל חבר שמשלם</p>
            </div>
            <Gift className="w-5 h-5 flex-shrink-0" style={{ color: '#8792A2' }} />
          </button>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
