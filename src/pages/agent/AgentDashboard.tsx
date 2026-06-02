import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Send, Shield, LogOut, Copy, ChevronLeft, MapPin, Briefcase, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface TenantCard {
  id: string;
  full_name: string;
  current_city: string;
  employment_type: string;
  score: number;
  years_renting: number;
  has_guarantor: boolean;
  income_range: string;
  user_id: string;
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 85 ? '#059669' : score >= 70 ? '#0d9488' : score >= 55 ? '#d97706' : '#9ca3af';
  return (
    <div className="w-11 h-11 flex-shrink-0 relative flex items-center justify-center rounded-full" style={{ background: `conic-gradient(${color} ${score}%, #f1f3f5 0)` }}>
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
        <span className="text-[11px] font-black" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

function ScoreTag({ score }: { score: number }) {
  if (score >= 85) return <span className="badge badge-green">מצוין</span>;
  if (score >= 70) return <span className="badge badge-teal">טוב מאוד</span>;
  if (score >= 55) return <span className="badge badge-amber">טוב</span>;
  return <span className="badge badge-gray">בסיסי</span>;
}

export default function AgentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<TenantCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink = `${window.location.origin}/signup?type=tenant&ref=${user?.id}`;

  useEffect(() => {
    if (!user) return;
    supabase
      .from('tenant_profiles')
      .select('*, users!inner(full_name, id)')
      .order('score', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setTenants(data.map((p: any) => ({
          id: p.id, user_id: p.user_id,
          full_name: p.users?.full_name || 'שוכר',
          current_city: p.current_city || '',
          employment_type: p.employment_type || '',
          score: p.score || 50,
          years_renting: p.years_renting || 0,
          has_guarantor: p.has_guarantor || false,
          income_range: p.income_range || '',
        })));
        setLoading(false);
      });
  }, [user]);

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success('קישור הוזמנה הועתק!');
    setTimeout(() => setCopied(false), 2000);
  };

  const sendWhatsApp = () => {
    const msg = encodeURIComponent(`שלום,\n\nאני מזמין אותך ליצור פרופיל שוכר ב-RentScore — כך תוכל לבלוט בין כל המתמודדים על הדירה.\n\nזה לוקח 2 דקות ולגמרי חינם:\n${inviteLink}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const filtered = tenants.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !search || t.full_name.includes(search) || t.current_city.includes(search);
    const matchCity = !filterCity || t.current_city === filterCity;
    return matchSearch && matchCity;
  });

  const cities = [...new Set(tenants.map(t => t.current_city).filter(Boolean))];

  return (
    <div className="min-h-screen pb-10" style={{ background: '#f7f8fa' }} dir="rtl">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#0f172a' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900 text-[17px]">RentScore</span>
            <span className="badge badge-gray">סוכן</span>
          </div>
          <button onClick={logout} className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors">
            <LogOut className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <h1 className="text-xl font-black text-gray-900">שלום, {user?.full_name?.split(' ')[0]}</h1>
        <p className="text-gray-400 text-sm mt-0.5">{tenants.length} שוכרים במאגר</p>
      </div>

      <div className="px-4 pt-4 space-y-3">

        {/* ── Invite Banner ── */}
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="w-full card px-5 py-4 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="text-right">
            <p className="font-bold text-[15px] text-gray-900">הזמן שוכר למלא פרופיל</p>
            <p className="text-gray-400 text-xs mt-0.5">שלח קישור — קבל פרופיל מלא תוך דקות</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#ccfbf1' }}>
            <Send className="w-4 h-4" style={{ color: '#0d9488' }} />
          </div>
        </button>

        {/* Invite Panel */}
        {showInvite && (
          <div className="card p-4 animate-fade-in">
            <p className="font-bold text-gray-800 text-sm mb-3">הקישור שלך לשיתוף</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 mb-3">
              <span className="text-xs text-gray-500 truncate flex-1">{inviteLink}</span>
              <button onClick={copyInvite} className="shrink-0 p-1.5 bg-white rounded-lg border border-gray-200">
                <Copy className="w-3.5 h-3.5 text-teal-600" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={copyInvite} className={`py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-gray-900 text-white'}`}>
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'הועתק!' : 'העתק לינק'}
              </button>
              <button onClick={sendWhatsApp} className="py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 text-white" style={{ background: '#25D366' }}>
                <Send className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'שוכרים', value: tenants.length, icon: Users, iconColor: '#6366f1', iconBg: '#e0e7ff' },
            { label: 'ציון ≥70', value: tenants.filter(t => t.score >= 70).length, icon: TrendingUp, iconColor: '#059669', iconBg: '#d1fae5' },
            { label: 'עם ערב', value: tenants.filter(t => t.has_guarantor).length, icon: Shield, iconColor: '#0d9488', iconBg: '#ccfbf1' },
          ].map(({ label, value, icon: Icon, iconColor, iconBg }) => (
            <div key={label} className="card p-3 text-center">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: iconBg }}>
                <Icon className="w-4 h-4" style={{ color: iconColor }} />
              </div>
              <p className="text-[22px] font-black text-gray-900 leading-none">{value}</p>
              <p className="text-[11px] text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="חפש שוכר לפי שם..."
              className="w-full card py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:border-teal-400 focus:shadow-sm transition-shadow"
              style={{ borderRadius: 12 }}
            />
          </div>
          {cities.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {['הכל', ...cities].map(city => (
                <button
                  key={city}
                  onClick={() => setFilterCity(city === 'הכל' ? '' : city)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${(city === 'הכל' && !filterCity) || filterCity === city ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

{/* ── Tenant List ── */}
        <div className="space-y-2 pb-8">
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="card p-4 h-20 skeleton" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-4xl mb-3">👥</p>
              <p className="font-bold text-gray-700">אין שוכרים עדיין</p>
              <p className="text-gray-400 text-sm mt-1">שלח קישור הזמנה לשוכרים שלך</p>
            </div>
          ) : (
            filtered.map(tenant => (
              <button
                key={tenant.id}
                onClick={() => navigate(`/profile/user-${tenant.user_id}`)}
                className="w-full card p-4 text-right hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <ScoreRing score={tenant.score} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900 text-sm">{tenant.full_name}</p>
                      <ScoreTag score={tenant.score} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {tenant.current_city && (
                        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{tenant.current_city}</span>
                      )}
                      {tenant.employment_type && (
                        <span className="flex items-center gap-0.5"><Briefcase className="w-3 h-3" />{tenant.employment_type}</span>
                      )}
                    </div>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      {tenant.has_guarantor && <span className="badge badge-teal">ערב ✓</span>}
                      {tenant.income_range && <span className="badge badge-green">₪{tenant.income_range}</span>}
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </div>
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
