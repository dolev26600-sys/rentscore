import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, CheckCircle, Star, Zap, LogOut, TrendingUp, Shield } from 'lucide-react';
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
    { label: 'המלצות', value: recCount, sub: verifiedRecs > 0 ? `${verifiedRecs} מאומת` : null, icon: Star, color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
    { label: 'אימותים', value: profile?.income_verified ? 1 : 0, sub: 'מתוך 2', icon: CheckCircle, color: '#00B89F', bg: 'rgba(0,184,159,0.15)' },
    { label: 'שנות ניסיון', value: profile?.years_renting || 0, sub: null, icon: Shield, color: '#7C3AED', bg: 'rgba(124,58,237,0.15)' },
  ];

  return (
    <div className="min-h-screen pb-28 overflow-hidden" style={{ background: '#050A18' }} dir="rtl">

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div style={{ position:'absolute', top:'-10%', right:'-5%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,184,159,0.12) 0%, transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', top:'40%', left:'-10%', width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', filter:'blur(40px)' }} />
      </div>

      {/* Hero */}
      <div className="relative px-5 pt-14 pb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[13px] font-medium mb-0.5" style={{ color:'rgba(255,255,255,0.4)' }}>שלום, {firstName} 👋</p>
            <p className="text-white font-black text-[22px]">הפרופיל שלי</p>
          </div>
          <button onClick={logout}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <LogOut style={{ width:16, height:16, color:'rgba(255,255,255,0.5)' }} />
          </button>
        </div>

        {/* Score glass card */}
        <div className="rounded-3xl p-5 flex items-center gap-5"
          style={{ background:'rgba(255,255,255,0.06)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 8px 32px rgba(0,0,0,0.3)' }}>
          <ScoreCircle score={score} size={90} color="#fff" bgColor="rgba(255,255,255,0.08)" />
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[48px] font-black text-white leading-none">{score}</span>
              <span className="text-[16px] font-medium" style={{ color:'rgba(255,255,255,0.25)' }}>/ 100</span>
            </div>
            <ScoreTag score={score} />
            <p className="text-[11px] mt-1.5" style={{ color:'rgba(255,255,255,0.35)' }}>
              {score < 70 ? 'השלם משימות לציון גבוה יותר' : 'שתף את הפרופיל שלך!'}
            </p>
          </div>
        </div>
      </div>

      <div className="relative px-4 space-y-3">

        {/* Share CTA */}
        <button onClick={() => navigate('/tenant/share-profile')}
          className="w-full rounded-2xl px-5 py-4 flex items-center justify-between transition-all active:scale-[0.98]"
          style={{ background:'linear-gradient(135deg,#00B89F 0%,#009E88 100%)', boxShadow:'0 6px 24px rgba(0,184,159,0.3)' }}>
          <div className="text-right">
            <p className="font-black text-[15px] text-white">שתף את הפרופיל שלך</p>
            <p className="text-[11px] mt-0.5" style={{ color:'rgba(255,255,255,0.7)' }}>שלח לבעל הנכס לפני הצפייה</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'rgba(255,255,255,0.15)' }}>
            <Share2 style={{ width:18, height:18, color:'#fff' }} />
          </div>
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl p-3.5 text-center"
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: bg }}>
                <Icon style={{ width:15, height:15, color }} />
              </div>
              <p className="text-[22px] font-black text-white leading-none">{value}</p>
              <p className="text-[10px] font-semibold mt-1" style={{ color:'rgba(255,255,255,0.35)' }}>{label}</p>
              {sub && <p className="text-[10px] font-bold mt-0.5" style={{ color }}>{sub}</p>}
            </div>
          ))}
        </div>

        {/* Tasks */}
        {tasks.length > 0 && (
          <div className="rounded-2xl overflow-hidden"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <TrendingUp style={{ width:15, height:15, color:'#00B89F' }} />
                <p className="font-bold text-white text-[13px]">שפר את הציון</p>
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                style={{ background:'rgba(0,184,159,0.15)', color:'#00D4B8' }}>
                {tasks.length} משימות
              </span>
            </div>
            {tasks.map((t, i) => (
              <button key={t.label} onClick={() => navigate(t.path)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-right transition-all active:bg-white/5"
                style={{ borderBottom: i < tasks.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background:'rgba(255,255,255,0.07)' }}>
                  <CheckCircle style={{ width:14, height:14, color:'rgba(255,255,255,0.2)' }} />
                </div>
                <span className="flex-1 text-[13px] font-medium" style={{ color:'rgba(255,255,255,0.65)' }}>{t.label}</span>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background:'rgba(0,184,159,0.15)', color:'#00D4B8' }}>+{t.pts}</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => navigate('/ai-tools')}
            className="rounded-2xl p-4 text-right transition-all active:scale-[0.97]"
            style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)' }}>
            <div className="w-10 h-10 rounded-2xl mb-3 flex items-center justify-center" style={{ background:'rgba(124,58,237,0.2)' }}>
              <Zap style={{ width:18, height:18, color:'#A78BFA' }} />
            </div>
            <p className="font-black text-[13px] text-white">כלי AI</p>
            <p className="text-[11px] mt-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>ניתוח חוזה, הודעות</p>
          </button>

          <button onClick={() => navigate('/tenant/request-rec')}
            className="rounded-2xl p-4 text-right transition-all active:scale-[0.97]"
            style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)' }}>
            <div className="w-10 h-10 rounded-2xl mb-3 flex items-center justify-center" style={{ background:'rgba(245,158,11,0.2)' }}>
              <Star style={{ width:18, height:18, color:'#FCD34D' }} />
            </div>
            <p className="font-black text-[13px] text-white">המלצה מאומתת</p>
            <p className="text-[11px] mt-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>+5 נקודות לציון</p>
          </button>

        </div>

      </div>

      <BottomNav />
    </div>
  );
}
