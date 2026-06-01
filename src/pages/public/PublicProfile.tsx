import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, Star, Shield, Home, Briefcase, MapPin, Calendar, Users, Award, Zap, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ScoreCircle from '../../components/ScoreCircle';

interface ProfileData {
  id: string; full_name: string; user_type: string; score: number;
  years_renting: number; current_city: string; employment_type: string;
  income_range: string; job_seniority: string; housing_status: string;
  has_guarantor: boolean; contract_preference: string; has_pets: boolean;
  smokes: boolean; price_range_min: number; price_range_max: number;
  show_price: boolean; phone: string;
}

function ScoreLabel({ score }: { score: number }) {
  if (score >= 85) return <span className="text-emerald-400 font-bold text-sm">מצוין</span>;
  if (score >= 70) return <span className="text-teal-300 font-bold text-sm">טוב מאוד</span>;
  if (score >= 55) return <span className="text-amber-300 font-bold text-sm">טוב</span>;
  return <span className="text-gray-300 font-bold text-sm">בסיסי</span>;
}

function getHighlights(p: ProfileData): { label: string; emoji: string }[] {
  const h = [];
  if (p.has_guarantor) h.push({ label: 'ערב זמין', emoji: '🛡️' });
  if (p.years_renting >= 3) h.push({ label: `${p.years_renting} שנות ניסיון`, emoji: '🏠' });
  if (!p.has_pets) h.push({ label: 'ללא חיות מחמד', emoji: '✓' });
  if (!p.smokes) h.push({ label: 'לא מעשן', emoji: '🚭' });
  if (p.contract_preference === 'שנתיים') h.push({ label: 'חוזה ארוך', emoji: '📋' });
  if (p.income_range) h.push({ label: `הכנסה: ₪${p.income_range}`, emoji: '💰' });
  return h.slice(0, 5);
}

