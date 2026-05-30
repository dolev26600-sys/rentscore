import React from 'react';
import { Search, Lightbulb } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const tips = [
  { title: 'קבע תקציב מראש', desc: 'המלצה: שכ"ד לא יעלה על 30% מהכנסתך החודשית.' },
  { title: 'הכן מסמכים מראש', desc: 'תעודת זהות, 3 תלושי שכר, אישור עבודה, המלצות מבעלי נכס קודמים.' },
  { title: 'היה ראשון לענות', desc: 'פרסומים חדשים מתמלאים מהר – הגדר התראות ב-Yad2 ו-Facebook.' },
  { title: 'בדוק את הדירה ביום', desc: 'אור טבעי, רעש שכנים, לחות קירות, לחץ מים ומצב ברזים.' },
  { title: 'שוחח עם שכנים', desc: 'שאל שכנים על בעל הנכס, תחזוקה ומפגעים ידועים.' },
  { title: 'הכן מכתב היכרות', desc: 'מכתב קצר על עצמך מגדיל משמעותית את הסיכוי להיבחר.' },
  { title: 'בדוק היתרי בנייה', desc: 'וודא שהדירה חוקית ואין בעיות תכנוניות בנסח טאבו.' },
  { title: 'השתמש ב-RentScore', desc: 'פרופיל RentScore מוכן מראש חוסך זמן ובונה אמון מיידי.' },
];

export default function ApartmentSearch() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <PageHeader title="טיפים לחיפוש דירה" backTo="/tenant/guides" />
      <div className="mx-4 mt-4">
        <div className="bg-purple-600 rounded-2xl p-5 text-white mb-4">
          <Search className="w-10 h-10 mb-2" />
          <h2 className="text-xl font-bold">מצא דירה מהר יותר</h2>
          <p className="text-purple-100 text-sm mt-1">8 טיפים שיחסכו לך זמן וכסף</p>
        </div>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-purple-600 font-black text-sm">{i + 1}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{tip.title}</h3>
                <p className="text-gray-600 text-sm mt-0.5">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
