import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, BookOpen, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const tenantItems = [
    { to: '/tenant/home', icon: Home, label: 'בית' },
    { to: '/tenant/profile', icon: User, label: 'פרופיל' },
    { to: '/tenant/guides', icon: BookOpen, label: 'מדריכים' },
  ];

  const landlordItems = [
    { to: '/landlord/home', icon: Home, label: 'בית' },
    { to: '/landlord/properties', icon: Building2, label: 'נכסים' },
    { to: '/landlord/profile', icon: User, label: 'פרופיל' },
  ];

  const items = user.user_type === 'tenant' ? tenantItems : landlordItems;
  const activeColor = user.user_type === 'tenant' ? 'text-tenant-600' : 'text-landlord-600';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-20">
      <div className="flex justify-around">
        {items.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center py-2 px-4 min-w-[64px] ${active ? activeColor : 'text-gray-400'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-0.5 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
