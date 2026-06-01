import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Welcome from './pages/Welcome';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AITools from './pages/AITools';

// Tenant
import TenantOnboarding from './pages/tenant/TenantOnboarding';
import TenantHome from './pages/tenant/TenantHome';
import TenantProfile from './pages/tenant/TenantProfile';
import ShareProfile from './pages/tenant/ShareProfile';
import TenantGuides from './pages/tenant/TenantGuides';

// Agent
import AgentDashboard from './pages/agent/AgentDashboard';

// Landlord
import LandlordOnboarding from './pages/landlord/LandlordOnboarding';
import LandlordHome from './pages/landlord/LandlordHome';
import LandlordProfile from './pages/landlord/LandlordProfile';
import Properties from './pages/landlord/Properties';
import AddProperty from './pages/landlord/AddProperty';

// Public
import PublicProfile from './pages/public/PublicProfile';

// Guides
import TenantRights from './pages/guides/TenantRights';
import LeaseChecklist from './pages/guides/LeaseChecklist';
import ApartmentSearch from './pages/guides/ApartmentSearch';
import CostCalculator from './pages/guides/CostCalculator';

// Static
import FAQ from './pages/static/FAQ';
import Contact from './pages/static/Contact';
import PrivacyPolicy from './pages/static/PrivacyPolicy';
import TermsOfService from './pages/static/TermsOfService';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Welcome />;
  if (user.user_type === 'tenant') return <Navigate to="/tenant/home" replace />;
  // Check if this landlord user is actually an agent (has agent_type flag in localStorage)
  const agentFlag = localStorage.getItem(`rentscore_agent_${user.id}`);
  return <Navigate to={agentFlag ? '/agent/home' : '/landlord/home'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/demo" element={<PublicProfile isDemo />} />
      <Route path="/profile/:id" element={<PublicProfile />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />

      {/* Tenant */}
      <Route path="/tenant/onboarding" element={
        <ProtectedRoute userType="tenant"><TenantOnboarding /></ProtectedRoute>
      } />
      <Route path="/tenant/home" element={
        <ProtectedRoute userType="tenant"><TenantHome /></ProtectedRoute>
      } />
      <Route path="/tenant/profile" element={
        <ProtectedRoute userType="tenant"><TenantProfile /></ProtectedRoute>
      } />
      <Route path="/tenant/share-profile" element={
        <ProtectedRoute userType="tenant"><ShareProfile /></ProtectedRoute>
      } />
      <Route path="/tenant/guides" element={
        <ProtectedRoute userType="tenant"><TenantGuides /></ProtectedRoute>
      } />
      <Route path="/tenant/guides/rights" element={
        <ProtectedRoute userType="tenant"><TenantRights /></ProtectedRoute>
      } />
      <Route path="/tenant/guides/checklist" element={
        <ProtectedRoute userType="tenant"><LeaseChecklist /></ProtectedRoute>
      } />
      <Route path="/tenant/guides/search" element={
        <ProtectedRoute userType="tenant"><ApartmentSearch /></ProtectedRoute>
      } />
      <Route path="/tenant/guides/calculator" element={
        <ProtectedRoute userType="tenant"><CostCalculator /></ProtectedRoute>
      } />

      {/* Agent */}
      <Route path="/agent/home" element={
        <ProtectedRoute userType="landlord"><AgentDashboard /></ProtectedRoute>
      } />

      {/* Landlord */}
      <Route path="/landlord/onboarding" element={
        <ProtectedRoute userType="landlord"><LandlordOnboarding /></ProtectedRoute>
      } />
      <Route path="/landlord/home" element={
        <ProtectedRoute userType="landlord"><LandlordHome /></ProtectedRoute>
      } />
      <Route path="/landlord/profile" element={
        <ProtectedRoute userType="landlord"><LandlordProfile /></ProtectedRoute>
      } />
      <Route path="/landlord/properties" element={
        <ProtectedRoute userType="landlord"><Properties /></ProtectedRoute>
      } />
      <Route path="/landlord/add-property" element={
        <ProtectedRoute userType="landlord"><AddProperty /></ProtectedRoute>
      } />

      {/* AI Tools — accessible to both user types */}
      <Route path="/ai-tools" element={
        <ProtectedRoute><AITools /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            style: { fontFamily: 'Heebo, sans-serif', direction: 'rtl' },
            duration: 3000,
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
