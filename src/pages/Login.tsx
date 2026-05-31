import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Eye, EyeOff } from 'lucide-react';
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
      navigate(data.user_type === 'tenant' ? '/tenant/home' : '/landlord/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-b from-tenant-700 to-tenant-600 pt-12 pb-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
            <Home className="w-6 h-6 text-tenant-600" />
          </div>
          <span className="text-white font-black text-2xl">RentScore</span>
        </div>
        <h1 className="text-white text-xl font-bold opacity-90">ברוך הבא בחזרה</h1>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="card p-6 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">דוא"ל</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">סיסמה</label>
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

        <p className="text-center text-sm text-gray-500 mt-5">
          אין לך חשבון?{' '}
          <Link to="/signup" className="font-bold text-tenant-600 hover:underline">הרשם עכשיו</Link>
        </p>

        <button
          onClick={() => navigate('/demo')}
          className="w-full mt-3 border-2 border-gray-200 rounded-2xl py-3 text-gray-500 font-medium text-sm hover:border-gray-300 transition-colors"
        >
          צפה בדמו ללא הרשמה
        </button>
      </div>
    </div>
  );
}
