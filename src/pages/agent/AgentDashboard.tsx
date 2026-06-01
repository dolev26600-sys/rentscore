import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Send, Star, Shield, CheckCircle, LogOut, Copy, ChevronLeft, MapPin, Briefcase, TrendingUp, Users, Zap } from 'lucide-react';
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
  rec_count?: number;
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 85) return <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">מצוין</span>;
  if (score >= 70) return <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">טוב מאוד</span>;
  if (score >= 55) return <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">טוב</span>;
  return <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">בסיסי</span>;
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
    loadTenants();
  }, [user]);

  const loadTenants = async () => {
    setLoading(true);
    try {
      // Load all tenant profiles with user info
      const { data: profiles } = await supabase
        .from('tenant_profiles')
        .select('*, users!inner(full_name, id)')
        .order('score', { ascending: false })
        .limit(50);

      if (profiles) {
        const cards: TenantCard[] = profiles.map((p: any) => ({
          id: p.id,
          user_id: p.user_id,
          full_name: p.users?.full_name || 'שוכר',
          current_city: p.current_city || '',
          employment_type: p.employment_type || '',
          score: p.score || 50,
          years_renting: p.years_renting || 0,
          has_guarantor: p.has_guarantor || false,
          income_range: p.income_range || '',
        }));
        setTenants(cards);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

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
    const matchSearch = !search || t.full_name.includes(search) || t.current_city.includes(search);
    const matchCity = !filterCity || t.current_city === filterCity;
    return matchSearch && matchCity;
  });

  const cities = [...new Set(tenants.map(t => t.current_city).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir="rtl">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-gray-900 text-[16px]">RentScore</span>
            <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">סוכן</span>
          </div>
          <button onClick={logout} className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <h1 className="text-xl font-black text-gray-900">שלום, {user?.full_name?.split(' ')[0]}</h1>
        <p className="text-gray-400 text-sm mt-0.5">{tenants.length} שוכרים במאגר</p>
      </div>

      <div className="px-4 pt-4 space-y-3">

        {/* Invite Banner */}
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="w-full rounded-2xl px-5 py-4 flex items-center justify-between text-white"
          style={{ background: 'linear-gradient(135deg, #111827, #374151)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        >
          <div className="text-right">
            <p className="font-bold text-[15px]">הזמן שוכר למלא פרופיל</p>
            <p className="text-gray-400 text-xs mt-0.5">שלח קישור — קבל פרופיל מלא תוך דקות</p>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
        </button>

        {/* Invite Panel */}
        {showInvite && (
          <div className="bg-white rounded-2xl p-4 shadow-card animate-fade-in">
            <p className="font-bold text-gray-800 text-sm mb-3">הקישור שלך לשיתוף</p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-500 truncate flex-1">{inviteLink}</span>
              <button onClick={copyInvite} className="shrink-0 p-1.5 bg-teal-50 rounded-lg hover:bg-teal-100">
                <Copy className="w-4 h-4 text-teal-600" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copyInvite}
                className={`py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white'}`}
              >
                <Copy className="w-4 h-4" />
                {copied ? 'הועתק!' : 'העתק לינק'}
              </button>
              <button
                onClick={sendWhatsApp}
                className="py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: '#25D366', color: '#fff' }}
              >
                <Send className="w-4 h-4" />
                שלח ב-WhatsApp
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              השוכר ימלא פרופיל ואתה תראה אותו כאן אוטומטית
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'שוכרים', value: tenants.length, icon: Users, color: 'text-teal-500', bg: 'bg-teal-50' },
            { label: 'ציון ≥70', value: tenants.filter(t => t.score >= 70).length, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'עם ערב', value: tenants.filter(t => t.has_guarantor).length, icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-card">
              <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-[20px] font-black text-gray-800 leading-none">{value}</p>
              <p className="text-[11px] text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="חפש שוכר לפי שם..."
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pr-10 pl-4 text-sm text-right focus:outline-none focus:border-teal-400"
              dir="rtl"
            />
          </div>
          {cities.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterCity('')}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${!filterCity ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                הכל
              </button>
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setFilterCity(city === filterCity ? '' : city)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filterCity === city ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tenant List */}
        <div className="space-y-2 pb-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-card">
              <p className="text-4xl mb-3">👥</p>
              <p className="font-bold text-gray-700">אין שוכרים עדיין</p>
              <p className="text-gray-400 text-sm mt-1">שלח קישור הזמנה לשוכרים שלך</p>
            </div>
          ) : (
            filtered.map(tenant => (
              <button
                key={tenant.id}
                onClick={() => navigate(`/profile/user-${tenant.user_id}`)}
                className="w-full bg-white rounded-2xl p-4 shadow-card text-right hover:shadow-elevated transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Avatar */}
                    <div className="w-11 h-11 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-teal-700 font-black text-sm">
                        {tenant.full_name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-800 text-sm">{tenant.full_name}</p>
                        <ScoreBadge score={tenant.score} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {tenant.current_city && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" /> {tenant.current_city}
                          </span>
                        )}
                        {tenant.employment_type && (
                          <span className="flex items-center gap-0.5">
                            <Briefcase className="w-3 h-3" /> {tenant.employment_type}
                          </span>
                        )}
                        {tenant.years_renting > 0 && (
                          <span>{tenant.years_renting} שנות ניסיון</span>
                        )}
                      </div>
                      {/* Tags */}
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        <span className="text-[11px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          ציון {tenant.score}
                        </span>
                        {tenant.has_guarantor && (
                          <span className="text-[11px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            ✓ ערב
                          </span>
                        )}
                        {tenant.income_range && (
                          <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                            הכנסה: {tenant.income_range}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
                </div>
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
