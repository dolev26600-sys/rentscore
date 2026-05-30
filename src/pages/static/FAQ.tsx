import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const faqs = [
  {
    q: 'מה זה RentScore?',
    a: 'RentScore הוא פרופיל שוכר דיגיטלי המאפשר לשוכרים להוכיח את אמינותם לבעלי נכסים בצורה קלה ומהירה. הציון מחושב על בסיס נתוני השוכר ומוצג לבעלי נכסים עם אישור השוכר בלבד.',
  },
  {
    q: 'האם הנתונים שלי מאומתים?',
    a: 'הנתונים מוצהרים על ידי השוכר. אנו עובדים על מנגנוני אימות נוספים כגון אימות הכנסה ואימות זהות שיהיו זמינים בקרוב.',
  },
  {
    q: 'כיצד מחושב הציון?',
    a: 'הציון הבסיסי הוא 50. נוספות נקודות עבור שנות שכירות (+4 לשנה, עד 20), הכנסה מוצהרת (+5), ותק בעבודה (+3), מצב מגורים (+2), ערב זמין (+5), העדפת חוזה (+2). הציון המקסימלי הוא 100.',
  },
  {
    q: 'האם בעל הנכס יכול לראות את הפרופיל שלי ללא רשותי?',
    a: 'לא. הפרופיל נחשף רק כשאתה משתף את הקישור האישי שלך עם בעל נכס. ללא הקישור, הפרופיל אינו נגיש.',
  },
  {
    q: 'כמה עולה השירות?',
    a: 'RentScore חינמי לחלוטין לשוכרים. בעלי נכסים משלמים מנוי חודשי לגישה לתכונות מתקדמות.',
  },
  {
    q: 'כיצד אני מוחק את החשבון שלי?',
    a: 'לבקשת מחיקת חשבון, אנא פנה אלינו בדוא"ל support@rentscore.co.il. נמחק את כל נתוניך תוך 30 יום.',
  },
  {
    q: 'האם RentScore תואם לחוק הגנת הפרטיות?',
    a: 'כן. אנו פועלים בהתאם לחוק הגנת הפרטיות תשמ"א-1981 ותקנות הגנת הפרטיות (אבטחת מידע) תשע"ז-2017.',
  },
];

export default function FAQ() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-tenant-700 pt-10 pb-6 px-6">
        <button onClick={() => navigate(-1)} className="text-tenant-200 text-sm mb-3 block">← חזרה</button>
        <div className="flex items-center gap-2 mb-1">
          <Home className="w-5 h-5 text-white" />
          <span className="text-white font-black text-lg">RentScore</span>
        </div>
        <h1 className="text-white text-2xl font-bold">שאלות נפוצות</h1>
      </div>

      <div className="mx-4 mt-6 space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              className="w-full flex justify-between items-center px-4 py-4 text-right"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-bold text-gray-800 text-sm flex-1 text-right">{faq.q}</span>
              {open === i
                ? <ChevronUp className="w-5 h-5 text-tenant-500 shrink-0 mr-2" />
                : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 mr-2" />}
            </button>
            {open === i && (
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
