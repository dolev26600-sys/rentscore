import React, { useEffect, useState } from 'react';
import { Copy, Share2, Users, TrendingUp, Gift, CheckCircle, Zap, ArrowLeft, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import BottomNav from '../../components/BottomNav';

interface Referral {
  id: string;
  full_name: string;
  user_type: string;
  created_at: string;
  paid: boolean;
}

export default function AffiliateProgram() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Each user's referral code = their user ID (simple, no extra table needed)
  const refCode = user?.id?.slice(0, 8) || '';
  const refLink = `${window.location.origin}/signup?ref=${user?.id}`;

  useEffect(() => {
    if (!user) return;
    supabase
      .from('users')
      .select('id, full_name, user_type, created_at')
      .eq('referred_by', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReferrals((data || []).map(r => ({ ...r, paid: false })));
        setLoading(false);
      });
  }, [user]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success('קישור הוועתק!');
    setTimeout(() => setCopied(false), 2000);
  };

  const sendWhatsApp = () => {
    const msg = encodeURIComponent(
      `היי 👋\n\nגיליתי כלי שעזר לי בשכירות — RentScore.\n\nשוכרים יכולים לבנות פרופיל מקצועי שמגדיל סיכויים לקבל דירה. סוכנים מקבלים מאגר שוכרים מדורג.\n\nרישום חינמי: ${refLink}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const paidCount = referrals.filter(r => r.paid).length;
  const totalEarned = paidCount * 30;
  const pendingCredit = referrals.filter(r => !r.paid).length * 15;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-28" dir="rtl">
      <PageHeader title="תוכנית שותפים" backTo="/tenant/home" />

      {/* Hero */}
      <div className="mx-4 mt-4 rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #111827 0%, #374151 100%)' }}>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-[16px]">הרוויח על כל חבר שמביא</p>
              <p className="text-gray-400 text-xs">שתף → חבר נרשם → קבל קרדיט</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { value: `₪30`, label: 'על כל סוכן משלם' },
              { value: `₪15`, label: 'על כל שוכר פרמיום' },
              { value: '∞', label: 'ללא הגבלה' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 rounded-2xl p-3 text-center">
                <p className="text-white font-black text-xl leading-none">{value}</p>
                <p className="text-gray-400 text-[10px] mt-1 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2">
        {[
          { label: 'הפניות', value: referrals.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'קרדיט שנצבר', value: `₪${totalEarned + pendingCredit}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'שולם', value: `₪${totalEarned}`, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className={`text-[18px] font-black ${color} leading-none`}>{value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Referral link */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="font-bold text-gray-800 text-sm mb-3">הקישור האישי שלך</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 truncate flex-1">{refLink}</span>
          <button onClick={copyLink} className="shrink-0 p-1.5 bg-teal-50 rounded-lg">
            {copied
              ? <CheckCircle className="w-4 h-4 text-teal-600" />
              : <Copy className="w-4 h-4 text-teal-600" />}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={copyLink}
            className={`py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white'}`}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'הועתק!' : 'העתק לינק'}
          </button>
          <button
            onClick={sendWhatsApp}
            className="py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-white"
            style={{ background: '#25D366' }}
          >
            <Share2 className="w-4 h-4" />
            שלח WhatsApp
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="font-bold text-gray-800 text-sm mb-3">איך עובד?</p>
        <div className="space-y-3">
          {[
            { num: '1', title: 'שתף את הקישור', desc: 'WhatsApp, פייסבוק, קבוצות סוכנים — כל מקום' },
            { num: '2', title: 'חבר נרשם דרך הקישור', desc: 'המערכת עוקבת אוטומטית אחרי ההפנייה שלך' },
            { num: '3', title: 'קבל קרדיט', desc: 'כשהוא משלם — הקרדיט עולה לחשבון שלך' },
            { num: '4', title: 'מימוש', desc: 'השתמש בקרדיט להנחות על המנוי שלך' },
          ].map(({ num, title, desc }) => (
            <div key={num} className="flex items-start gap-3">
              <div className="w-7 h-7 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[11px] font-black">{num}</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referrals list */}
      {referrals.length > 0 && (
        <div className="mx-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gray-600" />
            <p className="font-bold text-gray-800 text-sm">ההפניות שלך ({referrals.length})</p>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {referrals.map((r, i) => (
              <div key={r.id} className={`flex items-center gap-3 px-4 py-3 ${i < referrals.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-black text-gray-600">{r.full_name?.[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{r.full_name}</p>
                  <p className="text-[11px] text-gray-400">
                    {r.user_type === 'tenant' ? 'שוכר' : 'סוכן'} ·{' '}
                    {new Date(r.created_at).toLocaleDateString('he-IL')}
                  </p>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${r.paid ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                  {r.paid ? `+₪30` : 'ממתין'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {referrals.length === 0 && !loading && (
        <div className="mx-4 mt-4 bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <p className="text-3xl mb-3">🚀</p>
          <p className="font-bold text-gray-700">עדיין אין הפניות</p>
          <p className="text-gray-400 text-sm mt-1">שתף את הקישור וגלגל את הכדור</p>
        </div>
      )}

      {/* Suggested messages */}
      <div className="mx-4 mt-4 mb-4">
        <p className="font-bold text-gray-800 text-sm mb-3">💬 הודעות מוכנות לשליחה</p>
        <div className="space-y-2">
          {[
            {
              target: 'לשוכר חבר',
              msg: `מצאתי כלי שעזר לי לבנות פרופיל שוכר מקצועי — RentScore. חינמי ועוזר לבלוט מול בעלי נכסים: ${refLink}`,
            },
            {
              target: 'לסוכן נדל"ן',
              msg: `RentScore — פלטפורמה שנותנת לך מאגר שוכרים מדורגים בלחיצה. 199₪/חודש, שבועיים חינם: ${refLink}`,
            },
            {
              target: 'לקבוצת פייסבוק',
              msg: `מחפשים דירה? בניתי פרופיל שוכר ב-RentScore וכבר ראיתי שוני. מומלץ בחום 🏠 ${refLink}`,
            },
          ].map(({ target, msg }) => (
            <div key={target} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{target}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(msg); toast.success('הועתק!'); }}
                  className="text-[12px] font-bold text-teal-600"
                >
                  העתק
                </button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{msg}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
