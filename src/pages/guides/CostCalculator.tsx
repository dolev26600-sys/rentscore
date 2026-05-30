import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

export default function CostCalculator() {
  const [rent, setRent] = useState(5000);
  const [deposit, setDeposit] = useState(2);
  const [moving, setMoving] = useState(2000);
  const [agent, setAgent] = useState(true);

  const depositAmount = rent * deposit;
  const agentFee = agent ? rent : 0;
  const total = depositAmount + moving + agentFee + rent;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <PageHeader title="מחשבון עלויות" backTo="/tenant/guides" />
      <div className="mx-4 mt-4">
        <div className="bg-landlord-500 rounded-2xl p-5 text-white mb-4">
          <Calculator className="w-10 h-10 mb-2" />
          <h2 className="text-xl font-bold">כמה זה עולה בסוף?</h2>
          <p className="text-landlord-100 text-sm mt-1">חשב את כל העלויות לפני המעבר</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-5 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              שכ"ד חודשי: <span className="text-landlord-600">₪{rent.toLocaleString()}</span>
            </label>
            <input type="range" min={2000} max={20000} step={100} value={rent}
              onChange={e => setRent(+e.target.value)} className="w-full accent-landlord-500" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₪2,000</span><span>₪20,000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              פיקדון: <span className="text-landlord-600">{deposit} חודשים</span>
            </label>
            <input type="range" min={1} max={3} step={1} value={deposit}
              onChange={e => setDeposit(+e.target.value)} className="w-full accent-landlord-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              עלות הובלה: <span className="text-landlord-600">₪{moving.toLocaleString()}</span>
            </label>
            <input type="range" min={0} max={10000} step={500} value={moving}
              onChange={e => setMoving(+e.target.value)} className="w-full accent-landlord-500" />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">תשלום לתיווך (חודש שכ"ד)</label>
            <button
              onClick={() => setAgent(!agent)}
              className={`w-12 h-6 rounded-full transition-colors ${agent ? 'bg-landlord-500' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow mx-0.5 transition-transform ${agent ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">סיכום עלויות</h3>
          {[
            { label: 'שכ"ד ראשון', value: rent },
            { label: `פיקדון (${deposit} חודשים)`, value: depositAmount },
            { label: 'הובלה', value: moving },
            { label: 'עמלת תיווך', value: agentFee },
          ].map(row => (
            <div key={row.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className="text-sm font-semibold text-gray-800">₪{row.value.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 mt-1">
            <span className="font-bold text-gray-800">סה"כ נדרש</span>
            <span className="font-black text-2xl text-landlord-600">₪{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
