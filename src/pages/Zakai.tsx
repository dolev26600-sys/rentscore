import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BG = '#18243A';
const GOLD = '#F59E0B';
const TEAL = '#06B6D4';
const GREEN = '#22C55E';
const PURPLE = '#8B5CF6';

const tools = [
  {
    id: 'fine',
    emoji: '🚗',
    title: 'ערעור קנס תנועה',
    desc: 'AI כותב ערעור מקצועי תוך 30 שניות',
    tag: 'חינם',
    tagColor: GREEN,
    value: '300–1,500₪',
    freq: '1M+ ישראלים/שנה',
    color: TEAL,
    href: '/fine-appeal',
    live: true,
  },
  {
    id: 'pension',
    emoji: '🏦',
    title: 'גלה פנסיה אבודה',
    desc: 'כמה כסף שוכב שכחת בקרנות ישנות?',
    tag: 'בקרוב',
    tagColor: GOLD,
    value: 'ממוצע 18,000₪',
    freq: '1.5M חשבונות רדומים',
    color: GOLD,
    href: '#',
    live: false,
  },
  {
    id: 'tax',
    emoji: '💰',
    title: 'החזר מס הכנסה',
    desc: 'בדוק אם מגיע לך החזר מהמדינה',
    tag: 'בקרוב',
    tagColor: GOLD,
    value: 'ממוצע 3,500₪',
    freq: '3.6 מיליארד ₪ לא נתבעו',
    color: PURPLE,
    href: '#',
    live: false,
  },
  {
    id: 'btl',
    emoji: '🏥',
    title: 'זכאות ביטוח לאומי',
    desc: 'קצבאות ומענקים שאולי לא ידעת שמגיעים לך',
    tag: 'בקרוב',
    tagColor: GOLD,
    value: '4,291₪/חודש',
    freq: '20–30% לא תובעים',
    color: GREEN,
    href: '#',
    live: false,
  },
  {
    id: 'claim',
    emoji: '⚖️',
    title: 'תביעה בסכום קטן',
    desc: 'הכן תביעה נגד עסק ללא עורך דין',
    tag: 'בקרוב',
    tagColor: GOLD,
    value: 'עד 37,500₪',
    freq: 'ניתן ללא עו"ד',
    color: TEAL,
    href: '#',
    live: false,
  },
  {
    id: 'will',
    emoji: '📜',
    title: 'צוואה פשוטה',
    desc: '50% מהישראלים מתים ללא צוואה — תדאג לעתיד',
    tag: 'בקרוב',
    tagColor: GOLD,
    value: 'חיסכון 3,000–18,000₪',
    freq: '50% ללא צוואה',
    color: PURPLE,
    href: '#',
    live: false,
  },
];

export default function Zakai() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const totalValue = '25,000+₪';

  return (
    <div style={{ minHeight: '100vh', background: BG, direction: 'rtl', fontFamily: 'Heebo, sans-serif', position: 'relative' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: -120, right: -80, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', padding: '32px 20px 60px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ color: GOLD, fontSize: 12, fontWeight: 700 }}>🔍 מה מגיע לי?</span>
          </div>

          <h1 style={{ color: '#F8FAFC', fontSize: 32, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>
            הישראלי הממוצע מפסיד<br />
            <span style={{ color: GOLD }}>{totalValue} בשנה</span>
          </h1>
          <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 16, margin: '0 0 24px', lineHeight: 1.6 }}>
            קנסות שאפשר לערער, פנסיה אבודה, מס הכנסה, ביטוח לאומי —<br />
            AI עוזר לך לתבוע מה שמגיע לך. בחינם.
          </p>

          {/* Big stat */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            {[
              { n: '25B₪', label: 'כסף לא מנוצל בישראל' },
              { n: '6', label: 'כלים בחינם' },
              { n: '30 שניות', label: 'לכל ערעור' },
            ].map(s => (
              <div key={s.n} style={{ textAlign: 'center' }}>
                <div style={{ color: GOLD, fontSize: 22, fontWeight: 900 }}>{s.n}</div>
                <div style={{ color: 'rgba(248,250,252,0.35)', fontSize: 12 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {tools.map(tool => (
            <div key={tool.id}
              onMouseEnter={() => setHoveredId(tool.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: hoveredId === tool.id ? 'rgba(248,250,252,0.07)' : 'rgba(248,250,252,0.04)',
                border: `1px solid ${hoveredId === tool.id ? `rgba(${tool.color === TEAL ? '6,182,212' : tool.color === GOLD ? '245,158,11' : tool.color === GREEN ? '34,197,94' : '139,92,246'},0.3)` : 'rgba(248,250,252,0.08)'}`,
                borderRadius: 18,
                padding: 20,
                transition: 'all 0.2s',
                cursor: tool.live ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden',
              }}>
              {/* Tag */}
              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                <span style={{ background: tool.live ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.1)', border: `1px solid ${tool.tagColor}33`, borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 700, color: tool.tagColor }}>
                  {tool.tag}
                </span>
              </div>

              <div style={{ fontSize: 36, marginBottom: 10 }}>{tool.emoji}</div>
              <h3 style={{ color: '#F8FAFC', fontSize: 17, fontWeight: 800, margin: '0 0 6px' }}>{tool.title}</h3>
              <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 13, margin: '0 0 14px', lineHeight: 1.5 }}>{tool.desc}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ color: GREEN, fontSize: 13, fontWeight: 700 }}>💵 {tool.value}</span>
                <span style={{ color: 'rgba(248,250,252,0.3)', fontSize: 11 }}>{tool.freq}</span>
              </div>

              {tool.live ? (
                <Link to={tool.href} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px', borderRadius: 10, textDecoration: 'none',
                  background: `linear-gradient(135deg, ${tool.color}, ${tool.color}BB)`,
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  boxShadow: `0 4px 16px ${tool.color}33`,
                }}>
                  התחל עכשיו <ArrowLeft size={14} />
                </Link>
              ) : (
                <div style={{ padding: '10px', borderRadius: 10, textAlign: 'center', background: 'rgba(248,250,252,0.04)', border: '1px solid rgba(248,250,252,0.08)', color: 'rgba(248,250,252,0.25)', fontSize: 13 }}>
                  בקרוב — רשום מייל לקבלת התראה
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Email capture for waitlist */}
        <div style={{ marginTop: 40, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
          <p style={{ color: GOLD, fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>רוצה להיות ראשון לדעת?</p>
          <p style={{ color: 'rgba(248,250,252,0.45)', fontSize: 14, margin: '0 0 20px' }}>כל הכלים יוצאים בקרוב. השאר מייל ונודיע לך.</p>
          <div style={{ display: 'flex', gap: 10, maxWidth: 380, margin: '0 auto' }}>
            <input type="email" placeholder="האימייל שלך" style={{
              flex: 1, padding: '12px 16px', borderRadius: 12,
              background: 'rgba(248,250,252,0.06)', border: '1px solid rgba(248,250,252,0.12)',
              color: '#F8FAFC', fontSize: 14, fontFamily: 'Heebo, sans-serif', outline: 'none',
            }} />
            <button style={{
              padding: '12px 20px', borderRadius: 12, border: 'none',
              background: `linear-gradient(135deg, ${GOLD}, #D97706)`,
              color: '#18243A', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
            }}>
              אשמור מקום
            </button>
          </div>
        </div>

        {/* Back link */}
        <p style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/" style={{ color: 'rgba(248,250,252,0.3)', fontSize: 13, textDecoration: 'none' }}>
            ← חזור לדף הבית
          </Link>
        </p>
      </div>
    </div>
  );
}
