import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, Home, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

type Status = 'loading' | 'form' | 'done' | 'error' | 'already';

export default function RecommendationApproval() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [request, setRequest] = useState<any>(null);
  const [tenantName, setTenantName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [landlordPhone, setLandlordPhone] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('recommendation_requests')
        .select('*, users!tenant_id(full_name)')
        .eq('token', token)
        .single();

      if (error || !data) { setStatus('error'); return; }
      if (data.status !== 'pending') { setStatus('already'); return; }
      setRequest(data);
      setTenantName(data.users?.full_name || 'השוכר');
      setStatus('form');
    };
    load();
  }, [token]);

  const submit = async () => {
    if (!comment.trim()) return toast.error('נא לכתוב כמה מילים על השוכר');
    setLoading(true);
    try {
      // Create recommendation record
      const { error: recErr } = await supabase.from('recommendations').insert({
        tenant_id: request.tenant_id,
        landlord_name: request.landlord_name,
        rating,
        comment: comment.trim(),
        verified: true,
        address: request.address || null,
        landlord_phone: landlordPhone.trim() || null,
      });

      if (recErr) throw recErr;

      // Mark request as approved
      await supabase.from('recommendation_requests')
        .update({ status: 'approved', rating, comment: comment.trim() })
        .eq('token', token);

      // Update tenant score (+5 for verified rec)
      const { data: tp } = await supabase
        .from('tenant_profiles').select('score').eq('user_id', request.tenant_id).single();
      if (tp) {
        await supabase.from('tenant_profiles')
          .update({ score: Math.min(100, (tp.score || 50) + 5) })
          .eq('user_id', request.tenant_id);
      }

      setStatus('done');
    } catch (e) {
      toast.error('שגיאה בשמירה — נסה שוב');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (status === 'error') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 bg-gray-50" dir="rtl">
      <div className="text-5xl">😕</div>
      <p className="text-gray-700 text-lg font-bold">קישור לא תקין</p>
      <p className="text-gray-500 text-sm text-center">הקישור אינו תקין או שפג תוקפו</p>
      <button onClick={() => navigate('/')} className="btn btn-tenant btn-md mt-2">לדף הבית</button>
    </div>
  );

  if (status === 'already') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 bg-gray-50" dir="rtl">
      <div className="w-16 h-16 bg-teal-50 rounded-3xl flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-teal-500" />
      </div>
      <p className="text-gray-700 text-lg font-bold">כבר אישרת את ההמלצה</p>
      <p className="text-gray-500 text-sm">תודה! ההמלצה כבר מופיעה על הפרופיל</p>
    </div>
  );

  if (status === 'done') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 bg-gray-50" dir="rtl">
      <div className="w-20 h-20 bg-teal-500 rounded-3xl flex items-center justify-center shadow-lg">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-black text-gray-900 mb-2">תודה רבה!</h1>
        <p className="text-gray-500 text-[15px]">ההמלצה שלך הוספה לפרופיל של {tenantName}</p>
      </div>
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-sm border border-gray-100">
        <div className="flex gap-0.5 justify-center mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-6 h-6 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
          ))}
        </div>
        <p className="text-gray-600 text-sm text-center italic">"{comment}"</p>
      </div>
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
        <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <p className="text-emerald-700 text-xs font-semibold">ההמלצה מסומנת כ"מאומתת על ידי בעל נכס"</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12" dir="rtl">

      {/* Header */}
      <div className="text-center pt-12 pb-6 px-6"
        style={{ background: 'linear-gradient(160deg, #0f766e, #14b8a6)' }}>
        <div className="flex items-center justify-center gap-1.5 mb-5">
          <Home className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm font-semibold">RentScore</span>
        </div>
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elevated">
          <span className="text-2xl font-black text-teal-600">
            {tenantName.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
          </span>
        </div>
        <h1 className="text-white text-xl font-black mb-1">{tenantName}</h1>
        <p className="text-teal-200 text-sm">מבקש המלצה ממך</p>
      </div>

      <div className="px-5 mt-5 space-y-4">

        {/* Context */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-gray-600 text-sm leading-relaxed">
            <strong className="text-gray-800">{tenantName}</strong> גר אצלך בעבר ומבקש שתאשר זאת.
            {request?.address && <> הדירה: <strong>{request.address}</strong>.</>}
            {' '}ב-RentScore, בעלי דירות מאמתים שוכרים — מה שעוזר להם למצוא דירה ולך לקבל שוכרים אמינים.
          </p>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="font-bold text-gray-800 mb-4 text-center">איך תדרג את השוכר?</p>
          <div className="flex gap-2 justify-center mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    i < (hoverRating || rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200 fill-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm font-semibold text-gray-500">
            {rating === 5 ? 'מצוין!' : rating === 4 ? 'טוב מאוד' : rating === 3 ? 'סביר' : rating === 2 ? 'מתחת לממוצע' : 'לא מומלץ'}
          </p>
        </div>

        {/* Phone */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="block font-bold text-gray-800 mb-1">מספר הטלפון שלך *</label>
          <p className="text-gray-400 text-xs mb-3">לא יוצג בפרופיל. משמש לאימות שאתה בעל הנכס האמיתי.</p>
          <input
            type="tel"
            placeholder="050-0000000"
            value={landlordPhone}
            onChange={e => setLandlordPhone(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400"
            dir="ltr"
          />
        </div>

        {/* Comment */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="block font-bold text-gray-800 mb-3">כתוב כמה מילים *</label>
          <textarea
            rows={4}
            placeholder="לדוגמה: השוכר שמר על הדירה, שילם בזמן ותקשורת מעולה..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-teal-400 focus:shadow-sm"
          />
          <p className="text-gray-400 text-xs mt-1.5">המידע ייראה על הפרופיל הציבורי של השוכר</p>
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={!comment.trim() || !landlordPhone.trim() || loading}
          className="btn btn-tenant btn-lg w-full"
        >
          {loading ? <><span className="spinner" /> שומר...</> : <>
            <Shield className="w-5 h-5" />
            אמת ושלח המלצה
          </>}
        </button>

        <p className="text-center text-xs text-gray-400">
          ב-RentScore אנו מאמינים באמינות ושקיפות בשוק השכירות
        </p>
      </div>
    </div>
  );
}
