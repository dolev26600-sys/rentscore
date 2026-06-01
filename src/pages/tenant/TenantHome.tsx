import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, CheckCircle, Star, Clock, Zap, LogOut, ChevronLeft, TrendingUp, Gift } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ScoreCircle from '../../components/ScoreCircle';
import BottomNav from '../../components/BottomNav';

interface Profile {
  score: number;
  income_verified: boolean;
  years_renting: number;
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 85) return <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">מצוין</span>;
  if (score >= 70) return <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">טוב מאוד</span>;
  if (score >= 55) return <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">טוב</span>;
  return <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">בסיסי</span>;
}

export default function TenantHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recCount, setRecCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from('tenant_profiles').select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data) setProfile(data);
        else navigate('/tenant/onboarding');
      });
    supabase.from('recommendations').select('id', { count: 'exact', head: true }).eq('tenant_id', user.id)
      .then(({ count }) => setRecCount(count || 0));
  }, [user]);

  const score = profile?.score || 50;

  const tasks = [
    { label: 'הוסף תאריך לידה', points: 2, done: false },
    { label: 'הוסף מעסיק', points: 3, done: false },
    { label: 'בקש המלצה מבעל נכס', points: 5, done: recCount > 0 },
    { label: 'אמת הכנסה', points: 5, done: !!profile?.income_verified },
  ];

  const pendingTasks = tasks.filter(t => !t.done);
  const doneTasks = tasks.filter(t => t.done);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-28" dir="rtl">

      {/* ── White Header ── */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-6">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-gray-900 text-[16px] tracking-tight">RentScore</span>
          </div>
          <button
            onClick={logout}
            className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Greeting + score */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">שלום, {user?.full_name?.split(' ')[0]}</p>
          <p className="text-gray-800 font-bold text-lg mb-5">הציון שלך</p>
          <div className="flex justify-center mb-3">
            <ScoreCircle score={score} size={160} />
          </div>
          <ScoreBadge score={score} />
        </div>
      </div>

      {/* ── Share Banner ── */}
      <div className="mx-4 mt-4">
        <button
          onClick={() => navigate('/tenant/share-profile')}
          className="w-full relative overflow-hidden rounded-2xl px-5 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)', boxShadow: '0 4px 16px rgba(13,148,136,0.3)' }}
        >
          <div className="text-right">
            <p className="font-bold text-[15px] text-white">שתף את הפרופיל שלך</p>
            <p className="text-teal-100 text-xs mt-0.5">שלח לבעלי נכסים וזכה בדירה</p>
          </div>
          <div className="flex items-center gap-1 text-white">
            <Share2 className="w-6 h-6 opacity-90" />
            <ChevronLeft className="w-4 h-4 opacity-60" />
          </div>
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2.5">
        {[
          { label: 'אימותים', value: profile?.income_verified ? '1/2' : '0/2', icon: CheckCircle, color: 'text-teal-500', bg: 'bg-teal-50' },
          { label: 'המלצות', value: recCount, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'שנות שכירות', value: profile?.years_renting || 0, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-3 text-center" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-[20px] font-black text-gray-800 leading-none">{value}</p>
            <p className="text-[11px] text-gray-400 mt-1.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Improve Score Section ── */}
      {pendingTasks.length > 0 && (
        <div className="mx-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <h2 className="font-bold text-gray-800 text-[15px]">שפר את הציון שלך</h2>
            </div>
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{pendingTasks.length} פעולות</span>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {pendingTasks.map((task, i) => (
              <div
                key={task.label}
                className={`flex items-center justify-between px-4 py-3.5 ${i < pendingTasks.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-[14px] font-medium text-gray-700">{task.label}</span>
                </div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">+{task.points} נק׳</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed tasks */}
      {doneTasks.length > 0 && (
        <div className="mx-4 mt-2">
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {doneTasks.map((task, i) => (
              <div
                key={task.label}
                className={`flex items-center gap-3 px-4 py-3 opacity-40 ${i < doneTasks.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span className="text-[13px] text-gray-500 line-through">{task.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="mx-4 mt-5">
        <h2 className="font-bold text-gray-800 text-[15px] mb-3">פעולות מהירות</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => navigate('/tenant/profile')}
            className="bg-white rounded-2xl p-4 text-right"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-2.5">
              <Zap className="w-5 h-5 text-teal-600" />
            </div>
            <p className="font-bold text-[14px] text-gray-800">השלם פרופיל</p>
            <p className="text-[12px] text-gray-400 mt-0.5">הגדל את הציון</p>
          </button>
          <button
            onClick={() => navigate('/ai-tools')}
            className="rounded-2xl p-4 text-right"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 16px rgba(124,58,237,0.25)' }}
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-2.5">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-[14px] text-white">כלי AI</p>
            <p className="text-[12px] text-purple-200 mt-0.5">ניתוח חכם</p>
          </button>
          <button
            onClick={() => navigate('/affiliate')}
            className="col-span-2 rounded-2xl p-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #111827, #374151)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            <div className="text-right">
              <p className="font-bold text-[14px] text-white">הרוויח ₪30 על כל חבר</p>
              <p className="text-[12px] text-gray-400 mt-0.5">תוכנית שותפים — שתף וקבל קרדיט</p>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
