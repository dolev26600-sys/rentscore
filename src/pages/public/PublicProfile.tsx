import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, Star, Shield, Briefcase, MapPin, Calendar, Users, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProfileData {
  id: string; full_name: string; score: number; years_renting: number;
  current_city: string; employment_type: string; income_range: string;
  job_seniority: string; housing_status: string; has_guarantor: boolean;
  contract_preference: string; has_pets: boolean; smokes: boolean;
  price_range_min: number; price_range_max: number; show_price: boolean; phone: string;
}

function scoreColor(score: number) {
  if (score >= 85) return '#00D4BA';
  if (score >= 70) return '#00B89F';
  if (score >= 55) return '#F59E0B';
  return '#6B7280';
}

function scoreLabel(score: number) {
  if (score >= 85) return 'מצוין';
  if (score >= 70) return 'טוב מאוד';
  if (score >= 55) return 'טוב';
  return 'בסיסי';
}

function ScoreRing({ score }: { score: number }) {
  const color = scoreColor(score);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
        <circle cx="65" cy="65" r={r} fill="none" stroke="url(#sg)" strokeWidth="9"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
        <defs>
          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D4BA" />
            <stop offset="100%" stopColor="#6B3FFF" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#fff', fontSize: 40, fontWeight: 900, lineHeight: 1 }}>{score}</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>/ 100</div>
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
        setProfile({ id: 'demo', full_name: 'ישראל ישראלי', score: 82, years_renting: 4, current_city: 'תל אביב', employment_type: 'שכיר', income_range: '10,000–15,000', job_seniority: '3–5 שנים', housing_status: 'גר לבד', has_guarantor: true, contract_preference: 'שנה', has_pets: false, smokes: false, price_range_min: 4500, price_range_max: 6500, show_price: true, phone: '' });
        setRecs([
          { landlord_name: 'דוד לוי', rating: 5, comment: 'שוכר מצוין, שמר על הדירה ושילם תמיד בזמן', verified: true },
          { landlord_name: 'רחל כהן', rating: 5, comment: 'תקשורת מעולה, ממליצה בחום', verified: false },
        ]);
        setLoading(false); return;
      }
      let tenantId: string;
      if (id?.startsWith('user-')) { tenantId = id.replace('user-', ''); }
      else {
        const { data: s } = await supabase.from('shared_profiles').select('tenant_id').eq('share_token', id).single();
        if (!s) { setError(true); setLoading(false); return; }
        tenantId = s.tenant_id;
      }
      const { data: u } = await supabase.from('users').select('*').eq('id', tenantId).single();
      if (!u) { setError(true); setLoading(false); return; }
      const { data: tp } = await supabase.from('tenant_profiles').select('*').eq('user_id', tenantId).single();
      const base = { id: tenantId, full_name: u.full_name, score: 50, years_renting: 0, current_city: '', employment_type: '', income_range: '', job_seniority: '', housing_status: '', has_guarantor: false, contract_preference: '', has_pets: false, smokes: false, price_range_min: 0, price_range_max: 0, show_price: false, phone: u.phone || '' };
      setProfile(tp ? { ...base, ...tp, ...u, score: tp.score } : { ...base, ...u });
      const { data: r } = await supabase.from('recommendations').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false });
      setRecs(r || []);
      setLoading(false);
    };
    load();
  }, [id, isDemo]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#18243A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(0,212,186,0.3)', borderTopColor: '#00D4BA', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (error) return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#18243A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 24px', textAlign: 'center', fontFamily: "'Heebo', sans-serif" }}>
      <div style={{ fontSize: 56 }}>😕</div>
      <p style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: 0 }}>פרופיל לא נמצא</p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>הקישור אינו תקין או שהפרופיל הוסר</p>
      <button onClick={() => navigate('/')} style={{ marginTop: 8, background: 'linear-gradient(135deg,#00D4BA,#00A896)', border: 'none', borderRadius: 14, padding: '14px 28px', color: '#fff', fontWeight: 900, fontSize: 15, fontFamily: 'inherit', cursor: 'pointer' }}>לדף הבית</button>
    </div>
  );

  if (!profile) return null;

  const score = profile.score;
  const color = scoreColor(score);
  const isTrusted = score >= 75;
  const initials = profile.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2);
  const verifiedCount = recs.filter(r => r.verified).length;

  const pills = [
    profile.has_guarantor && { emoji: '🛡️', label: 'ערב זמין' },
    !profile.has_pets && { emoji: '🐾', label: 'ללא חיות' },
    !profile.smokes && { emoji: '🚭', label: 'לא מעשן' },
    profile.years_renting >= 3 && { emoji: '🏠', label: `${profile.years_renting} שנות ניסיון` },
    profile.contract_preference === 'שנתיים' && { emoji: '📋', label: 'מעדיף חוזה ארוך' },
  ].filter(Boolean) as { emoji: string; label: string }[];

  const infoRows = [
    { icon: MapPin, label: 'עיר', value: profile.current_city },
    { icon: Briefcase, label: 'תעסוקה', value: profile.employment_type },
    { icon: Calendar, label: 'שנות שכירות', value: profile.years_renting ? `${profile.years_renting} שנים` : '' },
    { icon: Users, label: 'ערב', value: profile.has_guarantor ? '✓ ערב זמין' : 'אין ערב' },
    ...(profile.contract_preference ? [{ icon: Calendar, label: 'חוזה מועדף', value: profile.contract_preference }] : []),
  ].filter(r => r.value);

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#18243A', fontFamily: "'Heebo', sans-serif", overflowX: 'hidden' }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${color}18 0%, transparent 65%)`, filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '-60px', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,63,255,0.08) 0%, transparent 65%)', filter: 'blur(30px)' }} />
      </div>

      {/* Hero section */}
      <div style={{ position: 'relative', zIndex: 1, padding: '48px 24px 32px', textAlign: 'center' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 28, height: 28, borderRadius: 10, background: 'linear-gradient(135deg,#00D4BA,#00A896)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 700, letterSpacing: '0.5px' }}>RentScore</span>
        </div>

        {/* Avatar */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
          <div style={{ width: 88, height: 88, borderRadius: 28, background: `${color}22`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, color: '#fff', margin: '0 auto' }}>
            {initials}
          </div>
          {isTrusted && (
            <div style={{ position: 'absolute', bottom: -6, right: -6, width: 28, height: 28, borderRadius: 10, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(5,150,105,0.4)' }}>
              <CheckCircle size={15} color="#fff" />
            </div>
          )}
        </div>

        {/* Name */}
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.5px' }}>{profile.full_name}</h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '0 0 16px' }}>
          {[profile.current_city, profile.employment_type].filter(Boolean).join(' · ')}
        </p>

        {/* Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {isTrusted && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 700, background: 'rgba(5,150,105,0.15)', color: '#6EE7B7', border: '1px solid rgba(5,150,105,0.25)' }}>
              <Shield size={12} />שוכר מאומת
            </span>
          )}
          {verifiedCount > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.25)' }}>
              <Star size={12} fill="currentColor" />{verifiedCount} המלצה מאומתת
            </span>
          )}
        </div>

        {/* Score ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <ScoreRing score={score} />
          <span style={{ color: color, fontWeight: 800, fontSize: 15 }}>{scoreLabel(score)}</span>
        </div>

        {/* Budget */}
        {profile.show_price && profile.price_range_min > 0 && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 14, padding: '10px 18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>
              תקציב ₪{profile.price_range_min.toLocaleString()}–{profile.price_range_max?.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Pills */}
      {pills.length > 0 && (
        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {pills.map(p => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '7px 14px' }}>
                <span style={{ fontSize: 13 }}>{p.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info section */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 20px', marginBottom: 16 }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>פרטי השוכר</p>
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden' }}>
          {infoRows.map((row, i) => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < infoRows.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: 12, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <row.icon size={15} color="rgba(255,255,255,0.4)" />
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, margin: '0 0 2px', letterSpacing: '0.3px' }}>{row.label}</p>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recs.length > 0 && (
        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px', marginBottom: 16 }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>המלצות מבעלי נכסים ({recs.length})</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recs.map((rec, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 14, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 14, flexShrink: 0 }}>
                      {rec.landlord_name?.[0]}
                    </div>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: '0 0 3px' }}>{rec.landlord_name}</p>
                      {rec.verified && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#00D4BA', fontSize: 11, fontWeight: 700 }}>
                          <CheckCircle size={11} />מאומת על ידי בעל הנכס
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={13} color={j < rec.rating ? '#F59E0B' : 'rgba(255,255,255,0.1)'} fill={j < rec.rating ? '#F59E0B' : 'none'} />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>"{rec.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {!isDemo && profile.phone && (
        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href={`https://wa.me/972${profile.phone.replace(/^0/, '')}?text=${encodeURIComponent(`שלום ${profile.full_name}, ראיתי את הפרופיל שלך ב-RentScore ואשמח לדבר`)}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '16px', borderRadius: 18, fontWeight: 900, fontSize: 15, color: '#fff', textDecoration: 'none', background: '#25D366', boxShadow: '0 6px 20px rgba(37,211,102,0.25)' }}
          >
            <MessageCircle size={20} />
            שלח הודעת WhatsApp
          </a>
          <a
            href={`tel:${profile.phone}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px', borderRadius: 18, fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Phone size={16} />
            התקשר
          </a>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ position: 'relative', zIndex: 1, margin: '0 20px 20px', borderRadius: 18, padding: '14px 18px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', gap: 12 }}>
        <Shield size={15} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ color: 'rgba(245,158,11,0.8)', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
          המלצות מאומתות אושרו ישירות על ידי בעל הנכס. שאר המידע הוצהר על ידי השוכר. מומלץ לבצע בדיקה עצמאית לפני חתימה.
        </p>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}
