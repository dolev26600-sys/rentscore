import React, { useEffect, useState } from 'react';
import { Copy, Share2, ExternalLink, CheckCircle } from 'lucide-react';
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
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const { data: p } = await supabase.from('tenant_profiles').select('*').eq('user_id', user.id).single();
        if (p) { setProfile(p); setShowPrice(p.show_price || false); }

        // Try to get existing token
        const { data: s, error: sErr } = await supabase
          .from('shared_profiles').select('*').eq('tenant_id', user.id).maybeSingle();

        if (sErr) {
          console.error('shared_profiles error:', sErr);
          setError(`שגיאה בטעינת הפרופיל: ${sErr.message}`);
          setLoading(false);
          return;
        }

        if (s) {
          setShareToken(s.share_token);
        } else {
          // Create new token
          const token = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
          const { data: ns, error: insertErr } = await supabase
            .from('shared_profiles')
            .insert({ tenant_id: user.id, share_token: token })
            .select().single();

          if (insertErr) {
            console.error('insert error:', insertErr);
            setError(`שגיאה ביצירת הפרופיל: ${insertErr.message}`);
            setLoading(false);
            return;
          }
          if (ns) setShareToken(ns.share_token);
        }
      } catch (e: any) {
        setError(e.message);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const profileUrl = shareToken ? `${window.location.origin}/profile/${shareToken}` : '';

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-tenant-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-red-500 font-bold">שגיאה</p>
      <p className="text-gray-600 text-sm text-center">{error}</p>
      <p className="text-xs text-gray-400 text-center">
        ייתכן שטבלת shared_profiles לא קיימת ב-Supabase.<br />
        צור קשר עם התמיכה.
      </p>
    </div>
  );

  const score = profile?.score || 50;
  const isTrusted = score >= 75;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <PageHeader title="שתף פרופיל" backTo="/tenant/home" />

      {/* Profile preview card */}
      <div className="mx-4 mt-4 relative overflow-hidden rounded-2xl shadow-tenant" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)' }}>
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="relative p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-black text-white">{user?.full_name}</h2>
              <p className="text-teal-200 text-sm mt-0.5">{profile?.current_city || 'שוכר'} · {profile?.employment_type || 'עובד'}</p>
              {isTrusted && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-300 text-xs font-bold">שוכר מאומת</span>
                </div>
              )}
            </div>
            <ScoreCircle score={score} size={80} color="#fff" bgColor="rgba(255,255,255,0.2)" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {profile?.has_guarantor && <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">🛡️ ערב זמין</span>}
            {!profile?.has_pets && <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">✓ ללא חיות</span>}
            {!profile?.smokes && <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">🚭 לא מעשן</span>}
            {showPrice && profile?.price_range_min && (
              <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                ₪{profile.price_range_min.toLocaleString()}-{profile.price_range_max?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price toggle */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-card flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800 text-sm">הצג טווח מחיר בפרופיל</p>
          <p className="text-xs text-gray-500 mt-0.5">בעלי נכסים יראו את התקציב שלך</p>
        </div>
        <button onClick={togglePrice} className={`w-12 h-6 rounded-full transition-colors relative ${showPrice ? 'bg-tenant-500' : 'bg-gray-200'}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${showPrice ? 'right-0.5' : 'left-0.5'}`} />
        </button>
      </div>

      {/* Link box */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-card">
        <p className="font-bold text-gray-800 mb-3 text-sm">הקישור שלך לשיתוף</p>
        {profileUrl ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 truncate flex-1">{profileUrl}</span>
            <button onClick={copyLink} className="shrink-0 p-1.5 bg-tenant-50 rounded-lg hover:bg-tenant-100 transition-colors">
              <Copy className="w-4 h-4 text-tenant-600" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-red-500">לא נוצר קישור — בדוק שהטבלה קיימת ב-Supabase</p>
        )}
      </div>

      {/* CTA buttons */}
      <div className="mx-4 mt-4 space-y-3">
        <button
          onClick={copyLink}
          disabled={!profileUrl}
          className={`btn w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500' : 'btn-tenant'} text-white`}
        >
          {copied ? <><CheckCircle className="w-5 h-5" /> הועתק!</> : <><Copy className="w-5 h-5" /> העתק קישור</>}
        </button>

        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-white border-2 border-tenant-200 text-tenant-700 w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            תצוגה מקדימה
          </a>
        )}

        {navigator.share && profileUrl && (
          <button
            onClick={() => navigator.share({ title: `הפרופיל של ${user?.full_name}`, url: profileUrl })}
            className="btn w-full border-2 border-gray-200 text-gray-600 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            שתף ישירות
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="mx-4 mt-5 bg-tenant-50 border border-tenant-100 rounded-2xl p-4">
        <p className="text-tenant-700 font-bold text-sm mb-2">💡 טיפים לשיתוף מוצלח</p>
        <ul className="space-y-1">
          {['שלח את הקישור ב-WhatsApp לבעל הנכס לפני הצפייה', 'ציין שהפרופיל מציג את ההיסטוריה והמוניטין שלך', 'השלם את הפרופיל שלך לציון גבוה יותר'].map(tip => (
            <li key={tip} className="text-tenant-600 text-xs flex gap-1.5">
              <span>·</span>{tip}
            </li>
          ))}
        </ul>
      </div>

      <BottomNav />
    </div>
  );
}
