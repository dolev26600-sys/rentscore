import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Send, Shield, LogOut, Copy, MapPin, Briefcase, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface TenantCard {
  id: string; full_name: string; current_city: string; employment_type: string;
  score: number; years_renting: number; has_guarantor: boolean; income_range: string; user_id: string;
}

function scoreColor(score: number) {
  if (score >= 85) return '#00D4BA';
  if (score >= 70) return '#00B89F';
  if (score >= 55) return '#F59E0B';
  return '#6B7280';
}

function ScoreRing({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `conic-gradient(${color} ${score}%, rgba(255,255,255,0.1) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0F1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 900, color }}>{score}</span>
      </div>
    </div>
  );
}

function ScoreTag({ score }: { score: number }) {
  const color = scoreColor(score);
  const label = score >= 85 ? 'מצוין' : score >= 70 ? 'טוב מאוד' : score >= 55 ? 'טוב' : 'בסיסי';
  return (
    <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: `${color}20`, color, border: `1px solid ${color}30` }}>{label}</span>
  );
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
    supabase.from('tenant_profiles').select('*, users!inner(full_name, id)')
      .order('score', { ascending: false }).limit(50)
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
    const matchSearch = !search || t.full_name.includes(search) || t.current_city.includes(search);
    const matchCity = !filterCity || t.current_city === filterCity;
    return matchSearch && matchCity;
  });

  const cities = [...new Set(tenants.map(t => t.current_city).filter(Boolean))];

  const cardStyle = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#18243A', fontFamily: "'Heebo', sans-serif", overflowX: 'hidden', position: 'relative' }}>

      {/* Ambient */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,186,0.08) 0%, transparent 65%)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '-60px', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,63,255,0.06) 0%, transparent 65%)', filter: 'blur(30px)' }} />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, padding: '48px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg,#00D4BA,#00A896)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,212,186,0.3)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>RentScore</span>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: 'rgba(0,212,186,0.12)', color: '#00D4BA', border: '1px solid rgba(0,212,186,0.2)' }}>סוכן</span>
          </div>
          <button onClick={logout} style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <LogOut size={15} color="rgba(255,255,255,0.4)" />
          </button>
        </div>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: '0 0 4px' }}>שלום, {user?.full_name?.split(' ')[0]}</h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>{tenants.length} שוכרים במאגר</p>
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Invite banner */}
        <button onClick={() => setShowInvite(!showInvite)} style={{ ...cardStyle, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'right' }}>
          <div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 15, margin: '0 0 4px' }}>הזמן שוכר למלא פרופיל</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>שלח קישור — קבל פרופיל מלא תוך דקות</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(0,212,186,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Send size={16} color="#00D4BA" />
          </div>
        </button>

        {showInvite && (
          <div style={{ ...cardStyle, padding: 18 }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>הקישור שלך לשיתוף</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', marginBottom: 12 }}>
              <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inviteLink}</span>
              <button onClick={copyInvite} style={{ flexShrink: 0, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex' }}>
                <Copy size={14} color="#00D4BA" />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={copyInvite} style={{ padding: '12px', borderRadius: 14, outline: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: copied ? '#059669' : 'rgba(0,212,186,0.15)', color: copied ? '#fff' : '#00D4BA', border: `1px solid ${copied ? 'transparent' : 'rgba(0,212,186,0.25)'}` }}>
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copied ? 'הועתק!' : 'העתק לינק'}
              </button>
              <button onClick={sendWhatsApp} style={{ padding: '12px', borderRadius: 14, border: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#25D366', color: '#fff' }}>
                <Send size={16} />WhatsApp
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { label: 'שוכרים', value: tenants.length, color: '#6B3FFF', bg: 'rgba(107,63,255,0.12)', Icon: Users },
            { label: 'ציון ≥70', value: tenants.filter(t => t.score >= 70).length, color: '#00D4BA', bg: 'rgba(0,212,186,0.12)', Icon: TrendingUp },
            { label: 'עם ערב', value: tenants.filter(t => t.has_guarantor).length, color: '#00B89F', bg: 'rgba(0,184,159,0.12)', Icon: Shield },
          ].map(({ label, value, color, bg, Icon }) => (
            <div key={label} style={{ ...cardStyle, padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <Icon size={15} color={color} />
              </div>
              <p style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="חפש שוכר לפי שם..."
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 44px 12px 16px', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
          {cities.length > 1 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {['הכל', ...cities].map(city => (
                <button key={city} onClick={() => setFilterCity(city === 'הכל' ? '' : city)} style={{
                  flexShrink: 0, fontSize: 12, padding: '7px 14px', borderRadius: 999, fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                  background: (city === 'הכל' && !filterCity) || filterCity === city ? '#00D4BA' : 'rgba(255,255,255,0.06)',
                  color: (city === 'הכל' && !filterCity) || filterCity === city ? '#18243A' : 'rgba(255,255,255,0.5)',
                  border: (city === 'הכל' && !filterCity) || filterCity === city ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}>
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tenant list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 32 }}>
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{ ...cardStyle, padding: 18, height: 80, background: 'rgba(255,255,255,0.03)' }} />
            ))
          ) : filtered.length === 0 ? (
            <div style={{ ...cardStyle, padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 48, margin: '0 0 12px' }}>👥</p>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: '0 0 6px' }}>אין שוכרים עדיין</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>שלח קישור הזמנה לשוכרים שלך</p>
            </div>
          ) : (
            filtered.map(tenant => (
              <button key={tenant.id} onClick={() => navigate(`/profile/user-${tenant.user_id}`)} style={{ ...cardStyle, padding: 16, textAlign: 'right', cursor: 'pointer', fontFamily: 'inherit', width: '100%', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ScoreRing score={tenant.score} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <p style={{ color: '#fff', fontWeight: 800, fontSize: 14, margin: 0 }}>{tenant.full_name}</p>
                      <ScoreTag score={tenant.score} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      {tenant.current_city && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                          <MapPin size={11} />{tenant.current_city}
                        </span>
                      )}
                      {tenant.employment_type && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                          <Briefcase size={11} />{tenant.employment_type}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {tenant.has_guarantor && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'rgba(0,212,186,0.12)', color: '#00D4BA', border: '1px solid rgba(0,212,186,0.2)' }}>ערב ✓</span>}
                      {tenant.income_range && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'rgba(0,212,186,0.08)', color: '#00B89F', border: '1px solid rgba(0,184,159,0.2)' }}>₪{tenant.income_range}</span>}
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </div>
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
