import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ProgressDots from '../../components/ProgressDots';

const CITIES = ['תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'באר שבע', 'אחר'];

export default function LandlordOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    property_count: 1,
    areas: [] as string[],
    bio: '',
    requires_guarantor: false,
    allows_pets: false,
    allows_children: true,
    preferred_tenant: '',
  });
  const [loading, setLoading] = useState(false);

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const finish = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('landlord_profiles').upsert({
        user_id: user!.id,
        ...data,
        score: 50,
        experience_years: data.property_count,
        deposit_return: 100,
        response_time: '24 שעות',
      });
      if (error) { toast.error('שגיאה בשמירה'); return; }
      next();
    } finally {
      setLoading(false);
    }
  };

  const toggleCity = (city: string) => {
    setData(p => ({
      ...p,
      areas: p.areas.includes(city) ? p.areas.filter(c => c !== city) : [...p.areas, city],
    }));
  };

  const steps = [
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">כמה נכסים יש לך?</h2>
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => setData(p => ({ ...p, property_count: Math.max(1, p.property_count - 1) }))}
          className="w-12 h-12 bg-gray-200 rounded-full text-xl font-bold"
        >-</button>
        <span className="text-5xl font-black text-landlord-500">{data.property_count}</span>
        <button
          onClick={() => setData(p => ({ ...p, property_count: p.property_count + 1 }))}
          className="w-12 h-12 bg-landlord-500 text-white rounded-full text-xl font-bold"
        >+</button>
      </div>
      <button onClick={next} className="w-full bg-landlord-500 text-white font-bold py-4 rounded-2xl text-lg">המשך</button>
    </div>,

    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">באיזה אזורים יש לך נכסים?</h2>
      <div className="grid grid-cols-2 gap-3">
        {CITIES.map(city => (
          <button
            key={city}
            onClick={() => toggleCity(city)}
            className={`py-3 rounded-xl font-semibold border-2 transition-all ${
              data.areas.includes(city)
                ? 'border-landlord-500 bg-landlord-50 text-landlord-700'
                : 'border-gray-200 text-gray-600'
            }`}
          >
            {city}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={back} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl">חזרה</button>
        <button onClick={next} disabled={data.areas.length === 0} className="flex-1 bg-landlord-500 text-white font-bold py-3 rounded-xl disabled:opacity-50">המשך</button>
      </div>
    </div>,

    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">ספר על עצמך</h2>
      <textarea
        rows={4}
        placeholder="בעל נכס מנוסה, מגיב מהר לבעיות, מחזיר פיקדון במלואו..."
        value={data.bio}
        onChange={e => setData(p => ({ ...p, bio: e.target.value }))}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-landlord-500 resize-none"
      />
      <div className="flex gap-3">
        <button onClick={back} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl">חזרה</button>
        <button onClick={next} className="flex-1 bg-landlord-500 text-white font-bold py-3 rounded-xl">המשך</button>
      </div>
    </div>,

    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">דרישות מהשוכר</h2>
      {[
        { key: 'requires_guarantor', label: 'דורש ערב' },
        { key: 'allows_pets', label: 'מאפשר חיות מחמד' },
        { key: 'allows_children', label: 'מאפשר ילדים' },
      ].map(req => (
        <div key={req.key} className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm">
          <span className="font-semibold text-gray-800">{req.label}</span>
          <button
            onClick={() => setData(p => ({ ...p, [req.key]: !(p as any)[req.key] }))}
            className={`w-12 h-6 rounded-full transition-colors ${(data as any)[req.key] ? 'bg-landlord-500' : 'bg-gray-200'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow mx-0.5 transition-transform ${(data as any)[req.key] ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      ))}
      <div className="flex gap-3">
        <button onClick={back} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl">חזרה</button>
        <button onClick={finish} disabled={loading} className="flex-1 bg-landlord-500 text-white font-bold py-3 rounded-xl disabled:opacity-50">
          {loading ? 'שומר...' : 'סיום'}
        </button>
      </div>
    </div>,

    <div className="flex flex-col items-center gap-6 text-center">
      <CheckCircle className="w-16 h-16 text-landlord-500" />
      <h2 className="text-2xl font-bold text-gray-800">ברוך הבא!</h2>
      <p className="text-gray-600">הפרופיל שלך מוכן. כעת תוכל להוסיף נכסים ולנהל שוכרים.</p>
      <button onClick={() => navigate('/landlord/home')} className="w-full bg-landlord-500 text-white font-bold py-4 rounded-2xl text-lg">
        כניסה לדשבורד
      </button>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-landlord-500 pt-10 pb-6 px-6">
        <h1 className="text-white text-xl font-bold text-center mb-4">הגדרת פרופיל בעל נכס</h1>
        {step < 4 && <ProgressDots total={4} current={step} color="bg-landlord-100" />}
      </div>
      <div className="flex-1 px-6 py-8">{steps[step]}</div>
    </div>
  );
}
