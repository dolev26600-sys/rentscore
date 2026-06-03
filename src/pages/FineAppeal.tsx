import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Copy, Download, AlertCircle } from 'lucide-react';

const BG = '#18243A';
const GOLD = '#F59E0B';
const TEAL = '#06B6D4';
const GREEN = '#22C55E';

type Step = 'form' | 'loading' | 'result';

interface FormData {
  fineType: string;
  fineAmount: string;
  fineDate: string;
  location: string;
  circumstances: string;
  driverHistory: string;
  additionalInfo: string;
}

export default function FineAppeal() {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<FormData>({
    fineType: '',
    fineAmount: '',
    fineDate: '',
    location: '',
    circumstances: '',
    driverHistory: 'clean',
    additionalInfo: '',
  });
  const [appealText, setAppealText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const fineTypes = [
    { value: 'speed', label: '🚗 עבירת מהירות' },
    { value: 'parking', label: '🅿️ חניה אסורה' },
    { value: 'red_light', label: '🚦 אור אדום' },
    { value: 'phone', label: '📱 שימוש בטלפון' },
    { value: 'seatbelt', label: '🔒 חגורת בטיחות' },
    { value: 'other', label: '📋 אחר' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fineType || !form.circumstances) {
      setError('יש למלא את סוג הקנס ונסיבות האירוע');
      return;
    }
    setError('');
    setStep('loading');

    const fineLabel = fineTypes.find(f => f.value === form.fineType)?.label || form.fineType;
    const historyText = form.driverHistory === 'clean' ? 'ללא עבר תעבורתי' :
      form.driverHistory === 'minor' ? 'עבר תעבורתי קל' : 'עבר תעבורתי';

    const prompt = `אתה עוזר בכתיבת ערעורים על קנסות תנועה בישראל. כתוב ערעור מקצועי ומשכנע בעברית.

פרטי הקנס:
- סוג עבירה: ${fineLabel}
- סכום: ${form.fineAmount ? form.fineAmount + ' ₪' : 'לא צוין'}
- תאריך: ${form.fineDate || 'לא צוין'}
- מיקום: ${form.location || 'לא צוין'}
- נסיבות: ${form.circumstances}
- היסטוריה: ${historyText}
${form.additionalInfo ? `- מידע נוסף: ${form.additionalInfo}` : ''}

כתוב ערעור רשמי הכולל:
1. פתיח מכובד לבית הדין לתעבורה
2. תיאור עובדתי מדויק של הנסיבות
3. טיעונים משפטיים תקינים (השתמש בחוק התעבורה הישראלי)
4. בקשה ברורה לביטול / הפחתת הקנס
5. סיום מכובד

שים לב: כתוב מידע עובדתי בלבד. הוסף בסוף: "הטקסט לעיל הוא טיוטה עובדתית בלבד ואינו מהווה ייעוץ משפטי."`;

    try {
      const res = await fetch('/.netlify/functions/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.result) {
        setAppealText(data.result);
        setStep('result');
      } else {
        throw new Error(data.error || 'שגיאה בלתי צפויה');
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה. נסה שוב.');
      setStep('form');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(appealText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(248,250,252,0.06)',
    border: '1px solid rgba(248,250,252,0.12)',
    borderRadius: 12,
    padding: '12px 16px',
    color: '#F8FAFC',
    fontSize: 15,
    fontFamily: 'Heebo, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    direction: 'rtl',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'rgba(248,250,252,0.7)',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    fontFamily: 'Heebo, sans-serif',
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, direction: 'rtl', fontFamily: 'Heebo, sans-serif', position: 'relative' }}>
      {/* Ambient background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 60%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 60%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(248,250,252,0.4)', textDecoration: 'none', fontSize: 14, marginBottom: 24 }}>
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
            חזור
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              🚗
            </div>
            <div>
              <h1 style={{ color: '#F8FAFC', fontSize: 22, fontWeight: 800, margin: 0 }}>ערעור קנס תנועה</h1>
              <p style={{ color: 'rgba(248,250,252,0.45)', fontSize: 13, margin: 0 }}>AI כותב את הערעור שלך — חינם</p>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
            {[
              { label: '30 יום לערעור', color: GOLD },
              { label: '~40% הצלחה בערעורים', color: GREEN },
              { label: 'ללא עו"ד', color: TEAL },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: 'rgba(248,250,252,0.04)', border: '1px solid rgba(248,250,252,0.08)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                <span style={{ color: s.color, fontSize: 11, fontWeight: 700 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'rgba(248,250,252,0.04)', border: '1px solid rgba(248,250,252,0.08)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Fine type */}
              <div>
                <label style={labelStyle}>סוג העבירה *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {fineTypes.map(ft => (
                    <button key={ft.value} type="button"
                      onClick={() => setForm(f => ({ ...f, fineType: ft.value }))}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: form.fineType === ft.value ? `1px solid ${TEAL}` : '1px solid rgba(248,250,252,0.1)',
                        background: form.fineType === ft.value ? 'rgba(6,182,212,0.12)' : 'rgba(248,250,252,0.03)',
                        color: form.fineType === ft.value ? TEAL : 'rgba(248,250,252,0.6)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Heebo, sans-serif',
                        textAlign: 'right',
                      }}>
                      {ft.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount + Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>סכום הקנס (₪)</label>
                  <input style={inputStyle} type="number" placeholder="250" value={form.fineAmount}
                    onChange={e => setForm(f => ({ ...f, fineAmount: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>תאריך הקנס</label>
                  <input style={inputStyle} type="date" value={form.fineDate}
                    onChange={e => setForm(f => ({ ...f, fineDate: e.target.value }))} />
                </div>
              </div>

              {/* Location */}
              <div>
                <label style={labelStyle}>מיקום האירוע</label>
                <input style={inputStyle} type="text" placeholder="למשל: כביש 1, קרוב לצומת גלילות" value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>

              {/* Circumstances — key field */}
              <div>
                <label style={labelStyle}>תאר את הנסיבות *</label>
                <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                  placeholder="למשל: נסעתי לבית חולים בגלל מצב חירום, הכביש היה ריק לחלוטין, השלט לא היה ברור..."
                  value={form.circumstances}
                  onChange={e => setForm(f => ({ ...f, circumstances: e.target.value }))} />
                <p style={{ color: 'rgba(248,250,252,0.3)', fontSize: 12, margin: '4px 0 0' }}>ככל שתפרט יותר — הערעור יהיה חזק יותר</p>
              </div>

              {/* Driver history */}
              <div>
                <label style={labelStyle}>היסטוריית נהיגה</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { value: 'clean', label: 'נקי לחלוטין' },
                    { value: 'minor', label: 'עבר קל' },
                    { value: 'some', label: 'מספר עבירות' },
                  ].map(h => (
                    <button key={h.value} type="button"
                      onClick={() => setForm(f => ({ ...f, driverHistory: h.value }))}
                      style={{
                        flex: 1, padding: '9px 8px', borderRadius: 10,
                        border: form.driverHistory === h.value ? `1px solid ${GOLD}` : '1px solid rgba(248,250,252,0.1)',
                        background: form.driverHistory === h.value ? 'rgba(245,158,11,0.1)' : 'rgba(248,250,252,0.03)',
                        color: form.driverHistory === h.value ? GOLD : 'rgba(248,250,252,0.5)',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
                      }}>
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional */}
              <div>
                <label style={labelStyle}>מידע נוסף (אופציונלי)</label>
                <input style={inputStyle} type="text" placeholder="שוטר לא הציג עצמו, חיישן תקלה, עד בסביבה..."
                  value={form.additionalInfo}
                  onChange={e => setForm(f => ({ ...f, additionalInfo: e.target.value }))} />
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px' }}>
                  <AlertCircle size={16} color="#EF4444" />
                  <span style={{ color: '#FCA5A5', fontSize: 13 }}>{error}</span>
                </div>
              )}

              <button type="submit" style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: `linear-gradient(135deg, ${TEAL}, #0891B2)`,
                color: '#fff', border: 'none', fontSize: 16, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
                boxShadow: '0 8px 24px rgba(6,182,212,0.3)',
              }}>
                ✍️ כתוב לי את הערעור — חינם
              </button>
            </div>

            <p style={{ textAlign: 'center', color: 'rgba(248,250,252,0.25)', fontSize: 12, marginTop: 16 }}>
              המידע שגולשים מזינים לא נשמר ואינו משותף עם צד שלישי
            </p>
          </form>
        )}

        {step === 'loading' && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', border: `3px solid rgba(6,182,212,0.2)`, borderTopColor: TEAL, margin: '0 auto 24px', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <p style={{ color: '#F8FAFC', fontSize: 18, fontWeight: 700 }}>AI כותב את הערעור שלך...</p>
            <p style={{ color: 'rgba(248,250,252,0.4)', fontSize: 14, marginTop: 8 }}>מנתח את הנסיבות ומכין טיעונים</p>
          </div>
        )}

        {step === 'result' && (
          <div>
            {/* Success header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
              <CheckCircle size={20} color={GREEN} />
              <span style={{ color: GREEN, fontWeight: 700, fontSize: 15 }}>הערעור מוכן! העתק ושלח לבית הדין לתעבורה</span>
            </div>

            {/* Appeal text */}
            <div style={{ background: 'rgba(248,250,252,0.04)', border: '1px solid rgba(248,250,252,0.1)', borderRadius: 16, padding: 20, marginBottom: 16, position: 'relative' }}>
              <pre style={{ color: 'rgba(248,250,252,0.85)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'Heebo, sans-serif', margin: 0 }}>
                {appealText}
              </pre>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <button onClick={handleCopy} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px', borderRadius: 12,
                background: copied ? 'rgba(34,197,94,0.15)' : `linear-gradient(135deg, ${TEAL}, #0891B2)`,
                border: copied ? `1px solid ${GREEN}` : 'none',
                color: copied ? GREEN : '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
              }}>
                {copied ? <><CheckCircle size={16} /> הועתק!</> : <><Copy size={16} /> העתק טקסט</>}
              </button>
              <button onClick={() => setStep('form')} style={{
                padding: '13px 20px', borderRadius: 12,
                background: 'rgba(248,250,252,0.06)', border: '1px solid rgba(248,250,252,0.1)',
                color: 'rgba(248,250,252,0.6)', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
              }}>
                כתוב שוב
              </button>
            </div>

            {/* How to submit */}
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <p style={{ color: GOLD, fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>📬 איך מגישים את הערעור?</p>
              <ol style={{ color: 'rgba(248,250,252,0.6)', fontSize: 13, margin: 0, paddingRight: 20, lineHeight: 2 }}>
                <li>העתק את הטקסט לעיל</li>
                <li>כנס לאתר בתי הדין לתעבורה (משפטים.gov.il)</li>
                <li>בחר "הגשת ערעור מנהלי" — ניתן גם ללא עורך דין</li>
                <li>הדבק את הטקסט ושלח</li>
              </ol>
              <p style={{ color: 'rgba(248,250,252,0.35)', fontSize: 11, margin: '12px 0 0' }}>
                * הטקסט הוא טיוטה עובדתית בלבד ואינו מהווה ייעוץ משפטי. לייעוץ פרטני פנה לעורך דין.
              </p>
            </div>

            {/* Upsell to full platform */}
            <div style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
              <p style={{ color: TEAL, fontWeight: 700, fontSize: 15, margin: '0 0 6px' }}>רוצה לגלות כסף נוסף שמגיע לך?</p>
              <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 13, margin: '0 0 14px' }}>בממוצע, לישראלי יש 18,000₪+ בכסף לא מנוצל — פנסיה, מס הכנסה, ביטוח לאומי</p>
              <Link to="/zakai" style={{
                display: 'inline-block', padding: '10px 24px', borderRadius: 10,
                background: `linear-gradient(135deg, ${TEAL}, #0891B2)`,
                color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700,
              }}>
                בדוק מה מגיע לך — חינם →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
