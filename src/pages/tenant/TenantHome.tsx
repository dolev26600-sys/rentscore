import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, CheckCircle, Star, Clock, ChevronLeft, Zap, LogOut } from 'lucide-react';
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
    { label: 'אמת הכנסה', points: 5, done: profile?.income_verified },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-tenant-700 to-tenant-600 pt-10 pb-6 px-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={logout} className="text-tenant-200 text-sm flex items-center gap-1">
            <LogOut className="w-4 h-4" />
          </button>
          <h1 className="text-white font-black text-lg">RentScore</h1>
          <div className="w-8" />
        </div>
        <p className="text-tenant-100 text-sm text-center mb-1">שלום, {user?.full_name?.split(' ')[0]}</p>
        <p className="text-white font-bold text-center text-lg mb-4">הציון שלך</p>
        <div className="flex justify-center">
          <ScoreCircle score={score} size={160} />
        </div>
      </div>

      {/* Share Banner */}
      <div className="mx-4 mt-4">
        <button
          onClick={() => navigate('/tenant/share-profile')}
          className="w-full bg-tenant-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-md"
        >
          <div className="text-right">
            <p className="font-bold text-base">שתף את הפרופיל שלך</p>
            <p className="text-tenant-100 text-xs">שלח לבעלי נכסים וזכה בדירה</p>
          </div>
          <Share2 className="w-8 h-8 text-white opacity-80" />
        </button>
      </div>

      {/* Stats */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: 'אימותים', value: profile?.income_verified ? '1/2' : '0/2', icon: CheckCircle },
          { label: 'המלצות', value: recCount, icon: Star },
          { label: 'שנות שכירות', value: profile?.years_renting || 0, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
            <Icon className="w-5 h-5 text-tenant-500 mx-auto mb-1" />
            <p className="text-xl font-black text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Tasks */}
      <div className="mx-4 mt-4">
        <h2 className="font-bold text-gray-800 mb-3 text-base">שפר את הציון שלך</h2>
        <div className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.label}
              className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-5 h-5 ${task.done ? 'text-tenant-500' : 'text-gray-300'}`} />
                <span className={`text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {task.label}
                </span>
              </div>
              {!task.done && (
                <span className="text-xs bg-tenant-50 text-tenant-600 font-bold px-2 py-0.5 rounded-full">
                  +{task.points}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mx-4 mt-4">
        <h2 className="font-bold text-gray-800 mb-3 text-base">פעולות מהירות</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/tenant/profile')}
            className="bg-white rounded-xl p-4 text-right shadow-sm border border-gray-100"
          >
            <Zap className="w-6 h-6 text-tenant-500 mb-2" />
            <p className="font-bold text-sm text-gray-800">השלם פרופיל</p>
            <p className="text-xs text-gray-500 mt-0.5">הגדל את הציון</p>
          </button>
          <button
            onClick={() => navigate('/ai-tools')}
            className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-4 text-right shadow-sm"
          >
            <Zap className="w-6 h-6 text-white mb-2" />
            <p className="font-bold text-sm text-white">כלי AI</p>
            <p className="text-xs text-purple-200 mt-0.5">ניתוח חכם</p>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
