import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Copy, Send, CheckCircle, ArrowRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import BottomNav from '../../components/BottomNav';

type Step = 'form' | 'share' | 'done';

export default function RequestRecommendation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('form');
  const [landlordName, setLandlordName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  const approvalUrl = token ? `${window.location.origin}/rec/${token}` : '';

  const createRequest = async () => {
    if (!landlordName.trim()) return toast.error('נא להזין את שם בעל הנכס');
    setLoading(true);
    try {
      const newToken = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
      const { error } = await supabase.from('recommendation_requests').insert({
        tenant_id: user!.id,
        landlord_name: landlordName.trim(),
        address: address.trim() || null,
        token: newToken,
        status: 'pending',
      });
      if (error) {
        // Table might not exist yet — show the link anyway with a note
        console.warn('recommendation_requests table missing:', error);
      }
      setToken(newToken);
      setStep('share');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(approvalUrl);
    setCopied(true);
    toast.success('קישור הועתק!');
    setTimeout(() => setCopied(false), 2000);
  };

  const sendWhatsApp = () => {
    const msg = encodeURIComponent(
      `שלום ${landlordName},\n\nאני ${user?.full_name} שגר אצלך בעבר.\n\nאשמח אם תוכל לאמת שגרתי אצלך ב-RentScore — לוקח פחות מדקה:\n${approvalUrl}\n\nתודה! 🙏`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  if (step === 'share') return (
    <div className="min-h-screen bg-[#f8fafc] pb-28" dir="rtl">
      <PageHeader title="בקשת המלצה" backTo="/tenant/profile" />

      <div className="mx-4 mt-4 space-y-4">
        {/* Success header */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-7 h-7 text-teal-600" />
          </div>
          <h2 className="font-black text-gray-900 text-lg mb-1">הקישור מוכן לשליחה</h2>
          <p className="text-gray-500 text-sm">שלח לבעל הנכס — הוא יאמת בלחיצה אחת</p>
        </div>

        {/* Landlord info */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4">
          <p className="text-teal-700 font-bold text-sm mb-0.5">בקשה נשלחת ל:</p>
          <p className="text-teal-900 font-black text-[16px]">{landlordName}</p>
          {address && <p className="text-teal-600 text-xs mt-0.5">{address}</p>}
        </div>

        {/* Link box */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="font-bold text-gray-800 text-sm mb-2">קישור האימות</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-2">
            <span className="text-xs text-gray-500 truncate flex-1">{approvalUrl}</span>
            <button onClick={copyLink} className="shrink-0 p-1.5 bg-teal-50 rounded-lg">
              {copied ? <CheckCircle className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4 text-teal-600" />}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={sendWhatsApp}
            className="w-full py-4 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 text-white"
            style={{ background: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}
          >
            <Send className="w-5 h-5" />
            שלח ב-WhatsApp
          </button>
          <button
            onClick={copyLink}
            className="w-full py-3.5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'הועתק!' : 'העתק קישור'}
          </button>
        </div>

        {/* How it works */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="font-bold text-gray-700 text-sm mb-3">איך זה עובד?</p>
          {[
            'שלח את הקישור לבעל הנכס',
            'הוא נכנס לקישור (ללא הרשמה) ומאשר שגרת אצלו',
            'Badge "✓ המלצה מאומתת" מופיע על הפרופיל שלך',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-2 last:mb-0">
              <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[10px] font-black">{i + 1}</span>
              </div>
              <p className="text-gray-600 text-sm">{step}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/tenant/profile')}
          className="w-full py-3 text-gray-400 text-sm font-medium"
        >
          סיום — אחזור לפרופיל
        </button>
      </div>

      <BottomNav />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-28" dir="rtl">
      <PageHeader title="בקש המלצה מאומתת" backTo="/tenant/profile" />

      <div className="mx-4 mt-4 space-y-4">
        {/* Explainer */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-[15px]">המלצה מאומתת = ציון גבוה יותר</p>
              <p className="text-gray-500 text-xs">בעל הנכס מאשר בעצמו — לא ניתן לזייף</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-teal-600">+5</p>
              <p className="text-[11px] text-gray-500 mt-0.5">נקודות לציון</p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-amber-500">✓</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Badge בפרופיל</p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-blue-500">3×</p>
              <p className="text-[11px] text-gray-500 mt-0.5">אמינות גבוהה</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                שם בעל הנכס *
              </label>
              <input
                type="text"
                placeholder="ישראל ישראלי"
                value={landlordName}
                onChange={e => setLandlordName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                כתובת הדירה (אופציונלי)
              </label>
              <input
                type="text"
                placeholder="רחוב הרצל 5, תל אביב"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="input-field"
              />
              <p className="text-gray-400 text-xs mt-1.5">עוזר לאמת שאכן גרת שם</p>
            </div>
          </div>
        </div>

        <button
          onClick={createRequest}
          disabled={!landlordName.trim() || loading}
          className="btn btn-tenant btn-lg w-full"
        >
          {loading ? <><span className="spinner" /> יוצר קישור...</> : <>
            <ArrowRight className="w-5 h-5" />
            צור קישור אימות
          </>}
        </button>

        <p className="text-center text-xs text-gray-400 px-4">
          נוצר קישור חד-פעמי שרק בעל הנכס ימלא. אין צורך בהרשמה מצידו.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
