import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const items = [
  'תאריך תחילה וסיום החוזה מצוינים בבירור',
  'סכום השכירות החודשית מפורט',
  'מועד התשלום החודשי מוגדר',
  'גובה הפיקדון לא עולה על 3 חודשים',
  'תנאי החזרת הפיקדון מפורטים',
  'אחריות לתיקונים מוגדרת',
  'אפשרות כניסה לדירה על ידי בעל הנכס מוגבלת',
  'תנאי סיום מוקדם מפורטים',
  'מה כלול בשכ"ד (חשמל, מים, ועד בית)',
  'אם מותר לגור עם שותפים',
  'מדיניות חיות מחמד ועישון',
  'אחריות לתיקון מכשירים',
  'האם ניתן לצבוע או לתלות תמונות',
  'תנאי חידוש חוזה',
  'אחריות בגין נזקים',
  'ביטוח דירה – מי אחראי',
  'פרטי הצדדים מלאים',
  'חתימות על כל הדפים',
  'עותק מקורי לכל צד',
  'בדיקת נכס לפני כניסה ופרוטוקול מצב הנכס',
];

export default function LeaseChecklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setChecked(p => {
    const n = new Set(p);
    n.has(i) ? n.delete(i) : n.add(i);
    return n;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <PageHeader title="רשימת תיוג לחוזה" backTo="/tenant/guides" />
      <div className="mx-4 mt-4">
        <div className="bg-tenant-600 rounded-2xl p-5 text-white mb-4">
          <FileText className="w-10 h-10 mb-2" />
          <h2 className="text-xl font-bold">20 נקודות לפני חתימה</h2>
          <p className="text-tenant-100 text-sm mt-1">סמן כל נקודה שבדקת</p>
          <div className="mt-3 bg-white/20 rounded-xl h-2">
            <div className="bg-white rounded-xl h-2 transition-all" style={{ width: `${(checked.size / items.length) * 100}%` }} />
          </div>
          <p className="text-xs text-tenant-100 mt-1">{checked.size}/{items.length} נבדקו</p>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`w-full bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm text-right transition-all ${checked.has(i) ? 'opacity-60' : ''}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${checked.has(i) ? 'border-tenant-500 bg-tenant-500' : 'border-gray-300'}`}>
                {checked.has(i) && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={`text-sm ${checked.has(i) ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
