import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, CheckCircle, Star, Zap, LogOut, TrendingUp, Gift, FileText, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ScoreCircle from '../../components/ScoreCircle';
import BottomNav from '../../components/BottomNav';

interface Profile {
  score: number;
  income_verified: boolean;
  years_renting: number;
  current_city?: string;
  employment_type?: string;
}

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
      .then(({ data }) => {
        if (data) setProfile(data);
        else navigate('/tenant/onboarding');
      });
    supabase.from('recommendations').select('id, verified', { count: 'exact' }).eq('tenant_id', user.id)
      .then(({ data, count }) => {
        setRecCount(count || 0);
        setVerifiedRecs((data || []).filter((r: any) => r.verified).length);
      });
  }, [user]);

  const score = profile?.score || 50;
  const firstName = user?.full_name?.split(' ')[0] || '';

  const tasks = [
    { label: 'בקש המלצה מאומתת מבעל נכס קודם', points: 5, done: recCount > 0, path: '/tenant/request-rec' },
    { label: 'השלם פרטי תעסוקה ומגורים', points: 4, done: score > 60, path: '/tenant/profile' },
    { label: 'הוסף טווח תקציב לפרופיל', points: 2, done: false, path: '/tenant/share-profile' },
  ].filter(t => !t.done).slice(0, 3);

  return (
    <div className="min-h-screen pb-28" style={{ background: '#f7f8fa' }} dir="rtl">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-5">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#0d9488' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900 text-[17px] tracking-tight">RentScore</span>
          </div>
          <button onClick={logout} className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
            <LogOut className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Score hero */}
        <div className="flex items-center gap-5">
          <div className="flex-shrink-0">
            <ScoreCircle score={score} size={90} />
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-0.5">שלום, {firstName}</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black text-gray-900">{score}</span>
              <span className="text-gray-400 text-sm font-medium">/ 100</span>
              <ScoreTag score={score} />
            </div>
            <p className="text-gray-400 text-xs">
              {score < 70 ? 'השלם משימות כדי לשפר את הציון' : 'פרופיל מצוין — שתף אותו!'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">

        {/* ── Share CTA ── */}
        <button
          onClick={() => navigate('/tenant/share-profile')}
          className="w-full rounded-2xl px-5 py-4 flex items-center justify-between text-white"
          style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', boxShadow: '0 4px 14px rgba(13,148,136,0.3)' }}
        >
          <div className="text-right">
            <p className="font-black text-[15px]">שתף את הפרופיל שלך</p>
            <p className="text-teal-100 text-xs mt-0.5">שלח לבעל הנכס לפני הצפייה</p>
          </div>
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
        </button>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'המלצות', value: recCount, sub: verifiedRecs > 0 ? `${verifiedRecs} מאומת` : '—', icon: Star, iconColor: '#f59e0b', iconBg: '#fef3c7' },
            { label: 'אימותים', value: profile?.income_verified ? 1 : 0, sub: 'מתוך 2', icon: CheckCircle, iconColor: '#059669', iconBg: '#d1fae5' },
            { label: 'ניסיון', value: `${profile?.years_renting || 0}`, sub: 'שנים', icon: Shield, iconColor: '#6366f1', iconBg: '#e0e7ff' },
          ].map(({ label, value, sub, icon: Icon, iconColor, iconBg }) => (
            <div key={label} className="card p-3 text-center">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: iconBg }}>
                <Icon className="w-4 h-4" style={{ color: iconColor }} />
              </div>
              <p className="text-[20px] font-black text-gray-900 leading-none">{value}</p>
              <p className="text-[10px] text-gray-400 mt-1">{label}</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: iconColor }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Tasks ── */}
        {tasks.length > 0 && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <p className="font-bold text-gray-800 text-sm">שפר את הציון שלך</p>
              <span className="badge badge-teal mr-auto">{tasks.length} פעולות</span>
            </div>
            {tasks.map((task, i) => (
              <button
                key={task.label}
                onClick={() => navigate(task.path)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-right hover:bg-gray-50 transition-colors ${i < tasks.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{task.label}</span>
                </div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full flex-shrink-0 mr-2">+{task.points}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => navigate('/ai-tools')}
            className="card p-4 text-right hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#f5f3ff' }}>
              <Zap className="w-5 h-5" style={{ color: '#7c3aed' }} />
            </div>
            <p className="font-bold text-sm text-gray-900">כלי AI</p>
            <p className="text-xs text-gray-400 mt-0.5">ניתוח חוזה, הודעות</p>
          </button>

          <button
            onClick={() => navigate('/tenant/request-rec')}
            className="card p-4 text-right hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#fef3c7' }}>
              <Star className="w-5 h-5" style={{ color: '#d97706' }} />
            </div>
            <p className="font-bold text-sm text-gray-900">המלצה מאומתת</p>
            <p className="text-xs text-gray-400 mt-0.5">+5 נקודות לציון</p>
          </button>

          <button
            onClick={() => navigate('/affiliate')}
            className="col-span-2 rounded-2xl px-5 py-3.5 flex items-center justify-between border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            <div className="text-right">
              <p className="font-bold text-sm text-gray-900">הרוויח קרדיט — שתף חברים</p>
              <p className="text-xs text-gray-400 mt-0.5">₪30 על כל חבר שנרשם ומשלם</p>
            </div>
            <Gift className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </button>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
