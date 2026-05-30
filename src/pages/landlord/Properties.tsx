import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2, MapPin, Banknote } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import BottomNav from '../../components/BottomNav';

export default function Properties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('properties').select('*').eq('landlord_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setProperties(data || []); setLoading(false); });
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader
        title="הנכסים שלי"
        showBack={false}
        right={
          <button onClick={() => navigate('/landlord/add-property')} className="p-1">
            <Plus className="w-6 h-6 text-landlord-600" />
          </button>
        }
      />

      <div className="mx-4 mt-4">
        {loading && <div className="flex justify-center mt-8"><div className="w-8 h-8 border-4 border-landlord-500 border-t-transparent rounded-full animate-spin" /></div>}

        {!loading && properties.length === 0 && (
          <div className="text-center mt-16">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold">אין נכסים עדיין</p>
            <button
              onClick={() => navigate('/landlord/add-property')}
              className="mt-4 bg-landlord-500 text-white font-bold px-6 py-3 rounded-xl"
            >
              הוסף נכס ראשון
            </button>
          </div>
        )}

        <div className="space-y-3">
          {properties.map(prop => (
            <div key={prop.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800">{prop.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${prop.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {prop.status === 'active' ? 'פעיל' : 'מושכר'}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{prop.city}</span>
                <span className="flex items-center gap-1"><Banknote className="w-3 h-3" />₪{prop.price?.toLocaleString()}</span>
                {prop.rooms && <span>{prop.rooms} חדרים</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
