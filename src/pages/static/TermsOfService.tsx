import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, FileText } from 'lucide-react';

const sections = [
  {
    title: '1. קבלת התנאים',
    body: 'השימוש בשירות RentScore מהווה הסכמה לתנאי שימוש אלה. אם אינך מסכים לתנאים, אנא הימנע מהשימוש בשירות.',
  },
  {
    title: '2. תיאור השירות',
    body: 'RentScore מספקת פלטפורמה לבניית פרופיל שוכר דיגיטלי. השירות אינו מהווה ייעוץ פיננסי, משפטי או נדל"ני. RentScore אינה צד לעסקת השכירות.',
  },
  {
    title: '3. דיוק המידע',
    body: 'המשתמש מצהיר כי המידע שמסר הוא נכון, מדויק ומעודכן. מסירת מידע שקרי או מטעה מהווה הפרת תנאי שימוש אלה ועלולה לגרום לסיום החשבון.',
  },
  {
    title: '4. אחריות',
    body: 'RentScore אינה אחראית לנזקים הנובעים מהסתמכות על המידע בפרופילים. ציון RentScore הוא כלי עזר בלבד ואינו ערובה לאמינות השוכר.',
  },
  {
    title: '5. קניין רוחני',
    body: 'כל התוכן, הלוגו, העיצוב ושם המותג RentScore הם קניינה הבלעדי של החברה. אין להשתמש בהם ללא אישור מראש ובכתב.',
  },
  {
    title: '6. סיום חשבון',
    body: 'RentScore רשאית להשעות או לסגור חשבון שהפר תנאי שימוש אלה. המשתמש רשאי לסגור את חשבונו בכל עת על ידי פנייה לתמיכה.',
  },
  {
    title: '7. שינויים בשירות',
    body: 'RentScore רשאית לשנות, להוסיף או להסיר תכונות מהשירות בכל עת. שינויים מהותיים יודיעו למשתמשים מראש.',
  },
  {
    title: '8. דין וסמכות שיפוט',
    body: 'תנאים אלה כפופים לדין הישראלי. סמכות השיפוט הבלעדית תהא לבתי המשפט המוסמכים בתל אביב-יפו.',
  },
];

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-tenant-700 pt-10 pb-6 px-6">
        <button onClick={() => navigate(-1)} className="text-tenant-200 text-sm mb-3 block">← חזרה</button>
        <div className="flex items-center gap-2 mb-1">
          <Home className="w-5 h-5 text-white" />
          <span className="text-white font-black text-lg">RentScore</span>
        </div>
        <h1 className="text-white text-2xl font-bold">תנאי שימוש</h1>
        <p className="text-tenant-200 text-xs mt-1">עודכן לאחרונה: ינואר 2025</p>
      </div>

      <div className="mx-4 mt-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mb-4">
          <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-amber-700 text-sm">
            נא לקרוא תנאים אלה בעיון לפני השימוש בשירות.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map(s => (
            <div key={s.title} className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-2">{s.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          לשאלות: legal@rentscore.co.il
        </p>
      </div>
    </div>
  );
}
