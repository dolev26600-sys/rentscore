import React, { useEffect, useState } from 'react';
import { Copy, Share2, ExternalLink, CheckCircle, Link2 } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      try {
        const { data: p } = await supabase.from('tenant_profiles').select('*').eq('user_id', user.id).single();
        if (p) { setProfile(p); setShowPrice(p.show_price || false); }

        const { data: s, error: sErr } = await supabase.from('shared_profiles').select('*').eq('tenant_id', user.id).maybeSingle();
        if (!sErr && s) {
          setShareToken(s.share_token);
        } else if (!sErr && !s) {
          const token = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
          const { data: ns, error: insertErr } = await supabase.from('shared_profiles')
            .insert({ tenant_id: user.id, share_token: token }).select().single();
          setShareToken((!insertErr && ns) ? ns.share_token : `user-${user.id}`);
        } else {
          setShareToken(`user-${user.id}`);
        }
      } catch { setShareToken(`user-${user.id}`); }
      setLoading(false);
    };
    load();
  }, [user]);

  const profileUrl = shareToken ? `${window.location.origin}/profile/${shareToken}` : '';
  const score = profile?.score || 50;

  const copyLink = async () => {
    if (!profileUrl) return;
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success('הקישור הועתק!');
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePrice = async () => {
    const next = !showPrice;
    setShowPrice(next);
    await supabase.from('tenant_profiles').update({ show_price: next }).eq('user_id', user!.id);
    toast.success(next ? 'טווח מחיר יוצג' : 'טווח מחיר הוסתר');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F4FA' }}>
      <div className="w-8 h-8 border-[3px] border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00B89F', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen pb-28" style={{ background: '#F0F4FA' }} dir="rtl">
      <PageHeader title="שתף פרופיל" backTo="/tenant/home" />

      {/* Profile preview */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#0A1C3D 0%,#162B4E 100%)', boxShadow: '0 8px 24px rgba(10,28,61,0.2)' }}>
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-[20px] font-black text-white">{user?.full_name}</h2>
              <p className="text-white/40 text-sm mt-0.5">
                {[profile?.current_city, profile?.employment_type].filter(Boolean).join(' · ') || 'שוכר'}
              </p>
              {score >= 75 && (
                <div className="flex items-center gap-1 mt-1.5">
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: '#00D4B8' }} />
                  <span className="text-xs font-bold" style={{ color: '#00D4B8' }}>שוכר מאומת</span>
                </div>
              )}
            </div>
            <ScoreCircle score={score} size={80} color="#fff" bgColor="rgba(255,255,255,0.1)" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {profile?.has_guarantor && <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>🛡️ ערב זמין</span>}
            {!profile?.has_pets && <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>✓ ללא חיות</span>}
            {!profile?.smokes && <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>🚭 לא מעשן</span>}
            {showPrice && profile?.price_range_min && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(0,184,159,0.2)', color: '#00D4B8' }}>
                ₪{profile.price_range_min.toLocaleString()}–{profile.price_range_max?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price toggle */}
      <div className="mx-4 mt-3">
        <div className="card px-4 py-3.5 flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-900 text-sm">הצג טווח מחיר</p>
            <p className="text-xs text-gray-400 mt-0.5">בעלי נכסים יראו את התקציב שלך</p>
          </div>
          <button onClick={togglePrice}
            className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
            style={{ background: showPrice ? '#00B89F' : '#D1D9E6' }}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${showPrice ? 'right-0.5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Link */}
      <div className="mx-4 mt-3">
        <div className="card p-4">
          <p className="font-bold text-gray-900 text-sm mb-3">הקישור שלך לשיתוף</p>
          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#F0F4FA', border: '1.5px solid #D8E2EF' }}>
            <Link2 className="w-4 h-4 flex-shrink-0" style={{ color: '#8092AE' }} />
            <span className="text-xs text-gray-500 truncate flex-1 font-medium">{profileUrl || '—'}</span>
            <button onClick={copyLink} className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
              style={{ background: 'rgba(0,184,159,0.1)' }}>
              <Copy className="w-4 h-4" style={{ color: '#00B89F' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mx-4 mt-3 space-y-2.5">
        <button onClick={copyLink} disabled={!profileUrl}
          className="btn btn-primary btn-lg w-full">
          {copied ? <><CheckCircle className="w-5 h-5" /> הועתק!</> : <><Copy className="w-5 h-5" /> העתק קישור</>}
        </button>

        {profileUrl && (
          <a href={profileUrl} target="_blank" rel="noopener noreferrer"
            className="btn btn-outline btn-md w-full">
            <ExternalLink className="w-4 h-4" />
            תצוגה מקדימה
          </a>
        )}

        {typeof navigator !== 'undefined' && navigator.share && profileUrl && (
          <button onClick={() => navigator.share({ title: `הפרופיל של ${user?.full_name}`, url: profileUrl })}
            className="btn btn-ghost btn-md w-full">
            <Share2 className="w-4 h-4" />
            שתף ישירות
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="mx-4 mt-4 rounded-2xl p-4" style={{ background: 'rgba(0,184,159,0.07)', border: '1px solid rgba(0,184,159,0.2)' }}>
        <p className="font-bold text-sm mb-2.5" style={{ color: '#007D6B' }}>💡 טיפים לשיתוף מוצלח</p>
        <ul className="space-y-1.5">
          {[
            'שלח את הקישור ב-WhatsApp לבעל הנכס לפני הצפייה',
            'השלם את הפרופיל שלך לציון גבוה יותר',
            'בקש המלצה מאומתת מבעל נכס קודם',
          ].map(tip => (
            <li key={tip} className="text-xs flex gap-2" style={{ color: '#007D6B' }}>
              <span className="mt-0.5">·</span>{tip}
            </li>
          ))}
        </ul>
      </div>

      <BottomNav />
    </div>
  );
}