export default function PublicProfile({ isDemo = false }: { isDemo?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (isDemo) {
        setProfile({ id: 'demo', full_name: 'ישראל ישראלי', user_type: 'tenant', score: 82, years_renting: 4, current_city: 'תל אביב', employment_type: 'שכיר', income_range: '10,000–15,000', job_seniority: '3–5 שנים', housing_status: 'גר לבד', has_guarantor: true, contract_preference: 'שנה', has_pets: false, smokes: false, price_range_min: 4500, price_range_max: 6500, show_price: true, phone: '' });
        setRecommendations([
          { landlord_name: 'דוד לוי', rating: 5, comment: 'שוכר מצוין, שמר על הדירה ושילם בזמן תמיד', created_at: '2024-01-15', verified: true },
          { landlord_name: 'רחל כהן', rating: 5, comment: 'תקשורת מעולה, ממליצה בחום', created_at: '2023-11-20', verified: false },
        ]);
        setLoading(false);
        return;
      }

      let tenantId: string;
      if (id && id.startsWith('user-')) {
        tenantId = id.replace('user-', '');
      } else {
        const { data: shared } = await supabase.from('shared_profiles').select('tenant_id').eq('share_token', id).single();
        if (!shared) { setError(true); setLoading(false); return; }
        tenantId = shared.tenant_id;
      }

      const { data: user } = await supabase.from('users').select('*').eq('id', tenantId).single();
      if (!user) { setError(true); setLoading(false); return; }
      const { data: tp } = await supabase.from('tenant_profiles').select('*').eq('user_id', tenantId).single();

      const base = { id: tenantId, full_name: user.full_name, user_type: 'tenant', score: 50, years_renting: 0, current_city: '', employment_type: '', income_range: '', job_seniority: '', housing_status: '', has_guarantor: false, contract_preference: '', has_pets: false, smokes: false, price_range_min: 0, price_range_max: 0, show_price: false, phone: user.phone || '' };
      setProfile(tp ? { ...base, ...tp, ...user, score: tp.score } : { ...base, ...user });

      const { data: recs } = await supabase.from('recommendations').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false });
      setRecommendations(recs || []);
      setLoading(false);
    };
    load();
  }, [id, isDemo]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 bg-gray-50" dir="rtl">
      <div className="text-5xl">😕</div>
      <p className="text-gray-700 text-lg font-bold">פרופיל לא נמצא</p>
      <button onClick={() => navigate('/')} className="btn btn-primary btn-md">לדף הבית</button>
    </div>
  );
  if (!profile) return null;

  const highlights = getHighlights(profile);
  const score = profile.score;
  const isTrusted = score >= 75;
  const initials = profile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const verifiedCount = recommendations.filter(r => r.verified).length;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 50%, #0d9488 0%, transparent 60%)' }} />

        <div className="relative px-5 pt-12 pb-8">
          {/* Brand */}
          <div className="flex items-center gap-1.5 mb-7">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0d9488' }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white/60 text-sm font-semibold">RentScore</span>
          </div>

          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-black text-white">
                {initials}
              </div>
              {isTrusted && (
                <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Name + info */}
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-white text-xl font-black mb-0.5">{profile.full_name}</h1>
              <p className="text-white/50 text-sm mb-2">
                {[profile.current_city, profile.employment_type].filter(Boolean).join(' · ')}
              </p>
              {isTrusted && (
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-2.5 py-1 text-emerald-300 text-xs font-bold">
                  <Shield className="w-3 h-3" />שוכר מאומת
                </span>
              )}
              {verifiedCount > 0 && (
                <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/30 rounded-full px-2.5 py-1 text-amber-300 text-xs font-bold mr-1.5">
                  <Star className="w-3 h-3 fill-current" />{verifiedCount} המלצה מאומתת
                </span>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="mt-6 flex items-center gap-5">
            <ScoreCircle score={score} size={90} color="#fff" bgColor="rgba(255,255,255,0.12)" />
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-white">{score}</span>
                <span className="text-white/40 text-lg">/100</span>
              </div>
              <ScoreLabel score={score} />
              {profile.show_price && profile.price_range_min > 0 && (
                <p className="text-white/50 text-xs mt-1">
                  תקציב ₪{profile.price_range_min.toLocaleString()}–{profile.price_range_max?.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Highlights ── */}
      {highlights.length > 0 && (
        <div className="px-4 mt-4">
          <div className="flex flex-wrap gap-2">
            {highlights.map(h => (
              <div key={h.label} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
                <span className="text-sm">{h.emoji}</span>
                <span className="text-sm font-semibold text-gray-700">{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Details ── */}
      <div className="px-4 mt-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">פרטי השוכר</p>
        <div className="card divide-y divide-gray-50">
          {[
            { icon: MapPin, label: 'עיר מגורים', value: profile.current_city },
            { icon: Briefcase, label: 'תעסוקה', value: profile.employment_type },
            { icon: Calendar, label: 'שנות שכירות', value: profile.years_renting ? `${profile.years_renting} שנים` : null },
            { icon: Home, label: 'מצב מגורים', value: profile.housing_status },
            { icon: Users, label: 'ערב', value: profile.has_guarantor ? '✓ ערב זמין' : 'אין ערב' },
            profile.contract_preference ? { icon: Calendar, label: 'חוזה מועדף', value: profile.contract_preference } : null,
          ].filter(Boolean).map(item => item && (
            <div key={item.label} className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recommendations ── */}
      {recommendations.length > 0 && (
        <div className="px-4 mt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
            המלצות מבעלי נכסים · {recommendations.length}
          </p>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-black text-gray-600">
                      {rec.landlord_name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{rec.landlord_name}</p>
                      {rec.verified && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">✓ מאומת על ידי בעל הנכס</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3.5 h-3.5 ${j < rec.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">"{rec.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      {!isDemo && profile.phone && (
        <div className="px-4 mt-5 space-y-2.5">
          <a
            href={`https://wa.me/972${profile.phone.replace(/^0/, '')}?text=${encodeURIComponent(`שלום ${profile.full_name}, ראיתי את הפרופיל שלך ב-RentScore`)}`}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-[15px] text-white"
            style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}
          >
            <MessageCircle className="w-5 h-5" />
            שלח הודעת WhatsApp
          </a>
          <a href={`tel:${profile.phone}`} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            <Phone className="w-4 h-4" />
            התקשר
          </a>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div className="mx-4 mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
        <Shield className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-amber-700 text-xs leading-relaxed">
          המידע הוצהר על ידי השוכר. המלצות מאומתות אושרו ישירות על ידי בעל הנכס. מומלץ לבצע בדיקה עצמאית לפני חתימה.
        </p>
      </div>

      {/* ── Footer ── */}
      <div className="text-center py-8 mt-2">
        <button onClick={() => navigate('/')} className="text-xs text-gray-400 hover:text-teal-600 transition-colors">
          מופעל על ידי <span className="font-bold">RentScore</span> · צור פרופיל שוכר חינם
        </button>
      </div>

    </div>
  );
}
