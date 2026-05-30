import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Home } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('נא למלא את כל השדות');
    setSent(true);
    toast.success('הודעתך נשלחה! נחזור אליך בהקדם.');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-tenant-700 pt-10 pb-6 px-6">
        <button onClick={() => navigate(-1)} className="text-tenant-200 text-sm mb-3 block">← חזרה</button>
        <div className="flex items-center gap-2 mb-1">
          <Home className="w-5 h-5 text-white" />
          <span className="text-white font-black text-lg">RentScore</span>
        </div>
        <h1 className="text-white text-2xl font-bold">צור קשר</h1>
      </div>

      <div className="mx-4 mt-6 space-y-4">
        {/* Contact options */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Mail, label: 'דוא"ל', value: 'support@rentscore.co.il' },
            { icon: Phone, label: 'טלפון', value: '03-000-0000' },
            { icon: MessageCircle, label: 'וואטסאפ', value: 'זמין 9-18' },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
              <c.icon className="w-6 h-6 text-tenant-500 mx-auto mb-1" />
              <p className="text-xs font-bold text-gray-800">{c.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        {!sent ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-800">שלח לנו הודעה</h2>
            {[
              { key: 'name', label: 'שם מלא', type: 'text' },
              { key: 'email', label: 'דוא"ל', type: 'email' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                <input
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tenant-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">הודעה</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-tenant-500"
              />
            </div>
            <button type="submit" className="w-full bg-tenant-600 text-white font-bold py-3 rounded-xl">
              שלח הודעה
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-tenant-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-tenant-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">הודעה נשלחה!</h2>
            <p className="text-gray-500 text-sm">נחזור אליך תוך יום עסקים אחד.</p>
          </div>
        )}
      </div>
    </div>
  );
}
