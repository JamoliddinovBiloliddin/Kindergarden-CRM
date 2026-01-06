import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useApp } from '@/contexts/AppContext';

export const MainLayout: React.FC = () => {
  const { isAuthenticated } = useApp();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex">
      <Sidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
