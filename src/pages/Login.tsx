import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, hashPassword } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('נא למלא את כל השדות');
    setLoading(true);
    try {
      const password_hash = await hashPassword(form.password);
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('email', form.email.toLowerCase().trim())
        .eq('password_hash', password_hash)
        .single();
      if (error || !data) {
        toast.error('אימייל או סיסמה שגויים');
        return;
      }
      setUser(data);
      toast.success(`שלום, ${data.full_name}!`);
      // Check if this landlord is an agent
      const agentFlag = localStorage.getItem(`rentscore_agent_${data.id}`);
      if (data.user_type === 'tenant') navigate('/tenant/home');
      else if (agentFlag) navigate('/agent/home');
      else navigate('/landlord/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col" dir="rtl">

      {/* Top brand strip */}
      <div className="px-6 pt-14 pb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
            <Zap className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <span className="font-black text-gray-900 text-[20px] tracking-tight">RentScore</span>
        </div>
        <h1 className="text-[26px] font-black text-gray-900 leading-tight mb-2">ברוך הבא בחזרה</h1>
        <p className="text-gray-400 text-[14px]">התחבר לחשבון שלך</p>
      </div>

      {/* Form card */}
      <div className="flex-1 px-5">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">דוא"ל</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">סיסמה</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="הזן סיסמה"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-field pl-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-tenant btn-lg w-full mt-2"
            >
              {loading ? <><span className="spinner" /> מתחבר...</> : 'התחבר'}
            </button>
          </form>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-center text-sm text-gray-500">
            אין לך חשבון?{' '}
            <Link to="/signup" className="font-bold text-teal-600 hover:underline">הרשם עכשיו</Link>
          </p>

          <button
            onClick={() => navigate('/demo')}
            className="w-full border-2 border-gray-200 bg-white rounded-2xl py-3 text-gray-500 font-semibold text-sm hover:border-gray-300 transition-colors"
          >
            צפה בדמו ללא הרשמה ←
          </button>
        </div>
      </div>

    </div>
  );
}
