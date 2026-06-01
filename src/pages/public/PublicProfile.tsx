import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, Star, CheckCircle, Home, Briefcase, MapPin, Calendar, Users, Shield, Award, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ScoreCircle from '../../components/ScoreCircle';

interface ProfileData {
  id: string;
  full_name: string;
  user_type: string;
  score: number;
  years_renting: number;
  current_city: string;
  employment_type: string;
  income_range: string;
  job_seniority: string;
  housing_status: string;
  has_guarantor: boolean;
  contract_preference: string;
  has_pets: boolean;
  smokes: boolean;
  price_range_min: number;
  price_range_max: number;
  show_price: boolean;
  phone: string;
}

function ScoreLabel({ score }: { score: number }) {
  if (score >= 85) return <span className="text-emerald-400 font-bold text-sm">מצוין</span>;
  if (score >= 70) return <span className="text-teal-300 font-bold text-sm">טוב מאוד</span>;
  if (score >= 55) return <span className="text-yellow-300 font-bold text-sm">טוב</span>;
  return <span className="text-orange-300 font-bold text-sm">בסיסי</span>;
}

function getAdvantages(profile: ProfileData): { label: string; icon: string }[] {
  const adv = [];
  if (profile.has_guarantor) adv.push({ label: 'ערב זמין', icon: '🛡️' });
  if (profile.years_renting >= 3) adv.push({ label: `${profile.years_renting} שנות ניסיון`, icon: '🏠' });
  if (!profile.has_pets) adv.push({ label: 'ללא חיות מחמד', icon: '✓' });
  if (!profile.smokes) adv.push({ label: 'לא מעשן', icon: '🚭' });
  if (profile.job_seniority === '5+ שנים') adv.push({ label: 'ותק עבודה גבוה', icon: '💼' });
  if (profile.contract_preference === 'שנתיים') adv.push({ label: 'מעדיף חוזה ארוך', icon: '📋' });
  if (profile.income_range) adv.push({ label: 'הצהיר על הכנסה', icon: '💰' });
  return adv.slice(0, 5);
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
        setProfile({
          id: 'demo', full_name: 'ישראל ישראלי', user_type: 'tenant',
          score: 82, years_renting: 4, current_city: 'תל אביב',
          employment_type: 'שכיר', income_range: '10,000-15,000',
          job_seniority: '3-5 שנים', housing_status: 'גר לבד',
          has_guarantor: true, contract_preference: 'שנה', has_pets: false,
          smokes: false, price_range_min: 4500, price_range_max: 6500,
          show_price: true, phone: '',
        });
        setRecommendations([
          { landlord_name: 'דוד לוי', rating: 5, comment: 'שוכר מצוין, שמר על הדירה ושילם בזמן תמיד', created_at: '2024-01-15' },
          { landlord_name: 'רחל כהן', rating: 5, comment: 'תקשורת מעולה, ממליצה בחום', created_at: '2023-11-20' },
        ]);
        setLoading(false);
        return;
      }

      let tenantId: string;

      if (id && id.startsWith('user-')) {
        // Fallback token: user-{uuid} — no shared_profiles table needed
        tenantId = id.replace('user-', '');
      } else {
        // Normal flow: look up shared_profiles table
        const { data: shared } = await supabase.from('shared_profiles').select('tenant_id').eq('share_token', id).single();
        if (!shared) { setError(true); setLoading(false); return; }
        tenantId = shared.tenant_id;
      }

      const { data: user } = await supabase.from('users').select('*').eq('id', tenantId).single();
      if (!user) { setError(true); setLoading(false); return; }
      const { data: tp } = await supabase.from('tenant_profiles').select('*').eq('user_id', tenantId).single();

      // Build profile even if tenant_profiles is missing — show basic info
      const baseProfile = {
        id: tenantId, full_name: user.full_name, user_type: 'tenant',
        score: 50, years_renting: 0, current_city: '', employment_type: '',
        income_range: '', job_seniority: '', housing_status: '',
        has_guarantor: false, contract_preference: '', has_pets: false,
        smokes: false, price_range_min: 0, price_range_max: 0,
        show_price: false, phone: user.phone || '',
      };
      setProfile(tp ? { ...baseProfile, ...tp, ...user, score: tp.score } : { ...baseProfile, ...user });
      const { data: recs } = await supabase.from('recommendations').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false });
      setRecommendations(recs || []);
      setLoading(false);
    };
    load();
  }, [id, isDemo]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-3 border-tenant-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 bg-gray-50">
      <div className="text-5xl mb-2">😕</div>
      <p className="text-gray-700 text-lg font-bold">פרופיל לא נמצא</p>
      <p className="text-gray-500 text-sm">הקישור אינו תקין או שהפרופיל הוסר</p>
      <button onClick={() => navigate('/')} className="btn btn-tenant btn-md mt-2">לדף הבית</button>
    </div>
  );

  if (!profile) return null;

  const advantages = getAdvantages(profile);
  const score = profile.score;
  const isTrusted = score >= 75;
  const initials = profile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0f766e 0%, #14b8a6 50%, #0d9488 100%)' }}>
        {/* Background circles */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute top-20 -left-10 w-36 h-36 rounded-full bg-white/5" />

        <div className="relative px-6 pt-12 pb-8 text-center">
          {/* RentScore brand */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            <Home className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm font-semibold tracking-wide">RentScore</span>
          </div>

          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center text-3xl font-black text-tenant-600 shadow-elevated mx-auto">
              {initials}
            </div>
            {isTrusted && (
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Name */}
          <h1 className="text-white text-2xl font-black mb-1">{profile.full_name}</h1>
          <p className="text-teal-200 text-sm mb-1">{profile.current_city} · {profile.employment_type}</p>
          {isTrusted && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1 mb-4">
              <Shield className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-emerald-300 text-xs font-bold">שוכר מאומת ✓</span>
            </div>
          )}

          {/* Score */}
          <div className="flex justify-center mb-3">
            <ScoreCircle score={score} size={140} color="#fff" bgColor="rgba(255,255,255,0.2)" />
          </div>
          <ScoreLabel score={score} />

          {/* Price badge */}
          {profile.show_price && profile.price_range_min > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 rounded-2xl px-4 py-2">
              <span className="text-white text-sm font-bold">
                תקציב: ₪{profile.price_range_min.toLocaleString()} – ₪{profile.price_range_max?.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Advantages ── */}
      {advantages.length > 0 && (
        <div className="mx-4 mt-5 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-tenant-500" />
            <h2 className="font-bold text-gray-800">יתרונות בולטים</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {advantages.map(adv => (
              <div key={adv.label} className="flex items-center gap-1.5 bg-white border border-tenant-100 rounded-2xl px-3 py-2 shadow-card">
                <span className="text-base">{adv.icon}</span>
                <span className="text-sm font-semibold text-gray-700">{adv.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Info grid ── */}
      <div className="mx-4 mt-5 animate-fade-in-up stagger-1">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-tenant-500" />
          <h2 className="font-bold text-gray-800">פרטי השוכר</h2>
        </div>
        <div className="card divide-y divide-gray-50">
          {[
            { icon: MapPin, label: 'עיר מגורים', value: profile.current_city },
            { icon: Briefcase, label: 'תעסוקה', value: profile.employment_type },
            { icon: Calendar, label: 'שנות שכירות', value: `${profile.years_renting} שנים` },
            { icon: Home, label: 'מצב מגורים', value: profile.housing_status },
            { icon: Users, label: 'ערב', value: profile.has_guarantor ? '✓ ערב זמין' : 'אין ערב' },
            profile.contract_preference ? { icon: Calendar, label: 'אורך חוזה מועדף', value: profile.contract_preference } : null,
          ].filter(Boolean).map(card => card && (
            <div key={card.label} className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 bg-tenant-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <card.icon className="w-4 h-4 text-tenant-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">{card.label}</p>
                <p className="text-sm font-semibold text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recommendations ── */}
      {recommendations.length > 0 && (
        <div className="mx-4 mt-5 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-yellow-500" />
            <h2 className="font-bold text-gray-800">המלצות מבעלי נכסים</h2>
            <span className="badge badge-success">{recommendations.length}</span>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="card p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-gray-600">
                      {rec.landlord_name?.[0]}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{rec.landlord_name}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: rec.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
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
        <div className="mx-4 mt-6 space-y-3">
          <a
            href={`https://wa.me/972${profile.phone.replace(/^0/, '')}?text=${encodeURIComponent(`שלום ${profile.full_name}, ראיתי את הפרופיל שלך ב-RentScore ואשמח לדבר`)}`}
            className="btn w-full py-4 rounded-2xl text-lg font-black flex items-center justify-center gap-2"
            style={{ background: '#25D366', color: '#fff', boxShadow: '0 4px 20px rgba(37,211,102,0.35)' }}
          >
            <MessageCircle className="w-5 h-5" />
            שלח WhatsApp
          </a>
          <a
            href={`tel:${profile.phone}`}
            className="btn btn-outline-white btn-lg w-full border-2 border-gray-200 text-gray-700"
          >
            <Phone className="w-5 h-5" />
            התקשר
          </a>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div className="mx-4 mt-5 mb-10 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-amber-700 text-xs leading-relaxed">
          המידע הוצהר על ידי השוכר ואינו מאומת באופן מלא על ידי RentScore. מומלץ לבצע בדיקה עצמאית לפני חתימת חוזה.
        </p>
      </div>

      {/* ── Powered by ── */}
      <div className="text-center pb-8">
        <button onClick={() => navigate('/')} className="text-xs text-gray-400 hover:text-tenant-600 transition-colors">
          מופעל על ידי <span className="font-bold">RentScore</span> · צור פרופיל שוכר חינם
        </button>
      </div>

    </div>
  );
}
