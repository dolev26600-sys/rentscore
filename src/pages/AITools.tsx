import React, { useState } from 'react';
import { Zap, FileText, MessageSquare, TrendingUp, HelpCircle, ChevronLeft, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import BottomNav from '../components/BottomNav';

type Tool = 'contract' | 'message' | 'coach' | 'legal' | null;

interface Flag {
  clause: string;
  status: 'green' | 'yellow' | 'red';
  explanation: string;
}

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (res.ok) {
    const data = await res.json();
    return data.result;
  }
  throw new Error('API unavailable');
}

function ContractAnalyzer() {
  const [contractText, setContractText] = useState('');
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!contractText.trim()) return toast.error('הדבק טקסט מהחוזה');
    setLoading(true);
    try {
      const prompt = `אתה עורך דין מומחה בדיני שכירות ישראליים. נתח את סעיפי החוזה הבא והחזר ניתוח בפורמט JSON עם מערך "flags" כאשר כל איבר מכיל: clause (שם הסעיף), status (green/yellow/red), explanation (הסבר קצר בעברית).

חוזה:
${contractText}

החזר רק JSON תקני.`;

      let result: string;
      try {
        result = await callClaude(prompt);
      } catch {
        // Demo response
        result = JSON.stringify({
          flags: [
            { clause: 'סעיף פיקדון', status: 'red', explanation: 'הפיקדון גבוה מ-3 חודשים – לא חוקי לפי חוק שכירות הוגנת' },
            { clause: 'כניסה לדירה', status: 'yellow', explanation: 'לא מצוין זמן הודעה מראש – מומלץ להוסיף 48 שעות' },
            { clause: 'תיקונים', status: 'green', explanation: 'האחריות לתיקונים מוגדרת בבירור' },
            { clause: 'תאריך סיום', status: 'green', explanation: 'מוגדר בבירור עם אפשרות חידוש' },
            { clause: 'העלאת שכ"ד', status: 'yellow', explanation: 'לא מצוין מנגנון הצמדה – בדוק אם מוסכם' },
          ]
        });
      }

      const json = JSON.parse(result.replace(/```json\n?|```/g, '').trim());
      setFlags(json.flags || []);
    } catch (err) {
      toast.error('שגיאה בניתוח');
    } finally {
      setLoading(false);
    }
  };

  const colors: Record<string, string> = {
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
  };
  const icons: Record<string, string> = { green: '✅', yellow: '⚠️', red: '🚨' };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">הדבק טקסט מהחוזה</label>
        <textarea
          rows={6}
          placeholder="הדבק כאן את תוכן החוזה שלך..."
          value={contractText}
          onChange={e => setContractText(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={analyze}
          disabled={loading}
          className="w-full mt-3 bg-purple-600 text-white font-bold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> מנתח...</> : 'נתח חוזה עם AI'}
        </button>
      </div>

      {flags.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-gray-800">תוצאות הניתוח</h3>
          {flags.map((f, i) => (
            <div key={i} className={`rounded-xl border p-3 ${colors[f.status]}`}>
              <div className="flex gap-2 items-start">
                <span className="text-lg">{icons[f.status]}</span>
                <div>
                  <p className="font-bold text-sm text-gray-800">{f.clause}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{f.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessageWriter() {
  const [form, setForm] = useState({ name: '', city: '', employment: '', price: '', notes: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!form.name) return toast.error('נא להזין שם');
    setLoading(true);
    try {
      const prompt = `כתוב הודעה אישית ומשכנעת בעברית לבעל נכס מהשוכר הפוטנציאלי:
שם: ${form.name}
עיר: ${form.city}
תעסוקה: ${form.employment}
תקציב: ${form.price}
פרטים נוספים: ${form.notes}

ההודעה צריכה להיות: קצרה (3-4 משפטים), אישית, מקצועית ומשכנעת. פתח עם שלום, הצג את עצמך, ציין יתרון אחד מרכזי ובקש לסדר צפייה.`;

      let result: string;
      try {
        result = await callClaude(prompt);
      } catch {
        result = `שלום,

שמי ${form.name} ואני ${form.employment} המחפש דירה ב${form.city} בתקציב של ${form.price} ₪.
אני שוכר אחראי עם היסטוריה נקייה, ומחפש דירה לטווח ארוך.
${form.notes ? form.notes + '.' : ''}
אשמח לסדר צפייה בהקדם האפשרי.

תודה, ${form.name}`;
      }

      setMessage(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        {[
          { key: 'name', label: 'שמך', placeholder: 'ישראל ישראלי' },
          { key: 'city', label: 'עיר מבוקשת', placeholder: 'תל אביב' },
          { key: 'employment', label: 'תעסוקה', placeholder: 'מהנדס תוכנה' },
          { key: 'price', label: 'תקציב (₪)', placeholder: '5,500' },
          { key: 'notes', label: 'פרטים מיוחדים', placeholder: 'גר לבד, אין חיות, ותק 3 שנים...' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
            <input
              placeholder={f.placeholder}
              value={(form as any)[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        ))}
        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> כותב...</> : 'כתוב הודעה עם AI'}
        </button>
      </div>

      {message && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800">ההודעה שלך</h3>
            <button
              onClick={() => { navigator.clipboard.writeText(message); toast.success('הועתק!'); }}
              className="text-xs text-purple-600 font-bold"
            >העתק</button>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 rounded-xl p-3">{message}</p>
        </div>
      )}
    </div>
  );
}

function ScoreCoach() {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ score: '', employment: '', years: '', city: '' });

  const analyze = async () => {
    setLoading(true);
    try {
      const prompt = `אתה יועץ שוכרים ישראלי. המשתמש הוא שוכר עם הנתונים הבאים:
ציון RentScore: ${profile.score || 'לא ידוע'}
תעסוקה: ${profile.employment || 'לא צוין'}
שנות שכירות: ${profile.years || 'לא צוין'}
עיר: ${profile.city || 'לא צוין'}

תן תוכנית שיפור ספציפית ומפורטת בעברית: מה לשפר, למה זה חשוב ואיך לעשות זאת. פרק ל-4-5 נקודות מעשיות.`;

      let result: string;
      try {
        result = await callClaude(prompt);
      } catch {
        result = `**תוכנית שיפור הציון שלך:**

1. **הוסף ערב (+5 נקודות)** – ערב מוסיף אמינות רבה. פנה לבן משפחה או חבר.

2. **השלם את פרטי התעסוקה (+3 נקודות)** – ציין מה הוותק שלך בעבודה הנוכחית.

3. **בקש המלצה (+5 נקודות)** – פנה לבעל נכס קודם ובקש המלצה קצרה.

4. **הוסף מידע על מגורים (+2 נקודות)** – ציין אם אתה גר לבד או עם שותפים.

5. **שתף את הפרופיל** – פרופיל מוכן מראש מגדיל שיעור מענה ב-60%.`;
      }

      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        {[
          { key: 'score', label: 'ציון RentScore נוכחי', placeholder: '65' },
          { key: 'employment', label: 'תעסוקה', placeholder: 'שכיר, מהנדס' },
          { key: 'years', label: 'שנות שכירות', placeholder: '3' },
          { key: 'city', label: 'עיר', placeholder: 'תל אביב' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
            <input
              placeholder={f.placeholder}
              value={(profile as any)[f.key]}
              onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        ))}
        <button
          onClick={analyze}
          disabled={loading}
          className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> מנתח...</> : 'קבל תוכנית שיפור'}
        </button>
      </div>

      {analysis && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-2">תוכנית השיפור שלך</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{analysis}</p>
        </div>
      )}
    </div>
  );
}

function LegalQA() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return toast.error('כתוב שאלה');
    setLoading(true);
    try {
      const prompt = `אתה עורך דין מומחה בדיני שכירות ישראליים. ענה על השאלה הבאה בעברית בצורה מדויקת, מועילה ומקיפה. ציין חוקים רלוונטיים אם קיימים.

שאלה: ${question}

הוסף בסוף: "* המידע הוא כללי ואינו מהווה ייעוץ משפטי פרטני."`;

      let result: string;
      try {
        result = await callClaude(prompt);
      } catch {
        result = `תשובה לשאלתך: ${question}

בנושא זה חוק שכירות הוגנת (תשע"ז-2017) קובע הגנות ספציפיות לשוכרים בישראל.

עפ"י החוק, השוכר זכאי לקבל חוזה בכתב, הפיקדון מוגבל ל-3 חודשים, ובעל הנכס חייב לטפל בתיקונים דחופים.

לשאלות ספציפיות מומלץ לפנות ללשכת עורכי הדין או לייעוץ משפטי פרטני.

* המידע הוא כללי ואינו מהווה ייעוץ משפטי פרטני.`;
      }

      setAnswer(result);
    } finally {
      setLoading(false);
    }
  };

  const examples = ['האם בעל הנכס יכול להיכנס לדירה ללא אישור?', 'מה עושים אם בעל הנכס לא מחזיר פיקדון?', 'האם מותר לו לעלות שכ"ד באמצע חוזה?'];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">שאל שאלה משפטית</label>
        <textarea
          rows={3}
          placeholder="לדוגמה: האם בעל הנכס יכול להוציא אותי ללא הודעה מראש?"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {examples.map(ex => (
            <button key={ex} onClick={() => setQuestion(ex)} className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-lg">
              {ex}
            </button>
          ))}
        </div>
        <button
          onClick={ask}
          disabled={loading}
          className="w-full mt-3 bg-purple-600 text-white font-bold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> מחפש תשובה...</> : 'שאל את AI'}
        </button>
      </div>

      {answer && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-2">תשובה</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}

const tools = [
  { id: 'contract' as Tool, icon: FileText, label: 'ניתוח חוזה', desc: 'אתר סעיפים בעייתיים', color: 'from-red-500 to-red-700' },
  { id: 'message' as Tool, icon: MessageSquare, label: 'כתיבת הודעה', desc: 'הודעה מנצחת לבעל נכס', color: 'from-blue-500 to-blue-700' },
  { id: 'coach' as Tool, icon: TrendingUp, label: 'מאמן ציון', desc: 'תוכנית שיפור אישית', color: 'from-green-500 to-green-700' },
  { id: 'legal' as Tool, icon: HelpCircle, label: 'שאל משפטי', desc: 'שאלות על חוק שכירות', color: 'from-purple-500 to-purple-700' },
];

export default function AITools() {
  const [active, setActive] = useState<Tool>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="כלי AI" backTo="/tenant/home" />

      {/* Hero */}
      <div className="mx-4 mt-4 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-5 text-white mb-4">
        <Zap className="w-8 h-8 mb-2" />
        <h2 className="text-xl font-bold">בינה מלאכותית לשוכרים</h2>
        <p className="text-purple-200 text-sm mt-1">כלים חכמים לניתוח חוזים, כתיבת הודעות ושאלות משפטיות</p>
      </div>

      {!active ? (
        <div className="mx-4 grid grid-cols-2 gap-3">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActive(tool.id)}
              className={`bg-gradient-to-br ${tool.color} rounded-2xl p-4 text-right shadow-md active:scale-95 transition-transform`}
            >
              <tool.icon className="w-8 h-8 text-white mb-2" />
              <p className="text-white font-bold text-sm">{tool.label}</p>
              <p className="text-white/70 text-xs mt-0.5">{tool.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="mx-4">
          <button
            onClick={() => setActive(null)}
            className="flex items-center gap-1 text-gray-500 text-sm mb-4"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
            כל הכלים
          </button>
          <h2 className="font-bold text-gray-800 text-lg mb-4">
            {tools.find(t => t.id === active)?.label}
          </h2>
          {active === 'contract' && <ContractAnalyzer />}
          {active === 'message' && <MessageWriter />}
          {active === 'coach' && <ScoreCoach />}
          {active === 'legal' && <LegalQA />}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
