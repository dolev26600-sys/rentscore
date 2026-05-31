import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Home, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, hashPassword } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setUser } = useAuth();
  const [userType, setUserType] = useState<'tenant' | 'landlord'>(
    (params.get('type') as 'tenant' | 'landlord') || 'tenant'
  );
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) {
      return toast.error('נא למלא את כל השדות החובה');
    }
    if (form.password.length < 6) return toast.error('סיסמה חייבת להיות לפחות 6 תווים');
    setLoading(true);
    try {
      const password_hash = await hashPassword(form.password);
      const email = form.email.toLowerCase().trim();
      const phone = form.phone.trim() || null;
      const { data, error } = await supabase
        .from('users')
        .insert({ full_name: form.full_name, email, phone, password_hash, user_type: userType })
        .select()
        .single();
      if (error) {
        console.error('Signup error:', error);
        if (error.code === '23505') toast.error('כתובת המייל כבר קיימת במערכת');
        else toast.error(`שגיאה ברישום: ${error.message}`);
        return;
      }
      setUser(data);
      toast.success('ברוך הבא ל-RentScore!');
      navigate(userType === 'tenant' ? '/tenant/onboarding' : '/landlord/onboarding');
    } finally {
      setLoading(false);
    }
  };

  const isTenant = userType === 'tenant';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className={`${isTenant ? 'bg-gradient-to-b from-tenant-700 to-tenant-600' : 'bg-gradient-to-b from-landlord-600 to-landlord-500'} pt-12 pb-10 px-6 text-center`}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
            <Home className={`w-6 h-6 ${isTenant ? 'text-tenant-600' : 'text-landlord-600'}`} />
          </div>
          <span className="text-white font-black text-2xl">RentScore</span>
        </div>
        <h1 className="text-white text-xl font-bold opacity-90">יצירת חשבון חדש</h1>
      </div>

      <div className="flex-1 px-6 py-6">
        {/* Type selector */}
        <div className="flex bg-white rounded-2xl p-1 mb-6 shadow-card border border-gray-100">
          {(['tenant', 'landlord'] as const).map(type => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                userType === type
                  ? type === 'tenant' ? 'bg-tenant-500 text-white shadow-tenant' : 'bg-landlord-500 text-white shadow-landlord'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {type === 'tenant' ? '🏠 שוכר' : '🏢 בעל נכס'}
            </button>
          ))}
        </div>

        <div className="card p-6 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'full_name', label: 'שם מלא', type: 'text', placeholder: 'ישראל ישראלי' },
              { key: 'email', label: 'דוא"ל', type: 'email', placeholder: 'you@example.com' },
              { key: 'phone', label: 'טלפון (אופציונלי)', type: 'tel', placeholder: '050-0000000' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className={`input-field ${!isTenant ? 'landlord-focus' : ''}`}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">סיסמה</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="לפחות 6 תווים"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className={`input-field pl-12 ${!isTenant ? 'landlord-focus' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn ${isTenant ? 'btn-tenant' : 'btn-landlord'} btn-lg w-full mt-2`}
            >
              {loading ? <><span className="spinner" /> נרשם...</> : 'הרשמה'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          כבר רשום?{' '}
          <Link to="/login" className={`font-bold ${isTenant ? 'text-tenant-600' : 'text-landlord-600'} hover:underline`}>
            התחבר
          </Link>
        </p>
      </div>
    </div>
  );
}
