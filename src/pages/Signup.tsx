import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Zap, Eye, EyeOff, ChevronRight, Home, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, hashPassword } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setUser } = useAuth();
  const isAgent = params.get('type') === 'agent';
  const refCode = params.get('ref') || '';
  const [userType, setUserType] = useState<'tenant' | 'landlord'>(
    params.get('type') === 'tenant' ? 'tenant' : 'landlord'
  );
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) return toast.error('נא למלא את כל השדות החובה');
    if (form.password.length < 6) return toast.error('סיסמה חייבת להיות לפחות 6 תווים');
    setLoading(true);
    try {
      const password_hash = await hashPassword(form.password);
      const { data, error } = await supabase.from('users')
        .insert({ full_name: form.full_name, email: form.email.toLowerCase().trim(), phone: form.phone.trim() || null, password_hash, user_type: userType, referred_by: refCode || null })
        .select().single();
      if (error) {
        if (error.code === '23505') toast.error('כתובת המייל כבר קיימת במערכת');
        else toast.error(`שגיאה ברישום: ${error.message}`);
        return;
      }
      setUser(data);
      toast.success('ברוך הבא ל-RentScore!');
      if (isAgent) { localStorage.setItem(`rentscore_agent_${data.id}`, '1'); navigate('/agent/home'); }
      else navigate(userType === 'tenant' ? '/tenant/onboarding' : '/landlord/onboarding');
    } finally { setLoading(false); }
  };

  const isTenant = userType === 'tenant';
  const accentColor = isTenant ? '#00B89F' : '#0A1C3D';

  return (
    <div className="min-h-screen flex flex-col" dir="rtl"
      style={{ background: 'linear-gradient(160deg,#060E1E 0%,#0E2240 60%,#0A2D3A 100%)' }}>

      {/* Back */}
      <div className="px-5 pt-12">
        <button onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm font-medium">
          <ChevronRight className="w-4 h-4" />
          חזרה
        </button>
      </div>

      {/* Brand */}
      <div className="px-6 pt-8 pb-5 text-center">
        <div className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#00B89F' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-white text-[22px] tracking-tight">RentScore</span>
        </div>
        <h1 className="text-[26px] font-black text-white leading-tight mb-2">
          {isAgent ? 'הרשמה לסוכנים' : 'יצירת חשבון חינמי'}
        </h1>
        <p className="text-white/40 text-sm">
          {isAgent ? 'גישה למאגר שוכרים מאומתים' : 'פרופיל שוכר מקצועי תוך 2 דקות'}
        </p>
      </div>

      <div className="flex-1 px-5 space-y-4">

        {/* Type selector */}
        {!isAgent && (
          <div className="flex gap-2">
            {([
              { type: 'tenant', label: 'שוכר', Icon: Home, desc: 'חינם תמיד' },
              { type: 'landlord', label: 'בעל נכס', Icon: Building2, desc: '79₪/בדיקה' },
            ] as const).map(({ type, label, Icon, desc }) => (
              <button key={type} onClick={() => setUserType(type)}
                className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-2xl border-2 transition-all ${
                  userType === type
                    ? 'border-transparent text-white' + (type === 'tenant' ? ' shadow-lg' : '')
                    : 'border-white/10 text-white/40'
                }`}
                style={userType === type ? { background: type === 'tenant' ? '#00B89F' : '#0A1C3D' } : { background: 'rgba(255,255,255,0.05)' }}>
                <Icon className="w-5 h-5" />
                <span className="font-black text-sm">{label}</span>
                <span className="text-[10px] opacity-70">{desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Form card */}
        <div className="card p-6 anim-pop">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'full_name', label: 'שם מלא', type: 'text', placeholder: 'ישראל ישראלי' },
              { key: 'email',     label: 'דוא"ל',   type: 'email', placeholder: 'you@example.com', dir: 'ltr' },
              { key: 'phone',     label: 'טלפון (אופציונלי)', type: 'tel', placeholder: '050-0000000' },
            ].map(f => (
              <div key={f.key}>
                <label className="label mb-2 block">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="input-field" dir={(f as any).dir || 'rtl'} />
              </div>
            ))}

            <div>
              <label className="label mb-2 block">סיסמה</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} placeholder="לפחות 6 תווים"
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-field" style={{ paddingLeft: 46 }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`btn btn-lg w-full mt-2 ${isTenant ? 'btn-primary' : 'btn-dark'}`}>
              {loading ? <><span className="spinner" /> נרשם...</> : 'הרשמה חינמית'}
            </button>
          </form>

          <div className="divider my-4" />

          <p className="text-center text-sm text-gray-500">
            כבר רשום?{' '}
            <Link to="/login" className="font-bold" style={{ color: accentColor }}>התחבר</Link>
          </p>
        </div>

      </div>
      <div className="pb-12" />
    </div>
  );
}
