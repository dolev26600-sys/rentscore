import React, { useEffect, useState } from 'react';
import { Lock, ChevronLeft } from 'lucide-react';
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
  job_seniority?: string;
  housing_status?: string;
  has_guarantor?: boolean;
  contract_preference?: string;
  has_pets?: boolean;
  smokes?: boolean;
  current_occupation?: string;
  price_range_min?: number;
  price_range_max?: number;
  show_price?: boolean;
  score?: number;
  years_renting?: number;
  income_range?: string;
}

export default function TenantProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({});
  const [score, setScore] = useState(50);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('tenant_profiles').select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data) { setProfile(data); setScore(data.score || 50); }
      });
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
    } catch {
      toast.error('שגיאה בשמירה');
    } finally {
      setSaving(null);
    }
  };

  const progress = Math.round(((score - 50) / 50) * 100);

  const optionalFields = [
    {
      key: 'job_seniority', label: 'ותק בעבודה', points: 3,
      render: () => (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {SENIORITY.map(v => (
            <button
              key={v}
              onClick={() => saveField('job_seniority', v)}
              className={`py-2 rounded-lg text-sm font-medium border ${profile.job_seniority === v ? 'border-tenant-500 bg-tenant-50 text-tenant-700' : 'border-gray-200 text-gray-600'}`}
            >
              {v}
            </button>
          ))}
        </div>
      ),
    },
    {
      key: 'housing_status', label: 'מצב מגורים', points: 2,
      render: () => (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {HOUSING.map(v => (
            <button
              key={v}
              onClick={() => saveField('housing_status', v)}
              className={`py-2 rounded-lg text-sm font-medium border ${profile.housing_status === v ? 'border-tenant-500 bg-tenant-50 text-tenant-700' : 'border-gray-200 text-gray-600'}`}
            >
              {v}
            </button>
          ))}
        </div>
      ),
    },
    {
      key: 'contract_preference', label: 'העדפת חוזה', points: 2,
      render: () => (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {CONTRACT.map(v => (
            <button
              key={v}
              onClick={() => saveField('contract_preference', v)}
              className={`py-2 rounded-lg text-sm font-medium border ${profile.contract_preference === v ? 'border-tenant-500 bg-tenant-50 text-tenant-700' : 'border-gray-200 text-gray-600'}`}
            >
              {v}
            </button>
          ))}
        </div>
      ),
    },
    {
      key: 'has_guarantor', label: 'ערב זמין', points: 5,
      render: () => (
        <div className="flex gap-3 mt-2">
          {[true, false].map(v => (
            <button
              key={String(v)}
              onClick={() => saveField('has_guarantor', v)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border ${profile.has_guarantor === v ? 'border-tenant-500 bg-tenant-50 text-tenant-700' : 'border-gray-200 text-gray-600'}`}
            >
              {v ? 'כן' : 'לא'}
            </button>
          ))}
        </div>
      ),
    },
    {
      key: 'has_pets', label: 'יש חיות מחמד', points: 0,
      render: () => (
        <div className="flex gap-3 mt-2">
          {[false, true].map(v => (
            <button
              key={String(v)}
              onClick={() => saveField('has_pets', v)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border ${profile.has_pets === v ? 'border-tenant-500 bg-tenant-50 text-tenant-700' : 'border-gray-200 text-gray-600'}`}
            >
              {v ? 'כן' : 'לא'}
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="הפרופיל שלי" showBack={false} />

      {/* Score progress */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">ציון RentScore</span>
          <span className="font-black text-tenant-600 text-lg">{score}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-tenant-400 to-tenant-600 rounded-full transition-all duration-700"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {score < 70 ? 'השלם שדות נוספים כדי לשפר את הציון' : 'ציון מצוין! 🎉'}
        </p>
      </div>

      {/* Optional fields */}
      <div className="mx-4 mt-4">
        <h2 className="font-bold text-gray-800 mb-3">שפר את הפרופיל שלך</h2>
        <div className="space-y-3">
          {optionalFields.map(field => (
            <div key={field.key} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-800 text-sm">{field.label}</span>
                {field.points > 0 && (
                  <span className="text-xs bg-tenant-50 text-tenant-600 font-bold px-2 py-0.5 rounded-full">
                    +{field.points} נקודות
                  </span>
                )}
              </div>
              {field.render()}
              {saving === field.key && <p className="text-xs text-gray-400 mt-1">שומר...</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Verifications - locked */}
      <div className="mx-4 mt-4">
        <h2 className="font-bold text-gray-800 mb-3">אימותים</h2>
        {['אימות הכנסה', 'אימות זהות'].map(v => (
          <div key={v} className="bg-white rounded-xl p-4 flex justify-between items-center mb-2 shadow-sm opacity-70">
            <span className="text-sm text-gray-700 font-medium">{v}</span>
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
        ))}
        <p className="text-xs text-gray-400 text-center mt-2">אימותים יהיו זמינים בקרוב</p>
      </div>

      {/* Trust message */}
      <div className="mx-4 mt-4 bg-tenant-50 rounded-2xl p-4 border border-tenant-200">
        <p className="text-tenant-700 text-sm font-semibold text-center">
          הפרופיל שלך מוצג לבעלי נכסים רק כשאתה בוחר לשתף אותו
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
