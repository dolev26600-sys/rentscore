import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Star, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { calculateTenantScore } from '../../lib/score';
import PageHeader from '../../components/PageHeader';
import BottomNav from '../../components/BottomNav';

const SENIORITY = ['פחות משנה', '1-3 שנים', '3-5 שנים', '5+ שנים'];
const HOUSING = ['גר לבד', 'עם שותפים', 'עם משפחה', 'מעונות'];
const CONTRACT = ['שנה', 'שנתיים', 'גמיש'];

interface ProfileData {
  job_seniority?: string; housing_status?: string; has_guarantor?: boolean;
  contract_preference?: string; has_pets?: boolean; smokes?: boolean;
  current_occupation?: string; price_range_min?: number; price_range_max?: number;
  show_price?: boolean; score?: number; years_renting?: number; income_range?: string;
}

function ChoiceBtn({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className="py-2 rounded-xl text-sm font-bold border-2 transition-all"
      style={selected
        ? { borderColor: '#00B89F', background: 'rgba(0,184,159,0.08)', color: '#007D6B' }
        : { borderColor: '#E2E8F0', background: '#fff', color: '#5A6A7E' }}>
      {label}
    </button>
  );
}

export default function TenantProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({});
  const [score, setScore] = useState(50);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('tenant_profiles').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) { setProfile(data); setScore(data.score || 50); } });
  }, [user]);

  const saveField = async (field: string, value: unknown) => {
    setSaving(field);
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    const newScore = calculateTenantScore(updated);
    try {
      await supabase.from('tenant_profiles').update({ [field]: value, score: newScore }).eq('user_id', user!.id);
      setScore(newScore);
      toast.success('נשמר!');
    } catch { toast.error('שגיאה בשמירה'); }
    finally { setSaving(null); }
  };

  const fields = [
    {
      key: 'job_seniority', label: 'ותק בעבודה', points: 3,
      render: () => (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {SENIORITY.map(v => <ChoiceBtn key={v} label={v} selected={profile.job_seniority === v} onClick={() => saveField('job_seniority', v)} />)}
        </div>
      ),
    },
    {
      key: 'housing_status', label: 'מצב מגורים', points: 2,
      render: () => (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {HOUSING.map(v => <ChoiceBtn key={v} label={v} selected={profile.housing_status === v} onClick={() => saveField('housing_status', v)} />)}
        </div>
      ),
    },
    {
      key: 'contract_preference', label: 'העדפת חוזה', points: 2,
      render: () => (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {CONTRACT.map(v => <ChoiceBtn key={v} label={v} selected={profile.contract_preference === v} onClick={() => saveField('contract_preference', v)} />)}
        </div>
      ),
    },
    {
      key: 'has_guarantor', label: 'ערב זמין', points: 5,
      render: () => (
        <div className="flex gap-2 mt-3">
          <ChoiceBtn label="כן, יש לי ערב" selected={profile.has_guarantor === true} onClick={() => saveField('has_guarantor', true)} />
          <ChoiceBtn label="לא" selected={profile.has_guarantor === false} onClick={() => saveField('has_guarantor', false)} />
        </div>
      ),
    },
    {
      key: 'has_pets', label: 'חיות מחמד', points: 0,
      render: () => (
        <div className="flex gap-2 mt-3">
          <ChoiceBtn label="יש לי חיות" selected={profile.has_pets === true} onClick={() => saveField('has_pets', true)} />
          <ChoiceBtn label="אין חיות" selected={profile.has_pets === false} onClick={() => saveField('has_pets', false)} />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: '#F0F4FA' }} dir="rtl">
      <PageHeader title="הפרופיל שלי" showBack={false} />

      {/* Score card */}
      <div className="mx-4 mt-4">
        <div className="card p-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm text-gray-500 mb-0.5">ציון RentScore שלך</p>
              <p className="text-[36px] font-black leading-none" style={{ color: '#0A1C3D' }}>{score}</p>
            </div>
            <div className="text-right">
              {score >= 85 ? <span className="badge badge-green">מצוין</span>
                : score >= 70 ? <span className="badge badge-teal">טוב מאוד</span>
                : score >= 55 ? <span className="badge badge-amber">טוב</span>
                : <span className="badge badge-gray">בסיסי</span>}
              <p className="text-xs text-gray-400 mt-1.5">מתוך 100</p>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${score}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {score < 70 ? 'השלם שדות נוספים כדי לשפר את הציון' : 'ציון מצוין! שתף את הפרופיל שלך 🎉'}
          </p>
        </div>
      </div>

      {/* Request recommendation CTA */}
      <div className="mx-4 mt-3">
        <button onClick={() => navigate('/tenant/request-rec')}
          className="w-full rounded-2xl px-5 py-4 flex items-center justify-between text-white"
          style={{ background: 'linear-gradient(135deg,#D97706,#B45309)', boxShadow: '0 4px 16px rgba(217,119,6,0.3)' }}>
          <div className="text-right">
            <p className="font-black text-[15px]">בקש המלצה מאומתת</p>
            <p className="text-amber-100 text-xs mt-0.5">שלח לבעל נכס קודם — +5 נקודות לציון</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-6 h-6 opacity-90" />
            <ChevronLeft className="w-4 h-4 opacity-60" />
          </div>
        </button>
      </div>

      {/* Profile fields */}
      <div className="mx-4 mt-4">
        <p className="section-label mb-3">שפר את הפרופיל</p>
        <div className="space-y-3">
          {fields.map(field => (
            <div key={field.key} className="card p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-sm">{field.label}</span>
                {field.points > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#CCFBF1', color: '#115E59' }}>
                    +{field.points} נקודות
                  </span>
                )}
              </div>
              {field.render()}
              {saving === field.key && <p className="text-xs text-gray-400 mt-2">שומר...</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Verifications */}
      <div className="mx-4 mt-4">
        <p className="section-label mb-3">אימותים</p>
        {['אימות הכנסה (+8 נקודות)', 'אימות זהות (+5 נקודות)'].map(v => (
          <div key={v} className="card px-4 py-3.5 flex justify-between items-center mb-2 opacity-50">
            <span className="text-sm text-gray-700 font-medium">{v}</span>
            <Lock className="w-4 h-4 text-gray-400" />
          </div>
        ))}
        <p className="text-xs text-gray-400 text-center mt-2">אימותים יהיו זמינים בקרוב</p>
      </div>

      <div className="mx-4 mt-4 rounded-2xl p-4 text-center" style={{ background: 'rgba(0,184,159,0.07)', border: '1px solid rgba(0,184,159,0.2)' }}>
        <p className="text-sm font-semibold" style={{ color: '#007D6B' }}>
          הפרופיל שלך מוצג לבעלי נכסים רק כשאתה בוחר לשתף אותו
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
