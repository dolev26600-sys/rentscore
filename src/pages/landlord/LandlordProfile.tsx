import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import BottomNav from '../../components/BottomNav';

export default function LandlordProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('landlord_profiles').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [user]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('landlord_profiles').update(profile).eq('user_id', user!.id);
    setSaving(false);
    if (error) toast.error('שגיאה בשמירה');
    else toast.success('נשמר!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="הפרופיל שלי" showBack={false} />

      <div className="mx-4 mt-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3">אודות</h2>
          <textarea
            rows={3}
            placeholder="תאר את עצמך כבעל נכס..."
            value={profile.bio || ''}
            onChange={e => setProfile((p: any) => ({ ...p, bio: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-landlord-500"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3">דרישות</h2>
          {[
            { key: 'requires_guarantor', label: 'דורש ערב' },
            { key: 'allows_pets', label: 'מאפשר חיות מחמד' },
            { key: 'allows_children', label: 'מאפשר ילדים' },
          ].map(req => (
            <div key={req.key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{req.label}</span>
              <button
                onClick={() => setProfile((p: any) => ({ ...p, [req.key]: !p[req.key] }))}
                className={`w-12 h-6 rounded-full transition-colors ${profile[req.key] ? 'bg-landlord-500' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow mx-0.5 transition-transform ${profile[req.key] ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3">זמן תגובה</h2>
          <select
            value={profile.response_time || '24 שעות'}
            onChange={e => setProfile((p: any) => ({ ...p, response_time: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-landlord-500"
          >
            {['שעה', '3 שעות', '24 שעות', 'יום עסקים'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button onClick={save} disabled={saving} className="w-full bg-landlord-500 text-white font-bold py-4 rounded-2xl text-lg disabled:opacity-60">
          {saving ? 'שומר...' : 'שמור שינויים'}
        </button>

        <div className="bg-gray-100 rounded-2xl p-4">
          <h2 className="font-bold text-gray-700 mb-2">מידע משפטי</h2>
          <p className="text-xs text-gray-500">RentScore פועל בהתאם לחוק הגנת הפרטיות תשמ"א-1981 וחוק שכירות הוגנת.</p>
        </div>

        <div className="bg-gray-100 rounded-2xl p-4">
          <h2 className="font-bold text-gray-700 mb-2">תמיכה</h2>
          <p className="text-xs text-gray-500">לתמיכה: support@rentscore.co.il</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
