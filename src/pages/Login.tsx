import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Zap, ChevronRight } from 'lucide-react';
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
        .from('users').select()
        .eq('email', form.email.toLowerCase().trim())
        .eq('password_hash', password_hash)
        .single();
      if (error || !data) { toast.error('אימייל או סיסמה שגויים'); return; }
      setUser(data);
      toast.success(`שלום, ${data.full_name}!`);
      const agentFlag = localStorage.getItem(`rentscore_agent_${data.id}`);
      if (data.user_type === 'tenant') navigate('/tenant/home');
      else if (agentFlag) navigate('/agent/home');
      else navigate('/landlord/home');
    } finally { setLoading(false); }
  };

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

      {/* Brand header */}
      <div className="px-6 pt-8 pb-6 text-center">
        <div className="inline-flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: '#00B89F' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-white text-[22px] tracking-tight">RentScore</span>
        </div>
        <h1 className="text-[28px] font-black text-white leading-tight mb-2">ברוך הבא בחזרה</h1>
        <p className="text-white/40 text-sm">התחבר לחשבון שלך</p>
      </div>

      {/* Form card */}
      <div className="flex-1 px-5">
        <div className="card p-6 anim-pop">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label mb-2 block">דוא"ל</label>
              <input type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field" dir="ltr" />
            </div>

            <div>
              <label className="label mb-2 block">סיסמה</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} placeholder="הזן סיסמה"
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-field" style={{ paddingLeft: 46 }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-2">
              {loading ? <><span className="spinner" /> מתחבר...</> : 'התחבר'}
            </button>
          </form>

          <div className="divider my-5" />

          <p className="text-center text-sm text-gray-500">
            אין לך חשבון?{' '}
            <Link to="/signup" className="font-bold" style={{ color: '#00B89F' }}>הרשם חינם</Link>
          </p>

          <button onClick={() => navigate('/demo')}
            className="w-full mt-3 py-3 rounded-2xl text-gray-400 text-sm font-semibold hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100">
            צפה בדמו ללא הרשמה ←
          </button>
        </div>
      </div>

      <div className="pb-12" />
    </div>
  );
}
