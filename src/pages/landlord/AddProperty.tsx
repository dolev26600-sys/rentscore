import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';

export default function AddProperty() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', address: '', city: '', price: '', rooms: '', size_sqm: '',
    description: '', available_from: '', status: 'active',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.city || !form.price) return toast.error('נא למלא שדות חובה');
    setLoading(true);
    try {
      const { error } = await supabase.from('properties').insert({
        ...form,
        price: +form.price,
        rooms: form.rooms ? +form.rooms : null,
        size_sqm: form.size_sqm ? +form.size_sqm : null,
        landlord_id: user!.id,
      });
      if (error) { toast.error('שגיאה בשמירה'); return; }
      toast.success('הנכס נוסף!');
      navigate('/landlord/properties');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'title', label: 'כותרת', placeholder: 'דירת 3 חדרים בתל אביב', required: true },
    { key: 'address', label: 'כתובת', placeholder: 'רחוב הרצל 10' },
    { key: 'city', label: 'עיר', placeholder: 'תל אביב', required: true },
    { key: 'price', label: 'מחיר חודשי (₪)', placeholder: '5000', type: 'number', required: true },
    { key: 'rooms', label: 'חדרים', placeholder: '3', type: 'number' },
    { key: 'size_sqm', label: 'גודל (מ"ר)', placeholder: '80', type: 'number' },
    { key: 'available_from', label: 'פנויה מ-', placeholder: '', type: 'date' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <PageHeader title="הוסף נכס" backTo="/landlord/properties" />
      <form onSubmit={handleSubmit} className="mx-4 mt-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {f.label}{f.required && <span className="text-red-400 mr-1">*</span>}
              </label>
              <input
                type={f.type || 'text'}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-landlord-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">תיאור</label>
            <textarea
              rows={3}
              placeholder="פרטים נוספים על הדירה..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-landlord-500 resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-landlord-500 text-white font-bold py-4 rounded-2xl text-lg disabled:opacity-60"
        >
          {loading ? 'שומר...' : 'הוסף נכס'}
        </button>
      </form>
    </div>
  );
}
