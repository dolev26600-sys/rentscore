import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { calculateTenantScore } from '../../lib/score';
import ProgressDots from '../../components/ProgressDots';
import ScoreCircle from '../../components/ScoreCircle';

const CITIES = ['תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'באר שבע', 'בני ברק', 'רמת גן', 'אחר'];
const EMPLOYMENT = ['שכיר', 'עצמאי', 'סטודנט', 'פנסיונר', 'לא עובד'];
const INCOME = ['עד 5,000', '5,000-10,000', '10,000-15,000', '15,000-20,000', '20,000+'];

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
    // Step 0 - years renting
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">כמה שנים אתה שוכר?</h2>
      <div className="w-24 h-24 bg-tenant-100 rounded-full flex items-center justify-center">
        <span className="text-4xl font-black text-tenant-600">{data.years_renting}</span>
      </div>
      <input
        type="range" min={0} max={10} value={data.years_renting}
        onChange={e => setData(p => ({ ...p, years_renting: +e.target.value }))}
        className="w-full accent-tenant-500"
      />
      <div className="flex justify-between w-full text-sm text-gray-400">
        <span>0 שנים</span><span>10+ שנים</span>
      </div>
      <button onClick={next} className="w-full bg-tenant-600 text-white font-bold py-4 rounded-2xl text-lg">
        המשך
      </button>
    </div>,

    // Step 1 - employment
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">מה סטטוס התעסוקה שלך?</h2>
      <div className="grid grid-cols-2 gap-3">
        {EMPLOYMENT.map(emp => (
          <button
            key={emp}
            onClick={() => setData(p => ({ ...p, employment_type: emp }))}
            className={`py-3 rounded-xl font-semibold border-2 transition-all ${
              data.employment_type === emp
                ? 'border-tenant-500 bg-tenant-50 text-tenant-700'
                : 'border-gray-200 text-gray-600'
            }`}
          >
            {emp}
          </button>
        ))}
      </div>
      <div className="flex gap-3 mt-2">
        <button onClick={back} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl">חזרה</button>
        <button onClick={next} disabled={!data.employment_type} className="flex-1 bg-tenant-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">המשך</button>
      </div>
    </div>,

    // Step 2 - city
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">באיזה עיר אתה גר?</h2>
      <div className="grid grid-cols-2 gap-3">
        {CITIES.map(city => (
          <button
            key={city}
            onClick={() => setData(p => ({ ...p, current_city: city }))}
            className={`py-3 rounded-xl font-semibold border-2 transition-all ${
              data.current_city === city
                ? 'border-tenant-500 bg-tenant-50 text-tenant-700'
                : 'border-gray-200 text-gray-600'
            }`}
          >
            {city}
          </button>
        ))}
      </div>
      <div className="flex gap-3 mt-2">
        <button onClick={back} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl">חזרה</button>
        <button onClick={next} disabled={!data.current_city} className="flex-1 bg-tenant-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">המשך</button>
      </div>
    </div>,

    // Step 3 - income
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">מה טווח ההכנסה החודשית?</h2>
      <p className="text-gray-500 text-sm text-center">המידע נשמר בפרטיות ומוצג רק אם תבחר</p>
      <div className="space-y-3">
        {INCOME.map(inc => (
          <button
            key={inc}
            onClick={() => setData(p => ({ ...p, income_range: inc }))}
            className={`w-full py-3 rounded-xl font-semibold border-2 transition-all ${
              data.income_range === inc
                ? 'border-tenant-500 bg-tenant-50 text-tenant-700'
                : 'border-gray-200 text-gray-600'
            }`}
          >
            ₪{inc}
          </button>
        ))}
      </div>
      <div className="flex gap-3 mt-2">
        <button onClick={back} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl">חזרה</button>
        <button onClick={finish} disabled={!data.income_range || loading} className="flex-1 bg-tenant-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">
          {loading ? 'שומר...' : 'חשב ציון'}
        </button>
      </div>
    </div>,

    // Step 4 - completion
    <div className="flex flex-col items-center gap-6 text-center">
      <CheckCircle className="w-16 h-16 text-tenant-500" />
      <h2 className="text-2xl font-bold text-gray-800">הפרופיל שלך מוכן!</h2>
      <ScoreCircle score={score} />
      <div className="bg-tenant-50 rounded-2xl p-4 w-full">
        <p className="text-tenant-700 font-semibold text-sm">
          ציון ה-RentScore שלך הוא <strong>{score}</strong> מתוך 100
        </p>
        <p className="text-tenant-600 text-xs mt-1">השלם את הפרופיל שלך כדי לשפר את הציון</p>
      </div>
      <button
        onClick={() => navigate('/tenant/home')}
        className="w-full bg-tenant-600 text-white font-bold py-4 rounded-2xl text-lg"
      >
        כניסה לדשבורד
      </button>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-tenant-600 pt-10 pb-6 px-6">
        <h1 className="text-white text-xl font-bold text-center mb-4">בוא נבנה את הפרופיל שלך</h1>
        {step < 4 && <ProgressDots total={4} current={step} />}
      </div>
      <div className="flex-1 px-6 py-8">
        {steps[step]}
      </div>
    </div>
  );
}
