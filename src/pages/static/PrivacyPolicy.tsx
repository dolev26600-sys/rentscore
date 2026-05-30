import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Shield } from 'lucide-react';

const sections = [
  {
    title: '1. איסוף מידע',
    body: 'אנו אוספים מידע שמסרת בעת הרישום: שם, כתובת דוא"ל, מספר טלפון וסיסמה (מוצפנת). כמו כן, אנו אוספים את המידע שמסרת בפרופיל השוכר שלך כגון עיר מגורים, תעסוקה ועוד. לא נאסוף מידע ממקורות חיצוניים ללא הסכמתך.',
  },
  {
    title: '2. שימוש במידע',
    body: 'המידע שנאסף משמש אך ורק לצורך מתן השירות: חישוב ציון RentScore, הצגת פרופיל לבעלי נכסים שאתה בוחר לשתף אתם, ושיפור שירותינו. לא נמכור את המידע לצדדים שלישיים.',
  },
  {
    title: '3. שיתוף מידע',
    body: 'הפרופיל שלך מוצג לבעלי נכסים רק כאשר אתה משתף אתם את הקישור האישי שלך. אנו עשויים לשתף מידע אנונימי ומצטבר לצורכי מחקר וסטטיסטיקה בלבד.',
  },
  {
    title: '4. אבטחת מידע',
    body: 'אנו נוקטים אמצעי אבטחה מתקדמים: הצפנת סיסמאות ב-SHA-256, חיבורים מוצפנים (HTTPS), ואחסון מאובטח בשרתי Supabase. בהתאם לתקנות הגנת הפרטיות (אבטחת מידע) תשע"ז-2017.',
  },
  {
    title: '5. זכויות המשתמש',
    body: 'יש לך הזכות לעיין במידע האגור עליך, לתקן אותו, או לבקש את מחיקתו. לבקשות אלה פנה אלינו בכתב לכתובת support@rentscore.co.il.',
  },
  {
    title: '6. עוגיות (Cookies)',
    body: 'אנו משתמשים בעוגיות חיוניות לצורך אימות המשתמש ושמירת הגדרות. לא נשתמש בעוגיות לצורכי פרסום.',
  },
  {
    title: '7. שינויים במדיניות',
    body: 'אנו רשאים לעדכן מדיניות זו. שינויים מהותיים יודיעו למשתמשים באמצעות דוא"ל. המשך השימוש בשירות לאחר הודעה כזו מהווה הסכמה למדיניות המעודכנת.',
  },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-tenant-700 pt-10 pb-6 px-6">
        <button onClick={() => navigate(-1)} className="text-tenant-200 text-sm mb-3 block">← חזרה</button>
        <div className="flex items-center gap-2 mb-1">
          <Home className="w-5 h-5 text-white" />
          <span className="text-white font-black text-lg">RentScore</span>
        </div>
        <h1 className="text-white text-2xl font-bold">מדיניות פרטיות</h1>
        <p className="text-tenant-200 text-xs mt-1">עודכן לאחרונה: ינואר 2025</p>
      </div>

      <div className="mx-4 mt-6">
        <div className="bg-tenant-50 border border-tenant-200 rounded-2xl p-4 flex gap-3 mb-4">
          <Shield className="w-5 h-5 text-tenant-600 shrink-0 mt-0.5" />
          <p className="text-tenant-700 text-sm">
            RentScore מחויבת להגן על פרטיותך בהתאם לחוק הגנת הפרטיות תשמ"א-1981.
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
          לשאלות: privacy@rentscore.co.il
        </p>
      </div>
    </div>
  );
}
