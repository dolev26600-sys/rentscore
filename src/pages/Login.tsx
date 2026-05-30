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
      <div className="bg-tenant-600 pt-12 pb-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-tenant-600" />
          </div>
          <span className="text-white font-black text-xl">RentScore</span>
        </div>
        <h1 className="text-white text-2xl font-bold">התחברות</h1>
      </div>

      <div className="flex-1 px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">דוא"ל</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-tenant-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">סיסמה</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="סיסמה"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-tenant-500 pl-12"
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
            className="w-full bg-tenant-600 hover:bg-tenant-700 text-white font-bold py-4 rounded-2xl text-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          אין לך חשבון?{' '}
          <Link to="/signup" className="font-bold text-tenant-600">הרשם עכשיו</Link>
        </p>

        <button
          onClick={() => navigate('/demo')}
          className="w-full mt-4 border border-gray-200 rounded-xl py-3 text-gray-600 font-medium text-sm"
        >
          צפה בדמו ללא הרשמה
        </button>
      </div>
    </div>
  );
}
