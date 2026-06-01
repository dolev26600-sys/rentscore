import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  showBack?: boolean;
  backTo?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export default function PageHeader({ title, showBack = true, backTo, onBack, right }: Props) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div className="sticky top-0 z-10 px-4 py-3.5 flex items-center justify-between"
      style={{ background: 'rgba(240,244,250,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(10,28,61,0.06)' }}>
      {showBack ? (
        <button onClick={handleBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: 'rgba(10,28,61,0.06)' }}>
          <ChevronRight className="w-5 h-5" style={{ color: '#3A5070' }} />
        </button>
      ) : <div className="w-9" />}
      <h1 className="text-[17px] font-black" style={{ color: '#0A1C3D' }}>{title}</h1>
      {right ? right : <div className="w-9" />}
    </div>
  );
}
