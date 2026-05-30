import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  userType?: 'tenant' | 'landlord';
}

export default function ProtectedRoute({ children, userType }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-tenant-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (userType && user.user_type !== userType) {
    return <Navigate to={user.user_type === 'tenant' ? '/tenant/home' : '/landlord/home'} replace />;
  }

  return <>{children}</>;
}
