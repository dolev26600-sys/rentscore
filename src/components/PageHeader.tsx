import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  showBack?: boolean;
  backTo?: string;
  right?: React.ReactNode;
}

export default function PageHeader({ title, showBack = true, backTo, right }: Props) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      {showBack ? (
        <button onClick={handleBack} className="p-1 -mr-1">
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      ) : <div className="w-8" />}
      <h1 className="text-lg font-bold text-gray-800">{title}</h1>
      {right ? right : <div className="w-8" />}
    </div>
  );
}
