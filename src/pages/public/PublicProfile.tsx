import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, Star, CheckCircle, Home, Briefcase, MapPin, Calendar, Users, PawPrint } from 'lucide-react';
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

function getAdvantages(profile: ProfileData): string[] {
  const adv: string[] = [];
  if (profile.has_guarantor) adv.push('ערב זמין');
  if (profile.years_renting >= 3) adv.push(`${profile.years_renting} שנות ניסיון בשכירות`);
  if (!profile.has_pets) adv.push('ללא חיות מחמד');
  if (!profile.smokes) adv.push('לא מעשן');
  if (profile.job_seniority === '5+ שנים') adv.push('ותק עבודה גבוה');
  if (profile.contract_preference === 'שנתיים') adv.push('מעוניין בחוזה ארוך');
  if (profile.income_range) adv.push('הצהיר על הכנסה');
  return adv.slice(0, 4);
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
          score: 78, years_renting: 4, current_city: 'תל אביב',
          employment_type: 'שכיר', income_range: '10,000-15,000',
          job_seniority: '3-5 שנים', housing_status: 'גר לבד',
          has_guarantor: true, contract_preference: 'שנה', has_pets: false,
          smokes: false, price_range_min: 4000, price_range_max: 6000,
          show_price: true, phone: '',
        });
        setRecommendations([
          { landlord_name: 'דוד לוי', rating: 5, comment: 'שוכר מצוין, שמר על הדירה ושילם בזמן', created_at: '2024-01-15' },
          { landlord_name: 'רחל כהן', rating: 4, comment: 'תקשורת טובה, ממליצה', created_at: '2023-11-20' },
        ]);
        setLoading(false);
        return;
      }

      // Load by share token
      const { data: shared } = await supabase.from('shared_profiles').select('tenant_id').eq('share_token', id).single();
      if (!shared) { setError(true); setLoading(false); return; }

      const { data: user } = await supabase.from('users').select('*').eq('id', shared.tenant_id).single();
      const { data: tp } = await supabase.from('tenant_profiles').select('*').eq('user_id', shared.tenant_id).single();
      if (!user || !tp) { setError(true); setLoading(false); return; }

      setProfile({ ...tp, ...user, score: tp.score });
      const { data: recs } = await supabase.from('recommendations').select('*').eq('tenant_id', shared.tenant_id).order('created_at', { ascending: false });
      setRecommendations(recs || []);
      setLoading(false);
    };
    load();
  }, [id, isDemo]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-tenant-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-gray-600 text-lg font-semibold">פרופיל לא נמצא</p>
      <button onClick={() => navigate('/')} className="bg-tenant-600 text-white px-6 py-3 rounded-xl font-bold">לדף הבית</button>
    </div>
  );
  if (!profile) return null;

  const advantages = getAdvantages(profile);
  const score = profile.score;

  const infoCards = [
    { icon: MapPin, label: 'עיר', value: profile.current_city },
    { icon: Briefcase, label: 'תעסוקה', value: profile.employment_type },
    { icon: Calendar, label: 'שנות שכירות', value: `${profile.years_renting} שנים` },
    { icon: Home, label: 'מצב מגורים', value: profile.housing_status },
    { icon: Users, label: 'ערב', value: profile.has_guarantor ? 'זמין' : 'אין' },
    { icon: PawPrint, label: 'חיות', value: profile.has_pets ? 'יש' : 'אין' },
  ].filter(c => c.value);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-b from-tenant-700 to-tenant-600 pt-10 pb-8 px-6 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-3xl font-black text-tenant-600">
          {profile.full_name.charAt(0)}
        </div>
        <h1 className="text-white text-2xl font-bold">{profile.full_name}</h1>
        <p className="text-tenant-200 text-sm mb-4">{profile.current_city} • {profile.employment_type}</p>
        <ScoreCircle score={score} size={120} color="#fff" bgColor="rgba(255,255,255,0.2)" />
        {profile.show_price && profile.price_range_min && (
          <p className="text-tenant-200 text-sm mt-3">
            תקציב: ₪{profile.price_range_min.toLocaleString()} - ₪{profile.price_range_max?.toLocaleString()}
          </p>
        )}
      </div>

      {/* Advantages */}
      {advantages.length > 0 && (
        <div className="mx-4 mt-4">
          <h2 className="font-bold text-gray-800 mb-3">יתרונות</h2>
          <div className="grid grid-cols-2 gap-2">
            {advantages.map(adv => (
              <div key={adv} className="bg-tenant-50 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-tenant-500 shrink-0" />
                <span className="text-sm text-tenant-700 font-medium">{adv}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info grid */}
      <div className="mx-4 mt-4">
        <h2 className="font-bold text-gray-800 mb-3">פרטים</h2>
        <div className="grid grid-cols-2 gap-3">
          {infoCards.map(card => (
            <div key={card.label} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2">
              <card.icon className="w-4 h-4 text-tenant-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">{card.label}</p>
                <p className="text-sm font-semibold text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mx-4 mt-4">
          <h2 className="font-bold text-gray-800 mb-3">המלצות מבעלי נכסים ({recommendations.length})</h2>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-800 text-sm">{rec.landlord_name}</span>
                  <div className="flex">
                    {Array.from({ length: rec.rating }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{rec.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Landlord CTA */}
      {!isDemo && profile.phone && (
        <div className="mx-4 mt-6">
          <a
            href={`tel:${profile.phone}`}
            className="w-full bg-landlord-500 text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            צור קשר
          </a>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mx-4 mt-4 mb-8 bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-amber-700 text-xs text-center">
          המידע הוצהר על ידי השוכר ואינו מאומת באופן מלא
        </p>
      </div>

      {/* WhatsApp float */}
      {!isDemo && profile.phone && (
        <a
          href={`https://wa.me/972${profile.phone.replace(/^0/, '')}`}
          className="fixed bottom-6 left-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-30"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      )}
    </div>
  );
}
