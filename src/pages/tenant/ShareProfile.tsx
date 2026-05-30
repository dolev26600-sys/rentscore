import React, { useEffect, useState } from 'react';
import { Copy, Share2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import ScoreCircle from '../../components/ScoreCircle';
import BottomNav from '../../components/BottomNav';

export default function ShareProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [showPrice, setShowPrice] = useState(false);
  const [shareToken, setShareToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: p } = await supabase.from('tenant_profiles').select('*').eq('user_id', user.id).single();
      if (p) { setProfile(p); setShowPrice(p.show_price || false); }

      const { data: s } = await supabase.from('shared_profiles').select('*').eq('tenant_id', user.id).single();
      if (s) {
        setShareToken(s.share_token);
      } else {
        const token = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
        const { data: ns } = await supabase.from('shared_profiles').insert({ tenant_id: user.id, share_token: token }).select().single();
        if (ns) setShareToken(ns.share_token);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const profileUrl = `${window.location.origin}/profile/${shareToken}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(profileUrl);
    toast.success('הקישור הועתק!');
  };

  const togglePrice = async () => {
    const next = !showPrice;
    setShowPrice(next);
    await supabase.from('tenant_profiles').update({ show_price: next }).eq('user_id', user!.id);
    toast.success(next ? 'טווח מחיר יוצג' : 'טווח מחיר הוסתר');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-tenant-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="שתף פרופיל" backTo="/tenant/home" />

      {/* Preview card */}
      <div className="mx-4 mt-4 bg-gradient-to-br from-tenant-600 to-tenant-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">{user?.full_name}</h2>
            <p className="text-tenant-200 text-sm">{profile?.current_city || 'שוכר'} • {profile?.employment_type || 'עובד'}</p>
          </div>
          <ScoreCircle score={profile?.score || 50} size={80} color="#fff" bgColor="rgba(255,255,255,0.2)" />
        </div>
        <div className="flex gap-3 flex-wrap">
          {profile?.has_guarantor && (
            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">✓ ערב זמין</span>
          )}
          {profile?.employment_type && (
            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">{profile.employment_type}</span>
          )}
          {showPrice && profile?.price_range_min && (
            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
              ₪{profile.price_range_min.toLocaleString()}-{profile.price_range_max?.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Price toggle */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800 text-sm">הצג טווח מחיר</p>
          <p className="text-xs text-gray-500">בעלי נכסים יראו את התקציב שלך</p>
        </div>
        <button
          onClick={togglePrice}
          className={`w-12 h-6 rounded-full transition-colors ${showPrice ? 'bg-tenant-500' : 'bg-gray-200'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow mx-0.5 transition-transform ${showPrice ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Link */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <p className="font-semibold text-gray-800 mb-2">קישור לפרופיל</p>
        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between gap-2">
          <span className="text-xs text-gray-600 truncate">{profileUrl}</span>
          <button onClick={copyLink} className="shrink-0 p-1.5 bg-tenant-100 rounded-lg">
            <Copy className="w-4 h-4 text-tenant-600" />
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div className="mx-4 mt-4 space-y-3">
        <button
          onClick={copyLink}
          className="w-full bg-tenant-600 text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2"
        >
          <Copy className="w-5 h-5" />
          העתק קישור
        </button>
        {navigator.share && (
          <button
            onClick={() => navigator.share({ title: `הפרופיל של ${user?.full_name}`, url: profileUrl })}
            className="w-full border-2 border-tenant-500 text-tenant-600 font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            שתף
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
