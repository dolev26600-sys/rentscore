import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, Search, Calculator } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import BottomNav from '../../components/BottomNav';

const guides = [
  {
    to: '/tenant/guides/rights',
    icon: Shield,
    title: 'זכויות השוכר',
    desc: 'כל מה שצריך לדעת על הזכויות שלך לפי חוק שכירות הוגנת',
    color: 'from-blue-500 to-blue-700',
  },
  {
    to: '/tenant/guides/checklist',
    icon: FileText,
    title: 'רשימת תיוג לחוזה',
    desc: 'בדוק את החוזה לפני חתימה - 20 נקודות חשובות',
    color: 'from-tenant-500 to-tenant-700',
  },
  {
    to: '/tenant/guides/search',
    icon: Search,
    title: 'טיפים לחיפוש דירה',
    desc: 'כיצד למצוא דירה בישראל - מדריך מלא',
    color: 'from-purple-500 to-purple-700',
  },
  {
    to: '/tenant/guides/calculator',
    icon: Calculator,
    title: 'מחשבון עלויות',
    desc: 'חשב את כל העלויות לפני המעבר לדירה חדשה',
    color: 'from-landlord-500 to-landlord-700',
  },
];

export default function TenantGuides() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="מדריכים" showBack={false} />
      <div className="mx-4 mt-4 space-y-3">
        {guides.map(guide => (
          <button
            key={guide.to}
            onClick={() => navigate(guide.to)}
            className={`w-full bg-gradient-to-l ${guide.color} rounded-2xl p-5 text-right shadow-md active:scale-98 transition-transform`}
          >
            <guide.icon className="w-8 h-8 text-white mb-2" />
            <h3 className="text-white font-bold text-lg">{guide.title}</h3>
            <p className="text-white/80 text-sm mt-1">{guide.desc}</p>
          </button>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
