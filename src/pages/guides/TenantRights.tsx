import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const rights = [
  { title: 'פיקדון מוגבל', desc: 'בעל הנכס רשאי לגבות פיקדון של עד שלושה חודשי שכירות בלבד.' },
  { title: 'החזר פיקדון', desc: 'הפיקדון יוחזר תוך 60 יום מסיום החוזה אם אין נזקים.' },
  { title: 'אישור תיקונים', desc: 'תיקונים דחופים (נזילה, חשמל) – בעל הנכס חייב לטפל תוך 3 ימים.' },
  { title: 'פרטיות השוכר', desc: 'בעל הנכס אינו רשאי להיכנס לדירה ללא הודעה מראש של 48 שעות.' },
  { title: 'העלאת שכ"ד', desc: 'בחוזה קבוע – לא ניתן להעלות שכ"ד לפני תום התקופה ללא הסכמה.' },
  { title: 'סיום חוזה', desc: 'לסיום מוקדם נדרש הסכמה, אחרת ייתכן פיצוי לבעל הנכס.' },
  { title: 'חוזה בכתב', desc: 'לפי חוק שכירות הוגנת, חוזה לתקופה של מעל שנה חייב להיות בכתב.' },
  { title: 'סיווג ממ"ד', desc: 'ממ"ד אינו מוגדר כחדר לצורך חישוב שטח ואינו נכלל בדמי השכירות.' },
];

export default function TenantRights() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <PageHeader title="זכויות השוכר" backTo="/tenant/guides" />
      <div className="mx-4 mt-4">
        <div className="bg-blue-600 rounded-2xl p-5 text-white mb-4">
          <Shield className="w-10 h-10 mb-2" />
          <h2 className="text-xl font-bold">חוק שכירות הוגנת</h2>
          <p className="text-blue-100 text-sm mt-1">תשע"ז-2017 – הזכויות שלך כשוכר בישראל</p>
        </div>
        <div className="space-y-3">
          {rights.map(r => (
            <div key={r.title} className="bg-white rounded-xl p-4 shadow-sm flex gap-3">
              <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{r.title}</h3>
                <p className="text-gray-600 text-sm mt-0.5">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          המידע הוא כללי ואינו מהווה ייעוץ משפטי. לייעוץ פרטני פנה לעורך דין.
        </p>
      </div>
    </div>
  );
}
