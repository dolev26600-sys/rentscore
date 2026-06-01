import React, { useState } from 'react';
import { Zap, FileText, MessageSquare, TrendingUp, HelpCircle, ChevronRight, Loader, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import BottomNav from '../components/BottomNav';

type Tool = 'contract' | 'message' | 'coach' | 'legal' | null;

interface Flag { clause: string; status: 'green' | 'yellow' | 'red'; explanation: string; }

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch('/.netlify/functions/ai', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (res.ok && data.result) return data.result;
  throw new Error(data.error || `שגיאה ${res.status}`);
}

const Disclaimer = () => (
  <div className="flex items-start gap-2 rounded-xl p-3 mt-3" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
    <span className="text-amber-500 text-sm mt-0.5 flex-shrink-0">⚠️</span>
    <p className="text-[11px] leading-relaxed" style={{ color: '#92400E' }}>
      המידע הוא כללי בלבד ואינו מהווה ייעוץ משפטי. לייעוץ פרטני פנה לעורך דין.
    </p>
  </div>
);

function ContractAnalyzer() {
  const [text, setText] = useState('');
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return toast.error('הדבק טקסט מהחוזה');
    setLoading(true);
    try {
      const prompt = `אתה מומחה לחוזי שכירות בישראל. נתח את החוזה מנקודת מבט השוכר.
זהה סעיפים שאינם סטנדרטיים (אדום), סעיפים שכדאי לשים לב אליהם (צהוב), וסעיפים סטנדרטיים (ירוק).
חשוב: תן מידע עובדתי בלבד. אל תייעץ "אל תחתום". אמור "סעיפים מסוג זה אינם שכיחים".
החזר JSON בלבד: { "flags": [{ "clause": "שם הסעיף", "status": "red"|"yellow"|"green", "explanation": "הסבר קצר בעברית" }] }
מקסימום 7 סעיפים. חוזה:\n${text}`;
      const result = await callClaude(prompt);
      const json = JSON.parse(result.replace(/```json\n?|```/g, '').trim());
      setFlags(json.flags || []);
    } catch { toast.error('שגיאה בניתוח'); }
    finally { setLoading(false); }
  };

  const statusStyle: Record<string, { bg: string; border: string; color: string; icon: string }> = {
    green:  { bg: '#F0FDF4', border: '#BBF7D0', color: '#166534', icon: '✅' },
    yellow: { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E', icon: '⚠️' },
    red:    { bg: '#FEF2F2', border: '#FECACA', color: '#7F1D1D', icon: '🚨' },
  };

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label mb-2 block">הדבק טקסט מהחוזה</label>
        <textarea rows={6} placeholder="הדבק כאן את תוכן החוזה שלך..."
          value={text} onChange={e => setText(e.target.value)}
          className="input-field resize-none" />
        <button onClick={analyze} disabled={loading} className="btn btn-primary btn-md w-full mt-3">
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> מנתח...</> : 'נתח חוזה עם AI'}
        </button>
        <Disclaimer />
      </div>

      {flags.length > 0 && (
        <div className="space-y-2">
          <p className="section-label">תוצאות הניתוח</p>
          {flags.map((f, i) => {
            const s = statusStyle[f.status];
            return (
              <div key={i} className="rounded-2xl p-3.5 border" style={{ background: s.bg, borderColor: s.border }}>
                <div className="flex gap-2.5 items-start">
                  <span className="text-base">{s.icon}</span>
                  <div>
                    <p className="font-bold text-sm" style={{ color: s.color }}>{f.clause}</p>
                    <p className="text-sm mt-0.5 leading-relaxed" style={{ color: s.color, opacity: 0.8 }}>{f.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MessageWriter() {
  const [form, setForm] = useState({ name: '', city: '', employment: '', price: '', notes: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!form.name) return toast.error('נא להזין שם');
    setLoading(true);
    try {
      const prompt = `כתוב הודעת WhatsApp קצרה ומשכנעת בעברית לבעל נכס.
פרטי השוכר: שם ${form.name}, עובד כ${form.employment || 'שכיר'}, תקציב ${form.price}₪, מחפש ב${form.city || 'האזור'}.${form.notes ? ' ' + form.notes : ''}
דרישות: 3 משפטים בלבד. פתח בשלום + שם, ציין תעסוקה ויתרון אחד, סיים בבקשת צפייה. ללא כותרות.`;
      const result = await callClaude(prompt);
      setMessage(result);
    } catch (err: any) { toast.error(err.message || 'שגיאה'); }
    finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast.success('הועתק!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        {[
          { key: 'name', label: 'שמך', placeholder: 'ישראל ישראלי' },
          { key: 'city', label: 'עיר מבוקשת', placeholder: 'תל אביב' },
          { key: 'employment', label: 'תעסוקה', placeholder: 'מהנדס תוכנה' },
          { key: 'price', label: 'תקציב (₪)', placeholder: '5,500' },
          { key: 'notes', label: 'פרטים מיוחדים (אופציונלי)', placeholder: 'גר לבד, אין חיות...' },
        ].map(f => (
          <div key={f.key}>
            <label className="label mb-1.5 block">{f.label}</label>
            <input placeholder={f.placeholder} value={(form as any)[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="input-field" />
          </div>
        ))}
        <button onClick={generate} disabled={loading} className="btn btn-primary btn-md w-full">
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> כותב...</> : 'כתוב הודעה עם AI'}
        </button>
      </div>

      {message && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="font-bold text-gray-900">ההודעה שלך</p>
            <button onClick={copy} className="flex items-center gap-1.5 text-sm font-bold" style={{ color: '#00B89F' }}>
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'הועתק!' : 'העתק'}
            </button>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed p-3 rounded-xl bg-gray-50">{message}</p>
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
      const prompt = `אתה יועץ מומחה לשוכרים בישראל. נתח את הפרופיל ותן עצות ספציפיות לשיפור.
פרטים: ציון ${profile.score || 'לא ידוע'}, תעסוקה: ${profile.employment || 'לא צוין'}, שנות שכירות: ${profile.years || 'לא צוין'}, עיר: ${profile.city || 'לא צוין'}.
תן בדיוק 4 עצות. כל עצה: **כותרת** — הסבר קצר + "יוסיף X נקודות לציון". כתוב בעברית ישיר ומעשי.`;
      const result = await callClaude(prompt);
      setAnalysis(result);
    } catch (err: any) { toast.error(err.message || 'שגיאה'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        {[
          { key: 'score', label: 'ציון RentScore נוכחי', placeholder: '65' },
          { key: 'employment', label: 'תעסוקה', placeholder: 'שכיר, מהנדס' },
          { key: 'years', label: 'שנות שכירות', placeholder: '3' },
          { key: 'city', label: 'עיר', placeholder: 'תל אביב' },
        ].map(f => (
          <div key={f.key}>
            <label className="label mb-1.5 block">{f.label}</label>
            <input placeholder={f.placeholder} value={(profile as any)[f.key]}
              onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
              className="input-field" />
          </div>
        ))}
        <button onClick={analyze} disabled={loading} className="btn btn-primary btn-md w-full">
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> מנתח...</> : 'קבל תוכנית שיפור'}
        </button>
      </div>
      {analysis && (
        <div className="card p-4">
          <p className="font-bold text-gray-900 mb-3">תוכנית השיפור שלך</p>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{analysis}</p>
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
      const prompt = `אתה יועץ משפטי מומחה לדיני שכירות בישראל. ענה על השאלה.
מבנה: (1) תשובה ישירה, (2) החוק הרלוונטי, (3) המלצה מעשית. כתוב בעברית ברורה. סיים ב: "* אינו ייעוץ משפטי פרטני."
שאלה: ${question}`;
      const result = await callClaude(prompt);
      setAnswer(result);
    } catch (err: any) { toast.error(err.message || 'שגיאה'); }
    finally { setLoading(false); }
  };

  const examples = ['האם בעל הנכס יכול להיכנס לדירה ללא אישור?', 'מה עושים אם בעל הנכס לא מחזיר פיקדון?', 'האם מותר לו לעלות שכ"ד באמצע חוזה?'];

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label mb-2 block">שאל שאלה משפטית</label>
        <textarea rows={3} placeholder="לדוגמה: האם בעל הנכס יכול להוציא אותי ללא הודעה?"
          value={question} onChange={e => setQuestion(e.target.value)} className="input-field resize-none" />
        <div className="flex gap-2 mt-2 flex-wrap">
          {examples.map(ex => (
            <button key={ex} onClick={() => setQuestion(ex)}
              className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: '#E6FAF7', color: '#007D6B' }}>
              {ex}
            </button>
          ))}
        </div>
        <button onClick={ask} disabled={loading} className="btn btn-primary btn-md w-full mt-3">
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> מחפש תשובה...</> : 'שאל את AI'}
        </button>
        <Disclaimer />
      </div>
      {answer && (
        <div className="card p-4">
          <p className="font-bold text-gray-900 mb-3">תשובה</p>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

const tools = [
  { id: 'contract' as Tool, icon: FileText,    label: 'ניתוח חוזה',    desc: 'אתר סעיפים בעייתיים',      color: '#00B89F', bg: 'rgba(0,184,159,0.1)' },
  { id: 'message' as Tool, icon: MessageSquare, label: 'כתיבת הודעה',   desc: 'הודעה מנצחת לבעל נכס',    color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  { id: 'coach'   as Tool, icon: TrendingUp,   label: 'מאמן ציון',     desc: 'תוכנית שיפור אישית',       color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  { id: 'legal'   as Tool, icon: HelpCircle,   label: 'שאל משפטי',    desc: 'שאלות על חוק שכירות',      color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
];

export default function AITools() {
  const [active, setActive] = useState<Tool>(null);
  const activeTool = tools.find(t => t.id === active);

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F0F4FA' }}>
      <PageHeader title={active ? activeTool?.label || 'כלי AI' : 'כלי AI'} backTo={active ? undefined : '/tenant/home'} onBack={active ? () => setActive(null) : undefined} />

      {!active ? (
        <>
          {/* Hero */}
          <div className="mx-4 mt-4 rounded-2xl p-5 text-white mb-5"
            style={{ background: 'linear-gradient(135deg,#0A1C3D,#162B4E)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#00B89F' }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <p className="font-black text-white">AI לשוכרים</p>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              ניתוח חוזים, כתיבת הודעות ושאלות משפטיות — הכל בעברית, הכל חינם
            </p>
          </div>

          <div className="mx-4 grid grid-cols-2 gap-3">
            {tools.map(tool => (
              <button key={tool.id} onClick={() => setActive(tool.id)}
                className="card p-4 text-right hover:shadow-md transition-all active:scale-[0.97]">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3" style={{ background: tool.bg }}>
                  <tool.icon className="w-5 h-5" style={{ color: tool.color }} />
                </div>
                <p className="font-black text-sm text-gray-900">{tool.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#8092AE' }}>{tool.desc}</p>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="mx-4 mt-4">
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
