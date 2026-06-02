import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, BookOpen, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const tenantItems = [
    { to: '/tenant/home',    icon: Home,      label: 'בית' },
    { to: '/tenant/profile', icon: User,      label: 'פרופיל' },
    { to: '/tenant/guides',  icon: BookOpen,  label: 'מדריכים' },
  ];

  const landlordItems = [
    { to: '/landlord/home',       icon: Home,      label: 'בית' },
    { to: '/landlord/properties', icon: Building2, label: 'נכסים' },
    { to: '/landlord/profile',    icon: User,      label: 'פרופיל' },
  ];

  const items = user.user_type === 'tenant' ? tenantItems : landlordItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20"
      style={{
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        background: 'rgba(15,23,42,0.9)',
        borderTop: '1px solid rgba(248,250,252,0.07)',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
      }}>
      <div className="flex justify-around pt-2 pb-1">
        {items.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to}
              className="flex flex-col items-center px-6 pt-2 pb-1 relative transition-all active:scale-90">
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                  style={{ background: '#F59E0B' }} />
              )}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${active ? '' : ''}`}
                style={active ? { background:'rgba(245,158,11,0.12)' } : {}}>
                <Icon style={{
                  width: 20, height: 20,
                  color: active ? '#F59E0B' : 'rgba(248,250,252,0.3)',
                  transition: 'all 0.2s',
                }} />
              </div>
              <span className="text-[10px] font-bold mt-0.5 transition-colors"
                style={{ color: active ? '#F59E0B' : 'rgba(248,250,252,0.25)' }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
