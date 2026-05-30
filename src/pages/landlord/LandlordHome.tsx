import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Clock, RefreshCw, Users, LogOut, Zap } from 'lucide-react';
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
      .then(({ data }) => {
        if (data) setProfile(data);
        else navigate('/landlord/onboarding');
      });
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('landlord_id', user.id)
      .then(({ count }) => setPropCount(count || 0));
  }, [user]);

  const score = profile?.score || 50;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-landlord-700 to-landlord-500 pt-10 pb-6 px-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={logout} className="text-landlord-100 text-sm">
            <LogOut className="w-5 h-5" />
          </button>
          <h1 className="text-white font-black text-lg">RentScore</h1>
          <div className="w-6" />
        </div>
        <p className="text-landlord-100 text-sm text-center mb-1">שלום, {user?.full_name?.split(' ')[0]}</p>
        <p className="text-white font-bold text-center text-lg mb-4">ציון בעל הנכס</p>
        <div className="flex justify-center">
          <ScoreCircle score={score} size={140} color="#F59E0B" bgColor="#fef3c7" />
        </div>
        <p className="text-landlord-100 text-xs text-center mt-2">
          ציון גבוה = יותר שוכרים איכותיים
        </p>
      </div>

      {/* Stats */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: 'נכסים', value: propCount, icon: Building2 },
          { label: 'זמן תגובה', value: profile?.response_time || '24ש', icon: Clock },
          { label: 'החזר פיקדון', value: `${profile?.deposit_return || 100}%`, icon: RefreshCw },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
            <Icon className="w-5 h-5 text-landlord-500 mx-auto mb-1" />
            <p className="text-xl font-black text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Requirements card */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-3 text-base">דרישות שלי</h2>
        <div className="space-y-2">
          {[
            { label: 'דורש ערב', value: profile?.requires_guarantor ? 'כן' : 'לא' },
            { label: 'חיות מחמד', value: profile?.allows_pets ? 'מאפשר' : 'לא מאפשר' },
            { label: 'ילדים', value: profile?.allows_children ? 'מאפשר' : 'לא מאפשר' },
          ].map(r => (
            <div key={r.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{r.label}</span>
              <span className="font-semibold text-gray-800">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mx-4 mt-4">
        <h2 className="font-bold text-gray-800 mb-3 text-base">פעולות מהירות</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/landlord/add-property')}
            className="bg-landlord-500 text-white rounded-xl p-4 text-right shadow-sm"
          >
            <Building2 className="w-6 h-6 text-white mb-2" />
            <p className="font-bold text-sm">הוסף נכס</p>
            <p className="text-xs text-landlord-100 mt-0.5">פרסם דירה חדשה</p>
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

      {/* Bio */}
      {profile?.bio && (
        <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-2">אודות</h2>
          <p className="text-sm text-gray-600">{profile.bio}</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
