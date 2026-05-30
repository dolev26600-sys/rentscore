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
      const { data, error } = await supabase
        .from('users')
        .insert({ ...form, password_hash, user_type: userType })
        .select()
        .single();
      if (error) {
        if (error.code === '23505') toast.error('כתובת המייל כבר קיימת במערכת');
        else toast.error('שגיאה ברישום, נסה שנית');
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
  const primaryColor = isTenant ? 'bg-tenant-600 hover:bg-tenant-700' : 'bg-landlord-500 hover:bg-landlord-600';
  const ringColor = isTenant ? 'ring-tenant-500' : 'ring-landlord-500';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className={`${isTenant ? 'bg-tenant-600' : 'bg-landlord-600'} pt-12 pb-8 px-6 text-center`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Home className={`w-5 h-5 ${isTenant ? 'text-tenant-600' : 'text-landlord-600'}`} />
          </div>
          <span className="text-white font-black text-xl">RentScore</span>
        </div>
        <h1 className="text-white text-2xl font-bold">הרשמה</h1>
      </div>

      <div className="flex-1 px-6 py-6">
        {/* Type selector */}
        <div className="flex bg-white rounded-2xl p-1 mb-6 shadow-sm border border-gray-100">
          {(['tenant', 'landlord'] as const).map(type => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                userType === type
                  ? type === 'tenant' ? 'bg-tenant-500 text-white shadow' : 'bg-landlord-500 text-white shadow'
                  : 'text-gray-500'
              }`}
            >
              {type === 'tenant' ? 'שוכר' : 'בעל נכס'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'full_name', label: 'שם מלא', type: 'text', placeholder: 'ישראל ישראלי' },
            { key: 'email', label: 'דוא"ל', type: 'email', placeholder: 'you@example.com' },
            { key: 'phone', label: 'טלפון (אופציונלי)', type: 'tel', placeholder: '050-0000000' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-white focus:outline-none focus:ring-2 ${ringColor}`}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">סיסמה</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="לפחות 6 תווים"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-white focus:outline-none focus:ring-2 ${ringColor} pl-12`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${primaryColor} text-white font-bold py-4 rounded-2xl text-lg transition-colors mt-2 disabled:opacity-60`}
          >
            {loading ? 'נרשם...' : 'הרשמה'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          כבר רשום?{' '}
          <Link to="/login" className={`font-bold ${isTenant ? 'text-tenant-600' : 'text-landlord-600'}`}>
            התחבר
          </Link>
        </p>
      </div>
    </div>
  );
}
