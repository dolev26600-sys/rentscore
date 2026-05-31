import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, CheckCircle, Star, Clock, Zap, LogOut, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ScoreCircle from '../../components/ScoreCircle';
import BottomNav from '../../components/BottomNav';

interface Profile {
  score: number;
  income_verified: boolean;
  years_renting: number;
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
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-tenant-800 via-tenant-700 to-tenant-500 pt-12 pb-8 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full" />
        </div>
        <div className="relative flex justify-between items-center mb-6">
          <button onClick={logout} className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-white">
            <LogOut className="w-4 h-4" />
          </button>
          <span className="text-white font-black text-lg">RentScore</span>
          <div className="w-9" />
        </div>
        <div className="relative text-center">
          <p className="text-tenant-200 text-sm mb-1">שלום, {user?.full_name?.split(' ')[0]} 👋</p>
          <p className="text-white/80 text-sm mb-5">הציון שלך היום</p>
          <div className="flex justify-center">
            <ScoreCircle score={score} size={168} />
          </div>
        </div>
      </div>

      {/* Share Banner */}
      <div className="mx-4 mt-5">
        <button
          onClick={() => navigate('/tenant/share-profile')}
          className="w-full relative overflow-hidden rounded-2xl p-4 flex items-center justify-between shadow-tenant"
          style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6, #2dd4bf)' }}
        >
          <div className="shimmer absolute inset-0 pointer-events-none" />
          <div className="relative text-right">
            <p className="font-bold text-base text-white">שתף את הפרופיל שלך</p>
            <p className="text-tenant-100 text-xs mt-0.5">שלח לבעלי נכסים וזכה בדירה</p>
          </div>
          <div className="relative flex items-center gap-1 text-white">
            <Share2 className="w-7 h-7 opacity-90" />
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: 'אימותים', value: profile?.income_verified ? '1/2' : '0/2', icon: CheckCircle, color: 'text-tenant-500', bg: 'bg-tenant-50' },
          { label: 'המלצות', value: recCount, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: 'שנות שכירות', value: profile?.years_renting || 0, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-3 text-center hover-lift">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-xl font-black text-gray-800">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tasks */}
      {pendingTasks.length > 0 && (
        <div className="mx-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 text-base">שפר את הציון שלך</h2>
            <span className="badge badge-tenant">{pendingTasks.length} פעולות</span>
          </div>
          <div className="space-y-2">
            {pendingTasks.map((task, i) => (
              <div
                key={task.label}
                className={`card p-3 flex items-center justify-between hover-lift animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-gray-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{task.label}</span>
                </div>
                <span className="badge badge-pts">+{task.points} נק׳</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {doneTasks.length > 0 && (
        <div className="mx-4 mt-3 space-y-2">
          {doneTasks.map(task => (
            <div key={task.label} className="flex items-center gap-3 px-3 py-2 opacity-50">
              <CheckCircle className="w-5 h-5 text-tenant-500 flex-shrink-0" />
              <span className="text-sm text-gray-500 line-through">{task.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mx-4 mt-5">
        <h2 className="font-bold text-gray-800 mb-3 text-base">פעולות מהירות</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/tenant/profile')}
            className="card p-4 text-right hover-lift"
          >
            <div className="w-10 h-10 bg-tenant-50 rounded-xl flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-tenant-600" />
            </div>
            <p className="font-bold text-sm text-gray-800">השלם פרופיל</p>
            <p className="text-xs text-gray-500 mt-0.5">הגדל את הציון</p>
          </button>
          <button
            onClick={() => navigate('/ai-tools')}
            className="rounded-2xl p-4 text-right hover-lift"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-sm text-white">כלי AI</p>
            <p className="text-xs text-purple-200 mt-0.5">ניתוח חכם</p>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
