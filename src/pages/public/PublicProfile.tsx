import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, Star, Shield, Briefcase, MapPin, Calendar, Users, Zap, CheckCircle, Home } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ScoreCircle from '../../components/ScoreCircle';

interface ProfileData {
  id: string; full_name: string; score: number; years_renting: number;
  current_city: string; employment_type: string; income_range: string;
  job_seniority: string; housing_status: string; has_guarantor: boolean;
  contract_preference: string; has_pets: boolean; smokes: boolean;
  price_range_min: number; price_range_max: number; show_price: boolean; phone: string;
}

function ScoreColor(score: number) {
  if (score >= 85) return '#059669';
  if (score >= 70) return '#05A88C';
  if (score >= 55) return '#D97706';
  return '#9CA3AF';
}

function ScoreLabel({ score }: { score: number }) {
  const labels = [[85,'מצוין'],[70,'טוב מאוד'],[55,'טוב'],[0,'בסיסי']] as [number,string][];
  const [,label] = labels.find(([min]) => score >= min)!;
  return <span className="text-white/80 font-bold text-sm">{label}</span>;
}

function Pill({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 border border-gray-100 shadow-sm">
      <span className="text-sm leading-none">{emoji}</span>
      <span className="text-sm font-semibold text-gray-700 leading-none">{label}</span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-sm font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function PublicProfile({ isDemo = false }: { isDemo?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (isDemo) {
        setProfile({ id:'demo', full_name:'ישראל ישראלי', score:82, years_renting:4, current_city:'תל אביב', employment_type:'שכיר', income_range:'10,000–15,000', job_seniority:'3–5 שנים', housing_status:'גר לבד', has_guarantor:true, contract_preference:'שנה', has_pets:false, smokes:false, price_range_min:4500, price_range_max:6500, show_price:true, phone:'' });
        setRecs([
          { landlord_name:'דוד לוי', rating:5, comment:'שוכר מצוין, שמר על הדירה ושילם תמיד בזמן', verified:true },
          { landlord_name:'רחל כהן', rating:5, comment:'תקשורת מעולה, ממליצה בחום', verified:false },
        ]);
        setLoading(false); return;
      }

      let tenantId: string;
      if (id?.startsWith('user-')) { tenantId = id.replace('user-',''); }
      else {
        const { data: s } = await supabase.from('shared_profiles').select('tenant_id').eq('share_token', id).single();
        if (!s) { setError(true); setLoading(false); return; }
        tenantId = s.tenant_id;
      }
      const { data: u } = await supabase.from('users').select('*').eq('id', tenantId).single();
      if (!u) { setError(true); setLoading(false); return; }
      const { data: tp } = await supabase.from('tenant_profiles').select('*').eq('user_id', tenantId).single();
      const base = { id:tenantId, full_name:u.full_name, score:50, years_renting:0, current_city:'', employment_type:'', income_range:'', job_seniority:'', housing_status:'', has_guarantor:false, contract_preference:'', has_pets:false, smokes:false, price_range_min:0, price_range_max:0, show_price:false, phone:u.phone||'' };
      setProfile(tp ? { ...base,...tp,...u, score:tp.score } : { ...base,...u });
      const { data: r } = await supabase.from('recommendations').select('*').eq('tenant_id', tenantId).order('created_at', { ascending:false });
      setRecs(r || []);
      setLoading(false);
    };
    load();
  }, [id, isDemo]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#05A88C', borderTopColor: 'transparent' }} />
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center" dir="rtl">
      <div className="text-5xl mb-2">😕</div>
      <p className="font-black text-gray-900 text-xl">פרופיל לא נמצא</p>
      <p className="text-gray-400 text-sm">הקישור אינו תקין או שהפרופיל הוסר</p>
      <button onClick={() => navigate('/')} className="btn btn-brand btn-md mt-2">לדף הבית</button>
    </div>
  );
  if (!profile) return null;

  const score = profile.score;
  const isTrusted = score >= 75;
  const scoreColor = ScoreColor(score);
  const initials = profile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const verifiedCount = recs.filter(r => r.verified).length;

  const pills = [
    profile.has_guarantor && { emoji: '🛡️', label: 'ערב זמין' },
    !profile.has_pets    && { emoji: '🐾', label: 'ללא חיות' },
    !profile.smokes      && { emoji: '🚭', label: 'לא מעשן' },
    profile.years_renting >= 3 && { emoji: '🏠', label: `${profile.years_renting} שנות ניסיון` },
    profile.contract_preference === 'שנתיים' && { emoji: '📋', label: 'מעדיף חוזה ארוך' },
  ].filter(Boolean) as { emoji: string; label: string }[];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* ── Hero ── */}
      <div className="relative" style={{ background: 'linear-gradient(170deg,#0f172a 0%,#162032 100%)' }}>
        {/* subtle glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 120%, ${scoreColor}22 0%, transparent 70%)` }} />

        <div className="relative px-5 pt-12 pb-10 text-center">
          {/* Brand */}
          <div className="flex items-center justify-center gap-1.5 mb-8">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#05A88C' }}>
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-white/50 text-sm font-bold tracking-wide">RentScore</span>
          </div>

          {/* Avatar */}
          <div className="relative inline-block mb-5">
            <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-3xl font-black text-white border border-white/10" style={{ background: `${scoreColor}22` }}>
              {initials}
            </div>
            {isTrusted && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ background: '#059669' }}>
                <CheckCircle className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
            )}
          </div>

          {/* Name */}
          <h1 className="text-white text-2xl font-black mb-1">{profile.full_name}</h1>
          <p className="text-white/40 text-sm mb-4">
            {[profile.current_city, profile.employment_type].filter(Boolean).join(' · ')}
          </p>

          {/* Badges row */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
            {isTrusted && (
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ background: 'rgba(5,150,105,.2)', color: '#6EE7B7', border: '1px solid rgba(5,150,105,.3)' }}>
                <Shield className="w-3 h-3" />שוכר מאומת
              </span>
            )}
            {verifiedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ background: 'rgba(217,119,6,.2)', color: '#FCD34D', border: '1px solid rgba(217,119,6,.3)' }}>
                <Star className="w-3 h-3 fill-current" />{verifiedCount} המלצה מאומתת
              </span>
            )}
          </div>

          {/* Score */}
          <div className="flex flex-col items-center">
            <ScoreCircle score={score} size={130} color="#fff" bgColor="rgba(255,255,255,0.1)" />
            <div className="mt-2">
              <ScoreLabel score={score} />
            </div>
          </div>

          {/* Budget */}
          {profile.show_price && profile.price_range_min > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)' }}>
              <span className="text-white text-sm font-bold">
                תקציב ₪{profile.price_range_min.toLocaleString()}–{profile.price_range_max?.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Pills ── */}
      {pills.length > 0 && (
        <div className="px-4 mt-4">
          <div className="flex flex-wrap gap-2">
            {pills.map(p => <Pill key={p.label} emoji={p.emoji} label={p.label} />)}
          </div>
        </div>
      )}

      {/* ── Info ── */}
      <div className="px-4 mt-4">
        <p className="section-title">פרטי השוכר</p>
        <div className="card px-4">
          <InfoRow icon={MapPin}    label="עיר"           value={profile.current_city} />
          <InfoRow icon={Briefcase} label="תעסוקה"        value={profile.employment_type} />
          <InfoRow icon={Calendar}  label="שנות שכירות"   value={profile.years_renting ? `${profile.years_renting} שנים` : ''} />
          <InfoRow icon={Home}      label="מצב מגורים"    value={profile.housing_status} />
          <InfoRow icon={Users}     label="ערב"            value={profile.has_guarantor ? '✓ ערב זמין' : 'אין ערב'} />
          {profile.contract_preference && <InfoRow icon={Calendar} label="חוזה מועדף" value={profile.contract_preference} />}
        </div>
      </div>

      {/* ── Recommendations ── */}
      {recs.length > 0 && (
        <div className="px-4 mt-4">
          <p className="section-title">המלצות מבעלי נכסים ({recs.length})</p>
          <div className="space-y-2.5">
            {recs.map((rec, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-600 text-sm flex-shrink-0">
                      {rec.landlord_name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{rec.landlord_name}</p>
                      {rec.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: '#059669' }}>
                          <CheckCircle className="w-3 h-3" />מאומת על ידי בעל הנכס
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3.5 h-3.5 ${j < rec.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
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
            href={`https://wa.me/972${profile.phone.replace(/^0/,'')}?text=${encodeURIComponent(`שלום ${profile.full_name}, ראיתי את הפרופיל שלך ב-RentScore ואשמח לדבר`)}`}
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-black text-[15px] text-white"
            style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,.3)' }}
          >
            <MessageCircle className="w-5 h-5" />
            שלח הודעת WhatsApp
          </a>
          <a
            href={`tel:${profile.phone}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Phone className="w-4 h-4" />
            התקשר
          </a>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div className="mx-4 mt-4 rounded-2xl p-4 flex gap-3" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#D97706' }} />
        <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
          המלצות מאומתות אושרו ישירות על ידי בעל הנכס. שאר המידע הוצהר על ידי השוכר. מומלץ לבצע בדיקה עצמאית לפני חתימה.
        </p>
      </div>

      <div className="pb-10" />
    </div>
  );
}
