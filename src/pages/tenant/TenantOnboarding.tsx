import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle, ChevronLeft, Home, Briefcase, MapPin, DollarSign, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { calculateTenantScore } from '../../lib/score';
import ScoreCircle from '../../components/ScoreCircle';

const CITIES = ['תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'באר שבע', 'בני ברק', 'רמת גן', 'אחר'];
const EMPLOYMENT = ['שכיר', 'עצמאי', 'סטודנט', 'פנסיונר', 'לא עובד'];
const INCOME = ['עד 5,000', '5,000-10,000', '10,000-15,000', '15,000-20,000', '20,000+'];

const TOTAL_STEPS = 4;

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
            i <= current ? 'bg-teal-500' : 'bg-white/30'
          }`}
        />
      ))}
    </div>
  );
}

export default function TenantOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    years_renting: 2,
    employment_type: '',
    current_city: '',
    income_range: '',
  });
  const [score, setScore] = useState(50);
  const [loading, setLoading] = useState(false);

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const finish = async () => {
    setLoading(true);
    try {
      const finalScore = calculateTenantScore({ years_renting: data.years_renting, income_range: data.income_range });
      const { error } = await supabase.from('tenant_profiles').upsert({
        user_id: user!.id,
        ...data,
        score: finalScore,
      });
      if (error) { toast.error('שגיאה בשמירה'); return; }
      setScore(finalScore);
      next();
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    // 0 - years
    <div key="years" className="flex flex-col items-center gap-7 animate-fade-in-up">
      <div className="text-center">
        <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Home className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">כמה שנים אתה שוכר?</h2>
        <p className="text-teal-200 text-sm">ניסיון שכירות מגדיל את הציון שלך</p>
      </div>

      <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-elevated">
        <span className="text-5xl font-black text-teal-600">{data.years_renting}</span>
      </div>

      <div className="w-full px-2">
        <input
          type="range" min={0} max={10} value={data.years_renting}
          onChange={e => setData(p => ({ ...p, years_renting: +e.target.value }))}
          className="w-full accent-white h-2"
        />
        <div className="flex justify-between text-teal-200 text-xs mt-2">
          <span>0 שנים</span><span>10+ שנים</span>
        </div>
      </div>

      <button onClick={next} className="w-full bg-white text-teal-700 font-black py-4 rounded-2xl text-[16px] shadow-elevated">
        המשך ←
      </button>
    </div>,

    // 1 - employment
    <div key="emp" className="flex flex-col gap-5 animate-fade-in-up">
      <div className="text-center">
        <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">סטטוס תעסוקה</h2>
        <p className="text-teal-200 text-sm">בחר את המצב שמתאר אותך</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {EMPLOYMENT.map(emp => (
          <button
            key={emp}
            onClick={() => setData(p => ({ ...p, employment_type: emp }))}
            className={`py-3.5 rounded-2xl font-bold text-[14px] transition-all ${
              data.employment_type === emp
                ? 'bg-white text-teal-700 shadow-elevated scale-[1.02]'
                : 'bg-white/15 text-white border border-white/20'
            }`}
          >
            {emp}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={back} className="flex-1 border border-white/30 text-white font-bold py-3.5 rounded-2xl">חזרה</button>
        <button onClick={next} disabled={!data.employment_type} className="flex-2 bg-white text-teal-700 font-black py-3.5 rounded-2xl flex-1 disabled:opacity-40">המשך ←</button>
      </div>
    </div>,

    // 2 - city
    <div key="city" className="flex flex-col gap-5 animate-fade-in-up">
      <div className="text-center">
        <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">עיר מגורים</h2>
        <p className="text-teal-200 text-sm">איפה אתה מחפש לשכור?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {CITIES.map(city => (
          <button
            key={city}
            onClick={() => setData(p => ({ ...p, current_city: city }))}
            className={`py-3 rounded-2xl font-bold text-[14px] transition-all ${
              data.current_city === city
                ? 'bg-white text-teal-700 shadow-elevated scale-[1.02]'
                : 'bg-white/15 text-white border border-white/20'
            }`}
          >
            {city}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={back} className="flex-1 border border-white/30 text-white font-bold py-3.5 rounded-2xl">חזרה</button>
        <button onClick={next} disabled={!data.current_city} className="flex-1 bg-white text-teal-700 font-black py-3.5 rounded-2xl disabled:opacity-40">המשך ←</button>
      </div>
    </div>,

    // 3 - income
    <div key="income" className="flex flex-col gap-5 animate-fade-in-up">
      <div className="text-center">
        <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">הכנסה חודשית</h2>
        <p className="text-teal-200 text-sm">מוצג רק אם תבחר להציג</p>
      </div>
      <div className="space-y-2.5">
        {INCOME.map(inc => (
          <button
            key={inc}
            onClick={() => setData(p => ({ ...p, income_range: inc }))}
            className={`w-full py-3.5 rounded-2xl font-bold text-[14px] transition-all flex items-center justify-between px-5 ${
              data.income_range === inc
                ? 'bg-white text-teal-700 shadow-elevated'
                : 'bg-white/15 text-white border border-white/20'
            }`}
          >
            <span>₪{inc}</span>
            {data.income_range === inc && <CheckCircle className="w-5 h-5" />}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={back} className="flex-1 border border-white/30 text-white font-bold py-3.5 rounded-2xl">חזרה</button>
        <button onClick={finish} disabled={!data.income_range || loading} className="flex-1 bg-white text-teal-700 font-black py-3.5 rounded-2xl disabled:opacity-40">
          {loading ? 'חושב...' : 'חשב ציון ←'}
        </button>
      </div>
    </div>,

    // 4 - done
    <div key="done" className="flex flex-col items-center gap-6 text-center animate-scale-in">
      <div className="relative">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-elevated mx-auto">
          <CheckCircle className="w-10 h-10 text-teal-500" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-black text-white mb-1">הפרופיל שלך מוכן!</h2>
        <p className="text-teal-200 text-sm">הציון שלך מחושב ומוכן לשיתוף</p>
      </div>
      <div className="flex justify-center">
        <ScoreCircle score={score} size={150} color="#fff" bgColor="rgba(255,255,255,0.2)" />
      </div>
      <div className="bg-white/15 rounded-2xl p-4 w-full border border-white/20">
        <p className="text-white font-bold text-sm">
          ציון {score} מתוך 100 — {score >= 70 ? '🎉 ציון מצוין!' : 'השלם פרופיל לציון גבוה יותר'}
        </p>
        <p className="text-teal-200 text-xs mt-1">תוכל לשפר אותו בכל זמן</p>
      </div>
      <button
        onClick={() => navigate('/tenant/home')}
        className="w-full bg-white text-teal-700 font-black py-4 rounded-2xl text-[16px] shadow-elevated"
      >
        <Zap className="w-5 h-5 inline ml-1" />
        כניסה לדשבורד
      </button>
    </div>,
  ];

  return (
    <div className="min-h-screen flex flex-col" dir="rtl"
      style={{ background: 'linear-gradient(160deg, #0f766e 0%, #14b8a6 60%, #0d9488 100%)' }}>

      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-black text-[15px]">RentScore</span>
          </div>
          {step < TOTAL_STEPS && (
            <span className="text-teal-200 text-sm font-medium">{step + 1} / {TOTAL_STEPS}</span>
          )}
        </div>
        {step < TOTAL_STEPS && <ProgressBar current={step} />}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-10">
        {steps[step]}
      </div>
    </div>
  );
}
