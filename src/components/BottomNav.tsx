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
  const isTenant = user.user_type === 'tenant';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 pb-safe" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.92)', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
      <div className="flex justify-around py-1">
        {items.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          const activeColor = isTenant ? '#0d9488' : '#d97706';
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center py-2 px-5 relative transition-transform active:scale-90"
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full"
                  style={{ background: activeColor }}
                />
              )}
              <Icon
                className="w-6 h-6 transition-all"
                style={{ color: active ? activeColor : '#94a3b8', transform: active ? 'scale(1.1)' : 'scale(1)' }}
              />
              <span
                className="text-xs mt-0.5 font-semibold transition-colors"
                style={{ color: active ? activeColor : '#94a3b8' }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
